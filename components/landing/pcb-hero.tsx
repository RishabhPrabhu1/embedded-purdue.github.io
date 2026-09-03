"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 760
const GOLD = "#daa000"
const BRIGHT = "#f4c64d"
const LOGO = { x: 270, y: 211, width: 1060, height: 338 }
const LOGO_SCALE = LOGO.width / 1920
const CIRCUIT_SPEED = 880

type Point = readonly [number, number]
type Route = readonly Point[]
type PreparedRoute = { points: Route; segments: number[]; total: number; path: Path2D }
type PreparedTrace = { path: Path2D; head: Point }

type CircuitSpec = {
  pathIndex: number
  from: number
  to: number
  port: Point
  bends: Route
  delay: number
}

type CircuitRuntime = {
  spec: CircuitSpec
  feederRoute: PreparedRoute
  logoRoute: PreparedRoute
  total: number
  duration: number
  feederEndTime: number
  end: number
}

type MeasuredLogoPath = {
  d: string
  length: number
  centerX: number
}

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .00, to: .29, port: [42, 152], bends: [[150,152],[150,210],[240,210]], delay: .28 },
  { pathIndex: 0, from: .24, to: .54, port: [42, 304], bends: [[150,304],[150,350],[240,350]], delay: .36 },
  { pathIndex: 0, from: .49, to: .79, port: [320, 42], bends: [[320,120],[410,120],[410,215]], delay: .44 },
  { pathIndex: 0, from: .74, to: 1.00, port: [640, 42], bends: [[640,120],[590,120],[590,215]], delay: .52 },

  { pathIndex: 1, from: .00, to: .29, port: [960, 42], bends: [[960,120],[1010,120],[1010,215]], delay: .32 },
  { pathIndex: 1, from: .24, to: .54, port: [42, 456], bends: [[150,456],[150,410],[240,410]], delay: .40 },
  { pathIndex: 1, from: .49, to: .79, port: [1558, 456], bends: [[1450,456],[1450,410],[1360,410]], delay: .48 },
  { pathIndex: 1, from: .74, to: 1.00, port: [320, 718], bends: [[320,640],[410,640],[410,550]], delay: .56 },

  { pathIndex: 2, from: .00, to: .29, port: [1558, 152], bends: [[1450,152],[1450,210],[1360,210]], delay: .34 },
  { pathIndex: 2, from: .24, to: .54, port: [1558, 304], bends: [[1450,304],[1450,350],[1360,350]], delay: .42 },
  { pathIndex: 2, from: .49, to: .79, port: [960, 718], bends: [[960,640],[1010,640],[1010,550]], delay: .50 },
  { pathIndex: 2, from: .74, to: 1.00, port: [640, 718], bends: [[640,640],[590,640],[590,550]], delay: .58 },

  { pathIndex: 3, from: .00, to: .29, port: [1280, 42], bends: [[1280,120],[1190,120],[1190,215]], delay: .38 },
  { pathIndex: 3, from: .24, to: .54, port: [1558, 608], bends: [[1450,608],[1450,550],[1360,550]], delay: .46 },
  { pathIndex: 3, from: .49, to: .79, port: [1280, 718], bends: [[1280,640],[1190,640],[1190,550]], delay: .54 },
  { pathIndex: 3, from: .74, to: 1.00, port: [42, 608], bends: [[150,608],[150,550],[240,550]], delay: .62 },
]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

function prepareRoute(points: Route): PreparedRoute {
  const segments: number[] = []
  const path = new Path2D()
  let total = 0

  path.moveTo(points[0][0], points[0][1])

  for (let index = 1; index < points.length; index++) {
    const length = Math.hypot(
      points[index][0] - points[index - 1][0],
      points[index][1] - points[index - 1][1]
    )
    segments.push(length)
    total += length
    path.lineTo(points[index][0], points[index][1])
  }

  return { points, segments, total, path }
}

