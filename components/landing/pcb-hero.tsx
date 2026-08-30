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

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .02, to: .13, port: [42, 152], inBends: [[150,152],[150,205],[240,205]], outBends: [[1360,140],[1480,140],[1640,140]], delay: .10 },
  { pathIndex: 0, from: .30, to: .43, port: [42, 304], inBends: [[145,304],[145,350],[235,350]], outBends: [[360,610],[360,760]], delay: .15 },
  { pathIndex: 0, from: .62, to: .75, port: [320, 42], inBends: [[320,120],[405,120],[405,215]], outBends: [[240,260],[120,260],[-40,260]], delay: .20 },
  { pathIndex: 0, from: .79, to: .90, port: [640, 42], inBends: [[640,120],[590,120],[590,210]], outBends: [[1040,610],[1040,760]], delay: .13 },

  { pathIndex: 1, from: .04, to: .18, port: [960, 42], inBends: [[960,120],[1010,120],[1010,210]], outBends: [[720,610],[720,760]], delay: .12 },
  { pathIndex: 1, from: .34, to: .50, port: [42, 456], inBends: [[145,456],[145,410],[240,410]], outBends: [[1360,280],[1480,280],[1640,280]], delay: .18 },
  { pathIndex: 1, from: .52, to: .64, port: [1558, 456], inBends: [[1455,456],[1455,410],[1360,410]], outBends: [[240,500],[120,500],[-40,500]], delay: .19 },
  { pathIndex: 1, from: .67, to: .82, port: [320, 718], inBends: [[320,640],[410,640],[410,560]], outBends: [[480,150],[480,-40]], delay: .24 },

  { pathIndex: 2, from: .04, to: .13, port: [1558, 152], inBends: [[1450,152],[1450,215],[1360,215]], outBends: [[240,128],[120,128],[-40,128]], delay: .14 },
  { pathIndex: 2, from: .27, to: .40, port: [1558, 304], inBends: [[1455,304],[1455,350],[1365,350]], outBends: [[840,150],[840,-40]], delay: .20 },
  { pathIndex: 2, from: .46, to: .58, port: [960, 718], inBends: [[960,640],[1010,640],[1010,560]], outBends: [[1160,150],[1160,-40]], delay: .23 },
  { pathIndex: 2, from: .66, to: .79, port: [640, 718], inBends: [[640,640],[590,640],[590,560]], outBends: [[1360,460],[1480,460],[1640,460]], delay: .26 },

  { pathIndex: 3, from: .05, to: .18, port: [1280, 42], inBends: [[1280,120],[1195,120],[1195,215]], outBends: [[1280,610],[1280,760]], delay: .16 },
  { pathIndex: 3, from: .31, to: .47, port: [1558, 608], inBends: [[1450,608],[1450,555],[1365,555]], outBends: [[240,620],[120,620],[-40,620]], delay: .22 },
  { pathIndex: 3, from: .61, to: .78, port: [1280, 718], inBends: [[1280,640],[1190,640],[1190,560]], outBends: [[1440,150],[1440,-40]], delay: .28 },
  { pathIndex: 3, from: .80, to: .91, port: [42, 608], inBends: [[150,608],[150,555],[235,555]], outBends: [[1360,610],[1480,610],[1640,610]], delay: .27 },
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

function logoPoint([x, y]: Point): Point {
  return [LOGO.x + x * LOGO_SCALE, LOGO.y + y * LOGO_SCALE]
}

function sampleLogoSegment(d: string, from: number, to: number): Point[] {
  const namespace = "http://www.w3.org/2000/svg"
  const path = document.createElementNS(namespace, "path")
  path.setAttribute("d", d)

  const total = path.getTotalLength()
  const span = Math.abs(to - from) * total
  const samples = Math.max(16, Math.min(80, Math.ceil(span / 11)))
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

  if (paths.length < 4) throw new Error("Logo geometry is incomplete")
  return paths.slice(0, 4)
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

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const activation = smoothstep((time - (circuits[index].spec.delay - .08)) / .12)

        context.beginPath()
        context.arc(x, y, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(15,15,15,.96)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.42 + activation * .34})`
        context.lineWidth = 1.4
        context.stroke()

        context.beginPath()
        context.arc(x, y, 3.6 + activation * .45, 0, Math.PI * 2)
        context.fillStyle = GOLD
        context.globalAlpha = .64 + activation * .36
        context.fill()
        context.globalAlpha = 1
      })
    }

    const drawLogo = (time: number) => {
      if (!logoImage) return
      const fill = smoothstep((time - fillStart) / .62)
      if (fill <= 0) return

      context.save()
      context.globalAlpha = fill * .92
      context.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      context.restore()
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .30)
        context.globalAlpha = 1 - settled * .72
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.3)
        context.globalAlpha = 1

        const travelled = circuit.route.total * progress
        const logoProgress = clamp01(
          (travelled - circuit.logoStartDistance) / Math.max(1, circuit.logoRoute.total)
        )

        if (logoProgress > 0) {
          const deposited = smoothstep(logoProgress)
          context.save()
          context.globalAlpha = .62 + deposited * .28
          drawPrepared(context, circuit.logoRoute, logoProgress, GOLD, 3.1)
          context.globalAlpha = .42 + deposited * .28
          drawPrepared(context, circuit.logoRoute, logoProgress, BRIGHT, 1.05)
          context.restore()
        }

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 2.9, 0, Math.PI * 2)
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
      drawPorts(time)
      drawLogo(time)
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
        fillStart = lastLogoDeposit + .08
        copyStart = fillStart + .18
        animationEnd = Math.max(lastCircuitEnd, fillStart + .72) + .10

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
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/20 bg-background"
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_48%,rgba(218,160,0,0.06),transparent_42%)]" />
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
