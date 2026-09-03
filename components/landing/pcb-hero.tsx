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

const BRANCH_SPEED = 520
const RAIL_DURATION = .52
const BUS_SPEED = 1180
const LOGO_DRAW_DURATION = 1.04

type Point = readonly [number, number]
type Route = readonly Point[]
type Side = "left" | "top" | "right" | "bottom"

type PreparedRoute = {
  points: Route
  segments: number[]
  total: number
  path: Path2D
}

type PreparedTrace = {
  path: Path2D
  head: Point
}

type MeasuredLogoPath = {
  d: string
  length: number
  centerX: number
}

type GroupSpec = {
  pathIndex: number
  side: Side
  ports: readonly Point[]
  rail: Route
  collector: Point
  delay: number
}

type BranchRuntime = {
  port: Point
  route: PreparedRoute
  start: number
  duration: number
}

type GroupRuntime = {
  spec: GroupSpec
  branches: BranchRuntime[]
  railRoute: PreparedRoute
  railStart: number
  railDuration: number
  busRoute: PreparedRoute
  busStart: number
  busDuration: number
  logoRoute: PreparedRoute
  logoStart: number
  logoDuration: number
  end: number
}

type AuxiliarySpec = {
  side: Side
  route: Route
  start: number
}

type AuxiliaryRuntime = {
  route: PreparedRoute
  start: number
  duration: number
}

const groupSpecs: readonly GroupSpec[] = [
  {
    pathIndex: 0,
    side: "left",
    ports: [[42, 152], [42, 304], [42, 456], [42, 608]],
    rail: [[170, 152], [170, 608]],
    collector: [170, 380],
    delay: .28,
  },
  {
    pathIndex: 1,
    side: "top",
    ports: [[320, 42], [640, 42], [960, 42], [1280, 42]],
    rail: [[320, 134], [1280, 134]],
    collector: [800, 134],
    delay: .35,
  },
  {
    pathIndex: 2,
    side: "bottom",
    ports: [[320, 718], [640, 718], [960, 718], [1280, 718]],
    rail: [[320, 626], [1280, 626]],
    collector: [800, 626],
    delay: .42,
  },
  {
    pathIndex: 3,
    side: "right",
    ports: [[1558, 152], [1558, 304], [1558, 456], [1558, 608]],
    rail: [[1430, 152], [1430, 608]],
    collector: [1430, 380],
    delay: .49,
  },
]

const auxiliarySpecs: readonly AuxiliarySpec[] = [
  { side: "left", route: [[170, 190], [208, 190], [208, 176], [252, 176]], start: .76 },
  { side: "left", route: [[170, 238], [224, 238], [224, 258], [252, 258]], start: .81 },
  { side: "left", route: [[170, 342], [206, 342], [206, 320], [252, 320]], start: .86 },
  { side: "left", route: [[170, 418], [220, 418], [220, 442], [252, 442]], start: .91 },
  { side: "left", route: [[170, 522], [206, 522], [206, 500], [252, 500]], start: .96 },
  { side: "left", route: [[170, 570], [224, 570], [224, 584], [252, 584]], start: 1.01 },

  { side: "top", route: [[390, 134], [390, 172], [430, 172], [430, 200]], start: .80 },
  { side: "top", route: [[540, 134], [540, 184], [574, 184], [574, 204]], start: .85 },
  { side: "top", route: [[700, 134], [700, 170], [742, 170], [742, 202]], start: .90 },
  { side: "top", route: [[900, 134], [900, 176], [862, 176], [862, 202]], start: .95 },
  { side: "top", route: [[1060, 134], [1060, 184], [1028, 184], [1028, 204]], start: 1.00 },
  { side: "top", route: [[1210, 134], [1210, 172], [1172, 172], [1172, 200]], start: 1.05 },

  { side: "bottom", route: [[390, 626], [390, 588], [430, 588], [430, 560]], start: .84 },
  { side: "bottom", route: [[540, 626], [540, 576], [574, 576], [574, 556]], start: .89 },
  { side: "bottom", route: [[700, 626], [700, 590], [742, 590], [742, 558]], start: .94 },
  { side: "bottom", route: [[900, 626], [900, 584], [862, 584], [862, 558]], start: .99 },
  { side: "bottom", route: [[1060, 626], [1060, 576], [1028, 576], [1028, 556]], start: 1.04 },
  { side: "bottom", route: [[1210, 626], [1210, 588], [1172, 588], [1172, 560]], start: 1.09 },

  { side: "right", route: [[1430, 190], [1392, 190], [1392, 176], [1348, 176]], start: .88 },
  { side: "right", route: [[1430, 238], [1376, 238], [1376, 258], [1348, 258]], start: .93 },
  { side: "right", route: [[1430, 342], [1394, 342], [1394, 320], [1348, 320]], start: .98 },
  { side: "right", route: [[1430, 418], [1380, 418], [1380, 442], [1348, 442]], start: 1.03 },
  { side: "right", route: [[1430, 522], [1394, 522], [1394, 500], [1348, 500]], start: 1.08 },
  { side: "right", route: [[1430, 570], [1376, 570], [1376, 584], [1348, 584]], start: 1.13 },

  { side: "top", route: [[170, 152], [214, 152], [214, 106], [320, 106], [320, 134]], start: .92 },
  { side: "top", route: [[1280, 134], [1280, 106], [1386, 106], [1386, 152], [1430, 152]], start: .97 },
  { side: "bottom", route: [[170, 608], [214, 608], [214, 654], [320, 654], [320, 626]], start: 1.02 },
  { side: "bottom", route: [[1280, 626], [1280, 654], [1386, 654], [1386, 608], [1430, 608]], start: 1.07 },
]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

