"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 760
const GOLD = "#daa000"
const BRIGHT = "#f4c64d"
const LOGO = { x: 270, y: 248, width: 1060, height: 338 }
const LOGO_SCALE = LOGO.width / 1920
const CIRCUIT_SPEED = 1280

type Point = readonly [number, number]
type Route = readonly Point[]
type PreparedRoute = { points: Route; segments: number[]; total: number }

type CircuitSpec = {
  pathIndex: number
  from: number
  to: number
  port: Point
  inBends: Route
  outBends: Route
  delay: number
}

type CircuitGeometry = {
  route: PreparedRoute
  logoRoute: PreparedRoute
  logoStartDistance: number
  logoEndDistance: number
}

type CircuitRuntime = CircuitGeometry & {
  spec: CircuitSpec
  duration: number
  end: number
  logoEndTime: number
}

type MeasuredLogoPath = {
  d: string
  length: number
  centerX: number
}

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .00, to: .29, port: [42, 152], inBends: [[150,152],[150,210],[240,210]], outBends: [[1360,152],[1480,152],[1640,152]], delay: .10 },
  { pathIndex: 0, from: .24, to: .54, port: [42, 304], inBends: [[150,304],[150,350],[240,350]], outBends: [[320,610],[320,760]], delay: .15 },
  { pathIndex: 0, from: .49, to: .79, port: [320, 42], inBends: [[320,120],[410,120],[410,215]], outBends: [[240,456],[120,456],[-40,456]], delay: .20 },
  { pathIndex: 0, from: .74, to: 1.00, port: [640, 42], inBends: [[640,120],[590,120],[590,215]], outBends: [[640,610],[640,760]], delay: .13 },

  { pathIndex: 1, from: .00, to: .29, port: [960, 42], inBends: [[960,120],[1010,120],[1010,215]], outBends: [[960,610],[960,760]], delay: .12 },
  { pathIndex: 1, from: .24, to: .54, port: [42, 456], inBends: [[150,456],[150,410],[240,410]], outBends: [[1360,304],[1480,304],[1640,304]], delay: .18 },
  { pathIndex: 1, from: .49, to: .79, port: [1558, 456], inBends: [[1450,456],[1450,410],[1360,410]], outBends: [[240,304],[120,304],[-40,304]], delay: .19 },
  { pathIndex: 1, from: .74, to: 1.00, port: [320, 718], inBends: [[320,640],[410,640],[410,550]], outBends: [[320,150],[320,-40]], delay: .24 },

  { pathIndex: 2, from: .00, to: .29, port: [1558, 152], inBends: [[1450,152],[1450,210],[1360,210]], outBends: [[240,152],[120,152],[-40,152]], delay: .14 },
  { pathIndex: 2, from: .24, to: .54, port: [1558, 304], inBends: [[1450,304],[1450,350],[1360,350]], outBends: [[640,150],[640,-40]], delay: .20 },
  { pathIndex: 2, from: .49, to: .79, port: [960, 718], inBends: [[960,640],[1010,640],[1010,550]], outBends: [[960,150],[960,-40]], delay: .23 },
  { pathIndex: 2, from: .74, to: 1.00, port: [640, 718], inBends: [[640,640],[590,640],[590,550]], outBends: [[1360,456],[1480,456],[1640,456]], delay: .26 },

  { pathIndex: 3, from: .00, to: .29, port: [1280, 42], inBends: [[1280,120],[1190,120],[1190,215]], outBends: [[1280,610],[1280,760]], delay: .16 },
  { pathIndex: 3, from: .24, to: .54, port: [1558, 608], inBends: [[1450,608],[1450,550],[1360,550]], outBends: [[240,608],[120,608],[-40,608]], delay: .22 },
  { pathIndex: 3, from: .49, to: .79, port: [1280, 718], inBends: [[1280,640],[1190,640],[1190,550]], outBends: [[1280,150],[1280,-40]], delay: .28 },
  { pathIndex: 3, from: .74, to: 1.00, port: [42, 608], inBends: [[150,608],[150,550],[240,550]], outBends: [[1360,608],[1480,608],[1640,608]], delay: .27 },
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
  let total = 0

  for (let index = 1; index < points.length; index++) {
    const length = Math.hypot(
      points[index][0] - points[index - 1][0],
      points[index][1] - points[index - 1][1]
    )
    segments.push(length)
    total += length
  }

  return { points, segments, total }
}