function tracePrepared(route: PreparedRoute, progress: number): PreparedTrace {
  const clampedProgress = clamp01(progress)
  const first = route.points[0]

  if (clampedProgress <= 0) {
    const path = new Path2D()
    path.moveTo(first[0], first[1])
    return { path, head: first }
  }

  if (clampedProgress >= 1) {
    return { path: route.path, head: route.points[route.points.length - 1] }
  }

  let remaining = route.total * clampedProgress
  let head: Point = first
  const path = new Path2D()
  path.moveTo(first[0], first[1])

  for (let index = 1; index < route.points.length; index++) {
    const [x0, y0] = route.points[index - 1]
    const [x1, y1] = route.points[index]
    const segment = route.segments[index - 1]

    if (remaining >= segment) {
      path.lineTo(x1, y1)
      remaining -= segment
      head = route.points[index]
      continue
    }

    const ratio = segment === 0 ? 0 : remaining / segment
    const x = x0 + (x1 - x0) * ratio
    const y = y0 + (y1 - y0) * ratio
    path.lineTo(x, y)
    head = [x, y]
    break
  }

  return { path, head }
}

function strokePrepared(
  ctx: CanvasRenderingContext2D,
  trace: PreparedTrace,
  stroke: string,
  width: number
) {
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.stroke(trace.path)
}

function createLightPoolSprite() {
  const size = 320
  const sprite = document.createElement("canvas")
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext("2d", { alpha: true })
  if (!ctx) return null

  const center = size / 2
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, "rgba(244,198,77,.40)")
  gradient.addColorStop(.14, "rgba(218,160,0,.22)")
  gradient.addColorStop(.46, "rgba(218,160,0,.07)")
  gradient.addColorStop(1, "rgba(218,160,0,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

function drawLightPool(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement | null,
  [x, y]: Point,
  radius: number,
  intensity: number
) {
  if (intensity <= 0) return

  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  ctx.globalAlpha *= intensity

  if (sprite) {
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2)
  } else {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, "rgba(244,198,77,.40)")
    gradient.addColorStop(.14, "rgba(218,160,0,.22)")
    gradient.addColorStop(.46, "rgba(218,160,0,.07)")
    gradient.addColorStop(1, "rgba(218,160,0,0)")
    ctx.fillStyle = gradient
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }

  ctx.restore()
}

function logoPoint([x, y]: Point): Point {
  return [LOGO.x + x * LOGO_SCALE, LOGO.y + y * LOGO_SCALE]
}

function createSvgPath(d: string) {
  const namespace = "http://www.w3.org/2000/svg"
  const path = document.createElementNS(namespace, "path")
  path.setAttribute("d", d)
  return path
}

function measureLogoPath(d: string): MeasuredLogoPath {
  const path = createSvgPath(d)
  const length = path.getTotalLength()
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY

  for (let index = 0; index <= 28; index++) {
    const point = path.getPointAtLength(length * (index / 28))
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
  }

  return { d, length, centerX: (minX + maxX) / 2 }
}

function sampleLogoSegment(d: string, from: number, to: number): Point[] {
  const path = createSvgPath(d)
  const total = path.getTotalLength()
  const span = Math.abs(to - from) * total
  const samples = Math.max(24, Math.min(120, Math.ceil(span / 8)))
  const points: Point[] = []

  for (let index = 0; index <= samples; index++) {
    const ratio = index / samples
    const fraction = from + (to - from) * ratio
    const point = path.getPointAtLength(total * fraction)
    points.push(logoPoint([point.x, point.y]))
  }

  return points
}

function orthogonalJoin(from: Point, to: Point, horizontalFirst: boolean): Point[] {
  if (horizontalFirst) return [[to[0], from[1]], to]
  return [[from[0], to[1]], to]
}

function buildCircuit(spec: CircuitSpec, logoPaths: readonly string[]): CircuitRuntime {
  const logoSegment = sampleLogoSegment(logoPaths[spec.pathIndex], spec.from, spec.to)
  const firstLogo = logoSegment[0]
  const feeder: Point[] = [spec.port, ...spec.bends]
  const lastFeeder = feeder[feeder.length - 1]
  const entersFromSide = spec.port[0] <= 60 || spec.port[0] >= VW - 60
  feeder.push(...orthogonalJoin(lastFeeder, firstLogo, entersFromSide))

  const feederRoute = prepareRoute(feeder)
  const logoRoute = prepareRoute(logoSegment)
  const total = feederRoute.total + logoRoute.total
  const duration = total / CIRCUIT_SPEED
  const feederDuration = feederRoute.total / CIRCUIT_SPEED

  return {
    spec,
    feederRoute,
    logoRoute,
    total,
    duration,
    feederEndTime: spec.delay + feederDuration,
    end: spec.delay + duration,
  }
}