function easeOutCubic(value: number) {
  const x = clamp01(value)
  return 1 - Math.pow(1 - x, 3)
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
  gradient.addColorStop(0, "rgba(244,198,77,.42)")
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
    gradient.addColorStop(0, "rgba(244,198,77,.42)")
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

  for (let index = 0; index <= 32; index++) {
    const point = path.getPointAtLength(length * (index / 32))
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
  }

  return { d, length, centerX: (minX + maxX) / 2 }
}

function sampleLogoPath(d: string): Point[] {
  const path = createSvgPath(d)
  const total = path.getTotalLength()
  const samples = Math.max(72, Math.min(180, Math.ceil(total / 7)))
  const points: Point[] = []

  for (let index = 0; index <= samples; index++) {
    const point = path.getPointAtLength(total * (index / samples))
    points.push(logoPoint([point.x, point.y]))
  }

  return points
}

function orthogonalJoin(from: Point, to: Point, horizontalFirst: boolean): Point[] {
  if (horizontalFirst) return [[to[0], from[1]], to]
  return [[from[0], to[1]], to]
}

function branchRoute(side: Side, port: Point): Route {
  const [x, y] = port
  switch (side) {
    case "left":
      return [port, [170, y]]
    case "top":
      return [port, [x, 134]]
    case "right":
      return [port, [1430, y]]
    case "bottom":
      return [port, [x, 626]]
  }
}

function buildGroup(spec: GroupSpec, logoPaths: readonly string[]): GroupRuntime {
  const logoRoute = prepareRoute(sampleLogoPath(logoPaths[spec.pathIndex]))
  const logoStartPoint = logoRoute.points[0]
  const horizontalEntry = spec.side === "left" || spec.side === "right"
  const busRoute = prepareRoute([
    spec.collector,
    ...orthogonalJoin(spec.collector, logoStartPoint, horizontalEntry),
  ])

  const branches = spec.ports.map((port, index) => {
    const route = prepareRoute(branchRoute(spec.side, port))
    const start = spec.delay + index * .045
    return {
      port,
      route,
      start,
      duration: Math.max(.26, route.total / BRANCH_SPEED),
    }
  })

  const railRoute = prepareRoute(spec.rail)
  const railStart = spec.delay + .14
  const railDuration = RAIL_DURATION
  const lastBranchEnd = Math.max(...branches.map((branch) => branch.start + branch.duration))
  const busStart = Math.max(lastBranchEnd, railStart + railDuration) - .10
  const busDuration = Math.max(.44, Math.min(.78, busRoute.total / BUS_SPEED))
  const logoStart = busStart + busDuration - .035
  const logoDuration = LOGO_DRAW_DURATION

  return {
    spec,
    branches,
    railRoute,
    railStart,
    railDuration,
    busRoute,
    busStart,
    busDuration,
    logoRoute,
    logoStart,
    logoDuration,
    end: logoStart + logoDuration,
  }
}