function drawPrepared(
  ctx: CanvasRenderingContext2D,
  route: PreparedRoute,
  progress: number,
  stroke: string,
  width: number
): Point {
  if (progress <= 0) return route.points[0]

  let remaining = route.total * clamp01(progress)
  let head: Point = route.points[0]

  ctx.beginPath()
  ctx.moveTo(route.points[0][0], route.points[0][1])

  for (let index = 1; index < route.points.length; index++) {
    const [x0, y0] = route.points[index - 1]
    const [x1, y1] = route.points[index]
    const segment = route.segments[index - 1]

    if (remaining >= segment) {
      ctx.lineTo(x1, y1)
      remaining -= segment
      head = route.points[index]
      continue
    }

    const ratio = segment === 0 ? 0 : remaining / segment
    const x = x0 + (x1 - x0) * ratio
    const y = y0 + (y1 - y0) * ratio
    ctx.lineTo(x, y)
    head = [x, y]
    break
  }

  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.stroke()
  return head
}

function drawLightPool(
  ctx: CanvasRenderingContext2D,
  [x, y]: Point,
  radius: number,
  intensity: number
) {
  if (intensity <= 0) return
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, `rgba(244,198,77,${.30 * intensity})`)
  gradient.addColorStop(.14, `rgba(218,160,0,${.18 * intensity})`)
  gradient.addColorStop(.48, `rgba(218,160,0,${.065 * intensity})`)
  gradient.addColorStop(1, "rgba(218,160,0,0)")

  ctx.save()
  ctx.globalCompositeOperation = "lighter"
  ctx.fillStyle = gradient
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
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

function orthogonalJoin(from: Point, to: Point, horizontalFirst = true): Point[] {
  if (horizontalFirst) return [[to[0], from[1]], to]
  return [[from[0], to[1]], to]
}