async function loadLogoPaths() {
  const response = await fetch("/logo.svg")
  if (!response.ok) throw new Error("Unable to load logo geometry")

  const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml")
  const paths = Array.from(svg.querySelectorAll("path"))
    .map((path) => path.getAttribute("d"))
    .filter((d): d is string => Boolean(d))
    .map(measureLogoPath)
    .sort((a, b) => b.length - a.length)
    .slice(0, 4)
    .sort((a, b) => a.centerX - b.centerX)

  if (paths.length < 4) throw new Error("Logo geometry is incomplete")
  return paths.map((path) => path.d)
}

export function PcbHero() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copyVisible, setCopyVisible] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return

    const shell = hero.closest("[data-landing-shell]") as HTMLElement | null

    if (document.documentElement.hasAttribute("data-esap-return-poster")) {
      shell?.style.setProperty("--landing-nav-opacity", "1")
      shell?.style.setProperty("--landing-content-opacity", "1")
      return
    }

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const lightPoolSprite = createLightPoolSprite()
    const formationLayer = document.createElement("canvas")
    formationLayer.width = VW
    formationLayer.height = VH
    const formationContext = formationLayer.getContext("2d", { alpha: true })
    if (formationContext) {
      formationContext.imageSmoothingEnabled = true
      formationContext.imageSmoothingQuality = "high"
    }

    let frame = 0
    let cancelled = false
    let complete = false
    let copyShown = false
    let navShown = false
    let pageShown = false
    let formationSettled = false
    let startTime = 0
    let dpr = 1
    let cssWidth = 1
    let cssHeight = 1
    let scaleX = 1
    let scaleY = 1
    let renderOffsetY = 0
    let logoImage: HTMLImageElement | null = null
    let circuits: CircuitRuntime[] = []
    let lockStart = 0
    let navStart = 0
    let copyStart = 0
    let pageStart = 0
    let animationEnd = 0
    let scrollLocked = false
    let lockedScrollY = 0

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let skipAnimation = reducedMotion
    try {
      skipAnimation = skipAnimation || window.sessionStorage.getItem("esap-landing-animation-seen") === "1"
    } catch {
      // Storage can be unavailable in hardened/private browser contexts.
    }

    const root = document.documentElement
    const body = document.body
    const previousRootOverflowY = root.style.overflowY
    const previousRootOverscrollY = root.style.overscrollBehaviorY
    const previousRootTouchAction = root.style.touchAction
    const previousBodyOverflowY = body.style.overflowY
    const previousBodyOverscrollY = body.style.overscrollBehaviorY
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyLeft = body.style.left
    const previousBodyRight = body.style.right
    const previousBodyWidth = body.style.width
    const previousBodyTouchAction = body.style.touchAction

    const preventScroll = (event: Event) => {
      if (scrollLocked) event.preventDefault()
    }

    const preventScrollKeys = (event: KeyboardEvent) => {
      if (!scrollLocked) return

      const target = event.target as HTMLElement | null
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return
      }

      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        event.preventDefault()
      }
    }

    const removeScrollGuards = () => {
      window.removeEventListener("wheel", preventScroll)
      window.removeEventListener("touchmove", preventScroll)
      window.removeEventListener("keydown", preventScrollKeys, true)
    }

    const restoreScroll = () => {
      if (!scrollLocked) return

      removeScrollGuards()
      root.style.overflowY = previousRootOverflowY
      root.style.overscrollBehaviorY = previousRootOverscrollY
      root.style.touchAction = previousRootTouchAction
      body.style.overflowY = previousBodyOverflowY
      body.style.overscrollBehaviorY = previousBodyOverscrollY
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.left = previousBodyLeft
      body.style.right = previousBodyRight
      body.style.width = previousBodyWidth
      body.style.touchAction = previousBodyTouchAction
      scrollLocked = false
      window.scrollTo(0, lockedScrollY)
    }

    const finishHandoff = () => {
      restoreScroll()
      setSettled(true)
    }

    if (!skipAnimation) {
      window.scrollTo(0, 0)
      lockedScrollY = 0
      root.style.overflowY = "hidden"
      root.style.overscrollBehaviorY = "none"
      root.style.touchAction = "none"
      body.style.overflowY = "hidden"
      body.style.overscrollBehaviorY = "none"
      body.style.position = "fixed"
      body.style.top = "0px"
      body.style.left = "0"
      body.style.right = "0"
      body.style.width = "100%"
      body.style.touchAction = "none"
      scrollLocked = true
      window.addEventListener("wheel", preventScroll, { passive: false })
      window.addEventListener("touchmove", preventScroll, { passive: false })
      window.addEventListener("keydown", preventScrollKeys, true)
    }

    const revealNavigation = () => {
      if (navShown) return
      navShown = true
      shell?.style.setProperty("--landing-nav-opacity", "1")
    }

    const revealPage = () => {
      if (pageShown) return
      pageShown = true
      shell?.style.setProperty("--landing-content-opacity", "1")
    }

    const revealEverything = () => {
      revealNavigation()
      revealPage()
      if (!copyShown) {
        copyShown = true
        setCopyVisible(true)
      }
    }

    if (skipAnimation) {
      revealEverything()
      setSettled(true)
    }

    const resize = () => {
      const rect = hero.getBoundingClientRect()
      cssWidth = Math.max(1, rect.width)
      cssHeight = Math.max(1, window.innerHeight)

      const legacyHeroHeight = Math.max(600, Math.min(cssHeight * .78, 760))
      scaleX = cssWidth / VW
      scaleY = legacyHeroHeight / VH
      renderOffsetY = (cssHeight - legacyHeroHeight) / 2

      const nativeDpr = window.devicePixelRatio || 1
      const pixelBudgetDpr = Math.sqrt(2_600_000 / (cssWidth * cssHeight))
      dpr = Math.min(nativeDpr, 1.35, Math.max(1.1, pixelBudgetDpr))
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = "high"
      if (complete) draw(animationEnd)
    }

    const getCircuitProgress = (circuit: CircuitRuntime, time: number) => {
      const travelled = clamp01((time - circuit.spec.delay) / circuit.duration) * circuit.total
      const feederProgress = clamp01(travelled / Math.max(1, circuit.feederRoute.total))
      const logoProgress = clamp01(
        (travelled - circuit.feederRoute.total) / Math.max(1, circuit.logoRoute.total)
      )
      return { feederProgress, logoProgress }
    }

    const getNetworkOpacity = (time: number) => .30 + .70 * (1 - smoothstep((time - lockStart) / .72))

    const drawAmbientLight = (time: number) => {
      const settle = smoothstep((time - lockStart) / .72)
      if (settle <= 0) return

      const centerX = LOGO.x + LOGO.width / 2
      const centerY = LOGO.y + LOGO.height / 2
      const gradient = context.createRadialGradient(centerX, centerY, 40, centerX, centerY, 690)
      gradient.addColorStop(0, `rgba(244,198,77,${.07 * settle})`)
      gradient.addColorStop(.34, `rgba(218,160,0,${.035 * settle})`)
      gradient.addColorStop(.72, `rgba(218,160,0,${.01 * settle})`)
      gradient.addColorStop(1, "rgba(218,160,0,0)")

      context.save()
      context.globalCompositeOperation = "lighter"
      context.fillStyle = gradient
      context.fillRect(0, 0, VW, VH)
      context.restore()
    }

    const drawPorts = (time: number) => {
      const networkOpacity = getNetworkOpacity(time)
      const settledOpacity = .24 + networkOpacity * .76

      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const circuit = circuits[index]
        const activation = circuit
          ? smoothstep((time - (circuit.spec.delay - .12)) / .16)
          : 0
        const pulse = circuit
          ? clamp01((time - (circuit.spec.delay - .12)) / .34)
          : 0

        drawLightPool(
          context,
          lightPoolSprite,
          spec.port,
          42 + activation * 18,
          (.12 + activation * .46) * settledOpacity
        )

        context.save()
        context.globalAlpha = settledOpacity
        context.beginPath()
        context.arc(x, y, 9.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(0,0,0,.98)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.48 + activation * .42})`
        context.lineWidth = 1.35
        context.stroke()

        context.beginPath()
        context.arc(x, y, 3.25 + activation * .45, 0, Math.PI * 2)
        context.fillStyle = BRIGHT
        context.globalAlpha *= .55 + activation * .45
        context.fill()
        context.restore()

        if (pulse > 0 && pulse < 1 && networkOpacity > .05) {
          context.save()
          context.globalAlpha = networkOpacity
          context.beginPath()
          context.arc(x, y, 11 + pulse * 25, 0, Math.PI * 2)
          context.strokeStyle = `rgba(244,198,77,${.24 * (1 - pulse)})`
          context.lineWidth = 1
          context.stroke()
          context.restore()
        }
      })
    }

    const drawLogoFormation = (time: number) => {
      if (!logoImage || !formationContext) return

      if (!formationSettled) {
        formationContext.setTransform(1, 0, 0, 1, 0, 0)
        formationContext.clearRect(0, 0, VW, VH)
        formationContext.globalCompositeOperation = "source-over"

        circuits.forEach((circuit) => {
          const { logoProgress } = getCircuitProgress(circuit, time)
          if (logoProgress <= 0) return

          const bloomTrace = tracePrepared(circuit.logoRoute, clamp01(logoProgress + .035))
          const coreTrace = tracePrepared(circuit.logoRoute, logoProgress)

          formationContext.save()
          formationContext.globalAlpha = .16
          strokePrepared(formationContext, bloomTrace, "#ffffff", 112)
          formationContext.globalAlpha = .55
          strokePrepared(formationContext, coreTrace, "#ffffff", 72)
          formationContext.globalAlpha = 1
          strokePrepared(formationContext, coreTrace, "#ffffff", 38)
          formationContext.restore()
        })

        formationContext.globalCompositeOperation = "source-in"
        formationContext.globalAlpha = 1
        formationContext.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
        formationContext.globalCompositeOperation = "source-over"

        if (time >= lockStart) formationSettled = true
      }

      context.save()
      context.globalCompositeOperation = "lighter"
      context.globalAlpha = .10
      context.drawImage(formationLayer, -2, -2, VW + 4, VH + 4)
      context.restore()
      context.drawImage(formationLayer, 0, 0)
    }

    const drawLogoLock = (time: number) => {
      if (!logoImage) return
      const solid = smoothstep((time - lockStart) / .56)
      if (solid <= 0) return

      context.save()
      context.globalAlpha = solid * .97
      context.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      context.restore()
    }

    const drawCircuits = (time: number) => {
      const networkOpacity = getNetworkOpacity(time)
      if (networkOpacity <= .002) return

      circuits.forEach((circuit) => {
        const { feederProgress, logoProgress } = getCircuitProgress(circuit, time)
        if (feederProgress <= 0) return

        const feederTrace = tracePrepared(circuit.feederRoute, feederProgress)
        const feederActive = logoProgress <= 0 && feederProgress < 1
        const feederEnergy = feederActive ? 1 : .58

        context.save()
        context.globalCompositeOperation = "lighter"
        context.globalAlpha = .025 * feederEnergy * networkOpacity
        strokePrepared(context, feederTrace, GOLD, 38)
        context.globalAlpha = .075 * feederEnergy * networkOpacity
        strokePrepared(context, feederTrace, GOLD, 14)
        context.globalAlpha = .16 * feederEnergy * networkOpacity
        strokePrepared(context, feederTrace, BRIGHT, 5)
        context.restore()

        context.save()
        context.globalAlpha = (.88 * feederEnergy + .12) * networkOpacity
        strokePrepared(context, feederTrace, GOLD, 2.15)
        context.restore()

        if (feederActive) {
          drawLightPool(context, lightPoolSprite, feederTrace.head, 92, .74 * networkOpacity)
          context.save()
          context.globalAlpha = networkOpacity
          context.beginPath()
          context.arc(feederTrace.head[0], feederTrace.head[1], 3.1, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
          context.restore()
        }

        if (logoProgress > 0 && logoProgress < 1) {
          const logoTrace = tracePrepared(circuit.logoRoute, logoProgress)
          drawLightPool(context, lightPoolSprite, logoTrace.head, 112, .92 * networkOpacity)
          context.save()
          context.globalAlpha = networkOpacity
          context.beginPath()
          context.arc(logoTrace.head[0], logoTrace.head[1], 4.1, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
          context.restore()
        }
      })
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      context.save()
      context.translate(0, renderOffsetY)
      context.scale(scaleX, scaleY)
      drawAmbientLight(time)
      drawPorts(time)
      drawCircuits(time)
      drawLogoFormation(time)
      drawLogoLock(time)
      context.restore()
    }

    const tick = (now: number) => {
      if (cancelled) return
      if (!startTime) startTime = now

      const elapsed = (now - startTime) / 1000
      draw(elapsed)

      if (!navShown && elapsed >= navStart) revealNavigation()

      if (!copyShown && elapsed >= copyStart) {
        copyShown = true
        setCopyVisible(true)
      }

      if (!pageShown && elapsed >= pageStart) revealPage()

      if (elapsed >= animationEnd) {
        complete = true
        revealEverything()
        finishHandoff()
        return
      }

      frame = requestAnimationFrame(tick)
    }

    const start = async () => {
      try {
        const logoPaths = await loadLogoPaths()
        if (cancelled) return

        circuits = circuitSpecs.map((spec) => buildCircuit(spec, logoPaths))
        const lastDeposit = Math.max(...circuits.map((circuit) => circuit.end))

        lockStart = lastDeposit + .06
        navStart = lockStart + .10
        copyStart = lockStart + .24
        pageStart = lockStart + .48
        animationEnd = lockStart + 1.02

        if (!skipAnimation) {
          try {
            window.sessionStorage.setItem("esap-landing-animation-seen", "1")
          } catch {
            // The animation still works when storage is unavailable.
          }
        }

        const image = new Image()
        logoImage = image
        image.onload = () => {
          if (cancelled) return
          resize()

          if (skipAnimation) {
            draw(animationEnd)
            complete = true
            revealEverything()
            finishHandoff()
          } else {
            frame = requestAnimationFrame(tick)
          }
        }
        image.onerror = () => {
          if (cancelled) return
          logoImage = null
          resize()

          if (skipAnimation) {
            draw(animationEnd)
            complete = true
            revealEverything()
            finishHandoff()
          } else {
            frame = requestAnimationFrame(tick)
          }
        }
        image.src = "/logo.svg"
      } catch {
        revealEverything()
        finishHandoff()
      }
    }

    void start()
    window.addEventListener("resize", resize, { passive: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      restoreScroll()
      removeScrollGuards()
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <section
        ref={heroRef}
        className={`relative isolate overflow-hidden bg-black transition-all duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)] ${
          settled
            ? "h-[min(66svh,600px)] min-h-[500px]"
            : "h-[100svh] min-h-[100svh]"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute left-0 z-[1] h-[100svh] w-full -translate-y-1/2 transition-[top] duration-[850ms] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ top: settled ? "calc(50% + 34px)" : "50%" }}
          aria-hidden="true"
        />
      </section>

      <section
        id="hero-intro"
        className={`relative border-b transition-[background-color,border-color] duration-700 ease-out ${
          copyVisible ? "border-white/[0.08] bg-[#0b0b0a]" : "border-transparent bg-black"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#daa000]/70 to-transparent transition-opacity duration-700 ${
            copyVisible ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          data-hero-intro-grid
          className={`mx-auto grid max-w-[1440px] transition-all duration-500 lg:grid-cols-[0.5fr_1.15fr_0.85fr] ${
            copyVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <div className="flex items-center border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 xl:px-12">
            <div>
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
                  <span className="absolute h-6 w-6 rounded-full bg-[#daa000]/10 blur-sm" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_10px_rgba(244,198,77,0.55)]" />
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#c7c0b3]">
                  Embedded Systems @ Purdue
                </span>
              </div>
              <p className="mt-3 font-mono text-[0.57rem] uppercase tracking-[0.16em] text-[#67635c]">
                Hardware · Firmware · Systems
              </p>
            </div>
          </div>

          <div className="flex items-center border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 xl:px-12">
            <h1 className="max-w-3xl text-balance text-[clamp(2rem,4.4vh,3.45rem)] font-medium leading-[0.94] tracking-[-0.05em] text-[#f3efe6]">
              Build embedded systems that work in the real world.
            </h1>
          </div>

          <div className="flex items-center px-5 py-7 sm:px-8 lg:px-10 xl:px-12">
            <div>
              <p className="max-w-md text-sm leading-6 text-[#9a958b]">
                Boards, firmware, FPGAs, robotics, and the engineering required to make them work together.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button size="sm" className="h-10 px-5" asChild>
                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join ES@P
                  </Link>
                </Button>
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#bdb7ab] transition-colors hover:text-[#f2c34f]"
                >
                  Projects
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}