function sideAxis(side: Side, point: Point) {
  return side === "left" || side === "right" ? point[1] : point[0]
}

function edgeDistance(side: Side, point: Point) {
  switch (side) {
    case "left":
      return point[0] - LOGO.x
    case "right":
      return LOGO.x + LOGO.width - point[0]
    case "top":
      return point[1] - LOGO.y
    case "bottom":
      return LOGO.y + LOGO.height - point[1]
  }
}

function buildLogoAnchorBank(side: Side, candidates: readonly Point[], count: number): Point[] {
  if (!count || !candidates.length) return []

  const horizontal = side === "top" || side === "bottom"
  const axisStart = horizontal ? LOGO.x + 60 : LOGO.y + 24
  const axisEnd = horizontal ? LOGO.x + LOGO.width - 60 : LOGO.y + LOGO.height - 24
  const windowSize = horizontal ? 105 : 42
  const chosen: Point[] = []

  for (let index = 0; index < count; index++) {
    const ratio = count === 1 ? .5 : index / (count - 1)
    const targetAxis = axisStart + (axisEnd - axisStart) * ratio
    const nearby = candidates.filter(
      (point) => Math.abs(sideAxis(side, point) - targetAxis) <= windowSize
    )
    const pool = nearby.length ? nearby : candidates

    let best = pool[0]
    let bestScore = Number.POSITIVE_INFINITY

    pool.forEach((point) => {
      const axisPenalty = Math.abs(sideAxis(side, point) - targetAxis) * .22
      const edgePenalty = Math.max(0, edgeDistance(side, point)) * 2.4
      const reusePenalty = chosen.reduce((penalty, previous) => {
        const spacing = Math.abs(sideAxis(side, point) - sideAxis(side, previous))
        return spacing < 22 ? penalty + (22 - spacing) * 5 : penalty
      }, 0)
      const score = axisPenalty + edgePenalty + reusePenalty

      if (score < bestScore) {
        bestScore = score
        best = point
      }
    })

    chosen.push(best)
  }

  return chosen.sort((a, b) => sideAxis(side, a) - sideAxis(side, b))
}

function buildAuxiliary(
  spec: AuxiliarySpec,
  anchor: Point,
  arrivalTime: number,
  arrivalOffset: number
): AuxiliaryRuntime {
  const routePoints: Point[] = [...spec.route]
  const end = routePoints[routePoints.length - 1]
  const clearance = 24
  let approach: Point

  switch (spec.side) {
    case "left":
      approach = [anchor[0] - clearance, anchor[1]]
      routePoints.push(...orthogonalJoin(end, approach, true), anchor)
      break
    case "right":
      approach = [anchor[0] + clearance, anchor[1]]
      routePoints.push(...orthogonalJoin(end, approach, true), anchor)
      break
    case "top":
      approach = [anchor[0], anchor[1] - clearance]
      routePoints.push(...orthogonalJoin(end, approach, false), anchor)
      break
    case "bottom":
      approach = [anchor[0], anchor[1] + clearance]
      routePoints.push(...orthogonalJoin(end, approach, false), anchor)
      break
  }

  const route = prepareRoute(routePoints)
  const duration = Math.max(.42, Math.min(.96, route.total / 760))

  return {
    route,
    start: arrivalTime + arrivalOffset - duration,
    duration,
  }
}