function buildCircuit(spec: CircuitSpec, logoPaths: readonly string[]): CircuitGeometry {
  const logoSegment = sampleLogoSegment(logoPaths[spec.pathIndex], spec.from, spec.to)
  const logoRoute = prepareRoute(logoSegment)
  const start: Point[] = [spec.port, ...spec.inBends]
  const firstLogo = logoSegment[0]
  const lastStart = start[start.length - 1]
  start.push(...orthogonalJoin(lastStart, firstLogo, spec.pathIndex % 2 === 0))

  const logoStartDistance = prepareRoute(start).total
  const end: Point[] = [...spec.outBends]
  const firstEnd = end[0]
  const lastLogo = logoSegment[logoSegment.length - 1]
  const bridge = orthogonalJoin(lastLogo, firstEnd, spec.pathIndex % 2 !== 0)
  const route = prepareRoute([...start, ...logoSegment.slice(1), ...bridge, ...end.slice(1)])

  return {
    route,
    logoRoute,
    logoStartDistance,
    logoEndDistance: logoStartDistance + logoRoute.total,
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

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const formationLayer = document.createElement("canvas")
    formationLayer.width = VW
    formationLayer.height = VH
    const formationContext = formationLayer.getContext("2d", { alpha: true })

    let frame = 0
    let cancelled = false
    let complete = false
    let copyShown = false
    let startTime = 0
    let dpr = 1
    let cssWidth = 1
    let cssHeight = 1
    let scaleX = 1
    let scaleY = 1
    let logoImage: HTMLImageElement | null = null
    let circuits: CircuitRuntime[] = []
    let fillStart = 0
    let copyStart = 0
    let animationEnd = 0

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const rect = hero.getBoundingClientRect()
      cssWidth = Math.max(1, rect.width)
      cssHeight = Math.max(1, rect.height)
      scaleX = cssWidth / VW
      scaleY = cssHeight / VH
      dpr = Math.min(window.devicePixelRatio || 1, 1.1)
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      if (complete) draw(animationEnd)
    }

    const drawAmbientLight = (time: number) => {
      if (time < fillStart) return

      const settle = smoothstep((time - fillStart) / .85)
      const surgeProgress = clamp01((time - fillStart) / .72)
      const surge = Math.sin(Math.PI * surgeProgress)
      const centerX = LOGO.x + LOGO.width / 2
      const centerY = LOGO.y + LOGO.height / 2
      const radius = 650
      const gradient = context.createRadialGradient(centerX, centerY, 45, centerX, centerY, radius)
      gradient.addColorStop(0, `rgba(218,160,0,${.035 * settle + .10 * surge})`)
      gradient.addColorStop(.35, `rgba(218,160,0,${.022 * settle + .055 * surge})`)
      gradient.addColorStop(.72, `rgba(218,160,0,${.007 * settle + .018 * surge})`)
      gradient.addColorStop(1, "rgba(218,160,0,0)")

      context.save()
      context.globalCompositeOperation = "lighter"
      context.fillStyle = gradient
      context.fillRect(0, 0, VW, VH)

      if (surgeProgress > 0 && surgeProgress < 1) {
        context.beginPath()
        context.arc(centerX, centerY, 110 + surgeProgress * 470, 0, Math.PI * 2)
        context.strokeStyle = `rgba(244,198,77,${.22 * (1 - surgeProgress)})`
        context.lineWidth = 1.4 + (1 - surgeProgress) * 1.4
        context.stroke()
      }
      context.restore()
    }

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const circuit = circuits[index]
        const activation = circuit
          ? smoothstep((time - (circuit.spec.delay - .08)) / .12)
          : 0
        const ignition = circuit
          ? clamp01((time - (circuit.spec.delay - .08)) / .32)
          : 0

        drawLightPool(context, spec.port, 34 + activation * 12, .32 + activation * .68)

        context.beginPath()
        context.arc(x, y, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(0,0,0,.98)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.50 + activation * .38})`
        context.lineWidth = 1.4
        context.stroke()

        context.beginPath()
        context.arc(x, y, 3.7 + activation * .5, 0, Math.PI * 2)
        context.fillStyle = BRIGHT
        context.globalAlpha = .72 + activation * .28
        context.fill()
        context.globalAlpha = 1

        if (ignition > 0 && ignition < 1) {
          context.beginPath()
          context.arc(x, y, 12 + ignition * 24, 0, Math.PI * 2)
          context.strokeStyle = `rgba(244,198,77,${.24 * (1 - ignition)})`
          context.lineWidth = 1.1
          context.stroke()
        }
      })
    }

    const getLogoProgress = (circuit: CircuitRuntime, time: number) => {
      const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
      const travelled = circuit.route.total * progress
      return clamp01(
        (travelled - circuit.logoStartDistance) / Math.max(1, circuit.logoRoute.total)
      )
    }

    const drawLogoFormation = (time: number) => {
      if (!logoImage || !formationContext) return

      formationContext.setTransform(1, 0, 0, 1, 0, 0)
      formationContext.clearRect(0, 0, VW, VH)
      formationContext.globalCompositeOperation = "source-over"

      circuits.forEach((circuit) => {
        const logoProgress = getLogoProgress(circuit, time)
        if (logoProgress <= 0) return

        const bloomProgress = clamp01(logoProgress + .045)
        formationContext.save()
        formationContext.globalAlpha = .22
        drawPrepared(formationContext, circuit.logoRoute, bloomProgress, "#ffffff", 126)
        formationContext.globalAlpha = .68
        drawPrepared(formationContext, circuit.logoRoute, logoProgress, "#ffffff", 86)
        formationContext.globalAlpha = 1
        const head = drawPrepared(formationContext, circuit.logoRoute, logoProgress, "#ffffff", 44)

        formationContext.beginPath()
        formationContext.arc(head[0], head[1], 34, 0, Math.PI * 2)
        formationContext.fillStyle = "rgba(255,255,255,.96)"
        formationContext.fill()
        formationContext.restore()
      })

      formationContext.globalCompositeOperation = "source-in"
      formationContext.globalAlpha = 1
      formationContext.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      formationContext.globalCompositeOperation = "source-over"

      context.save()
      context.globalCompositeOperation = "lighter"
      context.globalAlpha = .16
      context.drawImage(formationLayer, -2, -2, VW + 4, VH + 4)
      context.globalAlpha = .12
      context.drawImage(formationLayer, 2, 2, VW - 4, VH - 4)
      context.restore()
      context.drawImage(formationLayer, 0, 0)
    }

    const drawLogoCleanup = (time: number) => {
      if (!logoImage) return
      const fill = smoothstep((time - fillStart) / .58)
      if (fill <= 0) return

      context.save()
      context.globalAlpha = fill * .96
      context.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      context.restore()
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .34)
        const energy = 1 - settled * .82

        context.save()
        context.globalCompositeOperation = "lighter"
        context.globalAlpha = .055 * energy
        drawPrepared(context, circuit.route, progress, "rgba(218,160,0,1)", 24)
        context.globalAlpha = .13 * energy
        drawPrepared(context, circuit.route, progress, "rgba(218,160,0,1)", 8)
        context.restore()

        context.globalAlpha = 1 - settled * .74
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.35)
        context.globalAlpha = 1
        drawLightPool(context, head, 60, progress < 1 ? .92 * energy : .26 * energy)

        const logoProgress = getLogoProgress(circuit, time)
        if (logoProgress > 0 && logoProgress < 1) {
          const logoHead = drawPrepared(context, circuit.logoRoute, logoProgress, BRIGHT, 2.15)
          drawLightPool(context, logoHead, 78, 1)
          context.beginPath()
          context.arc(logoHead[0], logoHead[1], 4.2, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
        }

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 3, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
        }
      })
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      context.save()
      context.scale(scaleX, scaleY)
      drawAmbientLight(time)
      drawPorts(time)
      drawLogoFormation(time)
      drawLogoCleanup(time)
      drawCircuits(time)
      context.restore()
    }

    const tick = (now: number) => {
      if (cancelled) return
      if (!startTime) startTime = now

      const elapsed = reducedMotion ? animationEnd : (now - startTime) / 1000
      draw(elapsed)

      if (!copyShown && elapsed >= copyStart) {
        copyShown = true
        setCopyVisible(true)
      }

      if (elapsed >= animationEnd) {
        complete = true
        if (!copyShown) {
          copyShown = true
          setCopyVisible(true)
        }
        return
      }

      frame = requestAnimationFrame(tick)
    }

    const start = async () => {
      try {
        const logoPaths = await loadLogoPaths()
        if (cancelled) return

        circuits = circuitSpecs.map((spec) => {
          const geometry = buildCircuit(spec, logoPaths)
          const duration = geometry.route.total / CIRCUIT_SPEED
          const logoEndProgress = geometry.logoEndDistance / geometry.route.total
          return {
            spec,
            ...geometry,
            duration,
            end: spec.delay + duration,
            logoEndTime: spec.delay + duration * logoEndProgress,
          }
        })

        const lastLogoDeposit = Math.max(...circuits.map((circuit) => circuit.logoEndTime))
        const lastCircuitEnd = Math.max(...circuits.map((circuit) => circuit.end))
        fillStart = lastLogoDeposit + .04
        copyStart = fillStart + .24
        animationEnd = Math.max(lastCircuitEnd, fillStart + .94) + .08

        const image = new Image()
        logoImage = image
        image.onload = () => {
          if (cancelled) return
          resize()

          if (reducedMotion) {
            draw(animationEnd)
            complete = true
            copyShown = true
            setCopyVisible(true)
          } else {
            frame = requestAnimationFrame(tick)
          }
        }
        image.onerror = () => {
          if (cancelled) return
          logoImage = null
          resize()
          setCopyVisible(true)
          frame = requestAnimationFrame(tick)
        }
        image.src = "/logo.svg"
      } catch {
        setCopyVisible(true)
      }
    }

    void start()
    window.addEventListener("resize", resize, { passive: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <section
        ref={heroRef}
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/20 bg-black"
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />
      </section>

      <section id="hero-intro" className="relative border-b border-white/[0.09] bg-[#0d0d0c]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#daa000]/60 to-transparent" />
        <div
          className={`mx-auto grid max-w-[1440px] transition-all duration-300 lg:grid-cols-[0.72fr_1.28fr] ${
            copyVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <div className="flex min-h-44 flex-col justify-between border-b border-white/[0.09] px-5 py-8 sm:px-8 lg:min-h-[300px] lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-16">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#daa000]">
              Embedded Systems @ Purdue
            </p>
            <div className="mt-10 flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#6f6b64]">
              <span>Hardware</span>
              <span className="h-px w-5 bg-[#daa000]/40" />
              <span>Software</span>
              <span className="h-px w-5 bg-[#daa000]/40" />
              <span>Systems</span>
            </div>
          </div>

          <div className="px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
            <h1 className="max-w-4xl text-balance text-[clamp(2.25rem,4.7vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-[#f3efe6]">
              A home for people who build embedded systems.
            </h1>
            <div className="mt-8 grid gap-7 border-t border-white/[0.09] pt-7 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-sm leading-6 text-[#97938a] sm:text-base sm:leading-7">
                Design boards, program microcontrollers, work with FPGAs, and ship real systems with a community built around making.
              </p>

              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button size="lg" className="h-11 px-6" asChild>
                  <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                    Join ES@P
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-11 border-[#daa000]/30 bg-transparent px-6" asChild>
                  <Link href="/projects">
                    Explore projects
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