function buildAuxiliaryNetwork(
  specs: readonly AuxiliarySpec[],
  logoAnchors: readonly Point[],
  arrivalTime: number
): AuxiliaryRuntime[] {
  const sides: readonly Side[] = ["left", "top", "right", "bottom"]
  const pending: Array<{ spec: AuxiliarySpec; anchor: Point }> = []

  sides.forEach((side) => {
    const sideSpecs = specs
      .filter((spec) => spec.side === side)
      .sort((a, b) => {
        const aEnd = a.route[a.route.length - 1]
        const bEnd = b.route[b.route.length - 1]
        return sideAxis(side, aEnd) - sideAxis(side, bEnd)
      })
    const anchors = buildLogoAnchorBank(side, logoAnchors, sideSpecs.length)

    sideSpecs.forEach((spec, index) => {
      const fallback = spec.route[spec.route.length - 1]
      pending.push({ spec, anchor: anchors[index] ?? fallback })
    })
  })

  return pending
    .map(({ spec, anchor }, index) => {
      const arrivalOffset = ((index % 7) - 3) * .012
      return buildAuxiliary(spec, anchor, arrivalTime, arrivalOffset)
    })
    .sort((a, b) => a.start - b.start)
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

    const sweepLayer = document.createElement("canvas")
    sweepLayer.width = LOGO.width
    sweepLayer.height = LOGO.height
    const sweepContext = sweepLayer.getContext("2d", { alpha: true })

    if (formationContext) {
      formationContext.imageSmoothingEnabled = true
      formationContext.imageSmoothingQuality = "high"
    }
    if (sweepContext) {
      sweepContext.imageSmoothingEnabled = true
      sweepContext.imageSmoothingQuality = "high"
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
    let groups: GroupRuntime[] = []
    let auxiliaryWires: AuxiliaryRuntime[] = []
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
      // Session storage can be unavailable in hardened/private browser contexts.
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

      const heroHeight = Math.max(600, Math.min(cssHeight * .78, 760))
      scaleX = cssWidth / VW
      scaleY = heroHeight / VH
      renderOffsetY = (cssHeight - heroHeight) / 2

      const nativeDpr = window.devicePixelRatio || 1
      const pixelBudgetDpr = Math.sqrt(2_600_000 / (cssWidth * cssHeight))
      dpr = Math.min(nativeDpr, 1.35, Math.max(1.1, pixelBudgetDpr))
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = "high"

      if (complete) draw(animationEnd)
    }

    const drawAmbient = (time: number) => {
      const convergence = smoothstep((time - .78) / .95)
      const settle = smoothstep((time - lockStart) / .7)
      const intensity = convergence * (1 - settle * .55)
      if (intensity <= 0) return

      const centerX = LOGO.x + LOGO.width / 2
      const centerY = LOGO.y + LOGO.height / 2
      const gradient = context.createRadialGradient(centerX, centerY, 40, centerX, centerY, 720)
      gradient.addColorStop(0, `rgba(244,198,77,${.055 * intensity})`)
      gradient.addColorStop(.36, `rgba(218,160,0,${.026 * intensity})`)
      gradient.addColorStop(.72, `rgba(218,160,0,${.008 * intensity})`)
      gradient.addColorStop(1, "rgba(218,160,0,0)")

      context.save()
      context.globalCompositeOperation = "lighter"
      context.fillStyle = gradient
      context.fillRect(0, 0, VW, VH)
      context.restore()
    }

    const drawPorts = (time: number) => {
      groups.forEach((group) => {
        group.branches.forEach((branch) => {
          const activation = smoothstep((time - (branch.start - .12)) / .18)
          const pulse = clamp01((time - (branch.start - .10)) / .32)

          drawLightPool(
            context,
            lightPoolSprite,
            branch.port,
            40 + activation * 18,
            .10 + activation * .34
          )

          context.save()
          context.globalAlpha = .40 + activation * .60
          context.beginPath()
          context.arc(branch.port[0], branch.port[1], 9.5, 0, Math.PI * 2)
          context.fillStyle = "rgba(0,0,0,.98)"
          context.fill()
          context.strokeStyle = `rgba(218,160,0,${.46 + activation * .46})`
          context.lineWidth = 1.35
          context.stroke()

          context.beginPath()
          context.arc(branch.port[0], branch.port[1], 3.2 + activation * .5, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
          context.restore()

          if (pulse > 0 && pulse < 1) {
            context.save()
            context.beginPath()
            context.arc(branch.port[0], branch.port[1], 11 + pulse * 24, 0, Math.PI * 2)
            context.strokeStyle = `rgba(244,198,77,${.20 * (1 - pulse)})`
            context.lineWidth = 1
            context.stroke()
            context.restore()
          }
        })
      })
    }

    const drawPoweredRoute = (
      route: PreparedRoute,
      progress: number,
      active: boolean,
      settledAlpha: number,
      headRadius: number
    ) => {
      if (progress <= 0) return

      const trace = tracePrepared(route, progress)

      if (active) {
        context.save()
        context.globalCompositeOperation = "lighter"
        context.globalAlpha = .018
        strokePrepared(context, trace, GOLD, 34)
        context.globalAlpha = .06
        strokePrepared(context, trace, GOLD, 14)
        context.globalAlpha = .17
        strokePrepared(context, trace, BRIGHT, 5)
        context.restore()
      }

      context.save()
      context.globalAlpha = active ? .92 : settledAlpha
      strokePrepared(context, trace, active ? BRIGHT : GOLD, active ? 2.35 : 1.85)
      context.restore()

      if (active) {
        drawLightPool(context, lightPoolSprite, trace.head, headRadius, .88)
        context.beginPath()
        context.arc(trace.head[0], trace.head[1], 3.4, 0, Math.PI * 2)
        context.fillStyle = BRIGHT
        context.fill()
      }
    }

    const drawAuxiliaryNetwork = (time: number) => {
      auxiliaryWires.forEach((wire) => {
        const raw = (time - wire.start) / wire.duration
        const progress = smoothstep(raw)
        if (progress <= 0) return

        const active = raw > 0 && raw < 1
        const trace = tracePrepared(wire.route, progress)
        const completionPulse = raw >= 1 ? 1 - smoothstep((raw - 1) / .28) : 0

        if (active) {
          context.save()
          context.globalCompositeOperation = "lighter"
          context.globalAlpha = .055
          strokePrepared(context, trace, GOLD, 16)
          context.globalAlpha = .15
          strokePrepared(context, trace, GOLD, 7)
          context.globalAlpha = .30
          strokePrepared(context, trace, BRIGHT, 3.8)
          context.restore()
        }

        context.save()
        context.globalAlpha = active ? .86 : .34
        strokePrepared(context, trace, active ? BRIGHT : GOLD, active ? 1.95 : 1.42)
        context.restore()

        if (active) {
          drawLightPool(context, lightPoolSprite, trace.head, 54, .40)
          context.save()
          context.globalCompositeOperation = "lighter"
          context.beginPath()
          context.arc(trace.head[0], trace.head[1], 2.4, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
          context.restore()
        }

        if (completionPulse > 0) {
          const end = wire.route.points[wire.route.points.length - 1]
          drawLightPool(context, lightPoolSprite, end, 48, .26 * completionPulse)
        }
      })
    }

    const drawNetwork = (time: number) => {
      groups.forEach((group) => {
        group.branches.forEach((branch) => {
          const raw = (time - branch.start) / branch.duration
          const progress = easeOutCubic(raw)
          drawPoweredRoute(branch.route, progress, raw > 0 && raw < 1, .25, 70)
        })

        const railRaw = (time - group.railStart) / group.railDuration
        const railProgress = smoothstep(railRaw)
        drawPoweredRoute(group.railRoute, railProgress, railRaw > 0 && railRaw < 1, .23, 74)

        const busRaw = (time - group.busStart) / group.busDuration
        const busProgress = smoothstep(busRaw)
        drawPoweredRoute(group.busRoute, busProgress, busRaw > 0 && busRaw < 1, .43, 105)
      })
    }

    const drawLogoFormation = (time: number) => {
      if (!logoImage || !formationContext) return

      if (!formationSettled) {
        formationContext.setTransform(1, 0, 0, 1, 0, 0)
        formationContext.clearRect(0, 0, VW, VH)
        formationContext.globalCompositeOperation = "source-over"

        groups.forEach((group) => {
          const progress = smoothstep((time - group.logoStart) / group.logoDuration)
          if (progress <= 0) return

          const bloomTrace = tracePrepared(group.logoRoute, clamp01(progress + .025))
          const coreTrace = tracePrepared(group.logoRoute, progress)

          formationContext.save()
          formationContext.globalAlpha = .12
          strokePrepared(formationContext, bloomTrace, "#ffffff", 108)
          formationContext.globalAlpha = .54
          strokePrepared(formationContext, coreTrace, "#ffffff", 66)
          formationContext.globalAlpha = 1
          strokePrepared(formationContext, coreTrace, "#ffffff", 34)
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
      context.globalAlpha = .09
      context.drawImage(formationLayer, -2, -2, VW + 4, VH + 4)
      context.restore()
      context.drawImage(formationLayer, 0, 0)

      groups.forEach((group) => {
        const raw = (time - group.logoStart) / group.logoDuration
        const progress = smoothstep(raw)
        if (progress <= 0 || progress >= 1) return

        const trace = tracePrepared(group.logoRoute, progress)
        context.save()
        context.globalCompositeOperation = "lighter"
        context.globalAlpha = .80
        strokePrepared(context, trace, BRIGHT, 2.0)
        context.restore()
        drawLightPool(context, lightPoolSprite, trace.head, 122, .92)
        context.beginPath()
        context.arc(trace.head[0], trace.head[1], 4.0, 0, Math.PI * 2)
        context.fillStyle = BRIGHT
        context.fill()
      })
    }

    const drawLogoLock = (time: number) => {
      if (!logoImage) return
      const solid = smoothstep((time - (lockStart - .08)) / .34)
      if (solid <= 0) return

      context.save()
      context.globalAlpha = solid * .98
      context.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      context.restore()
    }

    const drawLockSweep = (time: number) => {
      if (!logoImage || !sweepContext) return

      const raw = (time - (lockStart + .02)) / .56
      if (raw <= 0 || raw >= 1) return

      const progress = smoothstep(raw)
      const x = -120 + (LOGO.width + 240) * progress

      sweepContext.setTransform(1, 0, 0, 1, 0, 0)
      sweepContext.clearRect(0, 0, LOGO.width, LOGO.height)
      sweepContext.globalCompositeOperation = "source-over"
      sweepContext.drawImage(logoImage, 0, 0, LOGO.width, LOGO.height)
      sweepContext.globalCompositeOperation = "source-in"

      const gradient = sweepContext.createLinearGradient(x - 120, 0, x + 120, 0)
      gradient.addColorStop(0, "rgba(255,255,255,0)")
      gradient.addColorStop(.42, "rgba(255,255,255,.18)")
      gradient.addColorStop(.50, "rgba(255,255,255,.92)")
      gradient.addColorStop(.58, "rgba(255,255,255,.18)")
      gradient.addColorStop(1, "rgba(255,255,255,0)")
      sweepContext.fillStyle = gradient
      sweepContext.fillRect(0, 0, LOGO.width, LOGO.height)
      sweepContext.globalCompositeOperation = "source-over"

      context.save()
      context.globalCompositeOperation = "lighter"
      context.globalAlpha = .82
      context.drawImage(sweepLayer, LOGO.x, LOGO.y)
      context.restore()

      const worldX = LOGO.x + x
      if (worldX >= LOGO.x - 40 && worldX <= LOGO.x + LOGO.width + 40) {
        drawLightPool(context, lightPoolSprite, [worldX, LOGO.y + LOGO.height / 2], 180, .24)
      }
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      context.save()
      context.translate(0, renderOffsetY)
      context.scale(scaleX, scaleY)

      const focusIn = smoothstep((time - .78) / .52)
      const focusOut = smoothstep((time - lockStart) / .66)
      const focus = focusIn * (1 - focusOut)
      const sceneScale = 1 + .014 * focus
      context.translate(VW / 2, VH / 2 - 4 * focus)
      context.scale(sceneScale, sceneScale)
      context.translate(-VW / 2, -VH / 2)

      drawAmbient(time)
      drawAuxiliaryNetwork(time)
      drawNetwork(time)
      drawPorts(time)
      drawLogoFormation(time)
      drawLogoLock(time)
      drawLockSweep(time)
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
        draw(animationEnd)
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

        const logoAnchors = logoPaths.flatMap(sampleLogoPath)
        groups = groupSpecs.map((spec) => buildGroup(spec, logoPaths))
        const lastLogoEnd = Math.max(...groups.map((group) => group.end))
        const auxiliaryArrivalTime = lastLogoEnd - .04
        auxiliaryWires = buildAuxiliaryNetwork(auxiliarySpecs, logoAnchors, auxiliaryArrivalTime)
        const lastAuxiliaryEnd = Math.max(
          ...auxiliaryWires.map((wire) => wire.start + wire.duration)
        )
        const convergenceEnd = Math.max(lastLogoEnd, lastAuxiliaryEnd)

        lockStart = convergenceEnd + .025
        navStart = lockStart + .14
        copyStart = lockStart + .26
        pageStart = lockStart + .50
        animationEnd = lockStart + .82

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
