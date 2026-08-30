"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 720
const GOLD = "#daa000"
const BRIGHT = "#f4c64d"
const LOGO = { x: 270, y: 248, width: 1060, height: 338 }
const LOGO_SCALE = LOGO.width / 1920
const CIRCUIT_SPEED = 1280

const coreLogoPaths = [
  "M522.61,215.02c-.87,4.61-4.11,7.58-8.32,7.58h-.07l-200.72-1.19-10.87,62.79,220.48,1.31h.46c25.83,0,45.97-18.45,51.36-47.13l13.89-73.71c4.35-23.12-1.83-49.24-16.55-69.86-14.71-20.62-35.95-32.94-56.81-32.94h-204.38c-25.95,0-46.7,19.48-51.62,48.48l-18.77,110.63-10.65,62.78-13.58,80.02c-3.91,23.05,2.54,48.9,17.25,69.16,14.69,20.23,35.75,32.3,56.34,32.3h.09l278.89-.45,1.05-6.06,7-40.35,2.9-16.73-18.71.22v.02l-280.43.45h-.01c-4.6,0-7.66-3.25-9.07-5.2-1.41-1.94-3.65-5.97-2.77-11.13l17.29-101.91,10.65-62.79,15.06-88.74c.79-4.67,4.13-7.81,8.31-7.81h204.38c4.66,0,7.73,3.32,9.14,5.3,1.41,1.98,3.64,6.07,2.66,11.24l-13.89,73.71h.02Z",
  "M1031.87,61.73h-331.67c-25.06,0-45.08,17.75-51,45.23l-16.36,75.96c-4.91,22.81.78,48.83,15.23,69.61,14.45,20.78,35.5,33.22,56.34,33.29l156.26.37c4.82.02,7.91,3.51,9.32,5.6,1.41,2.09,3.59,6.36,2.31,11.58l-22.15,90.17c-1.03,4.22-4.22,6.94-8.17,6.94h-.06l-118.79-.55-126.99,1.52-10.95,63.15,147.32-1.77,118.38.55h.36c24.27,0,45.08-16.91,50.52-43.17l22.15-90.17c5.73-23.31.35-50.2-14.37-71.94-14.73-21.74-36.39-34.75-57.97-34.82l-156.26-.37c-4.23-.01-6.98-3.06-8.24-4.87s-3.22-5.54-2.23-10.18l16.35-75.95c.95-4.42,4.18-7.28,8.21-7.28h282.74l5.21-23.3c7.3-24.23,11.23-39.6,34.49-39.6h.02Z",
  "M1388.94,402.37c-4.66,0-7.72-3.31-9.13-5.29s-3.64-6.06-2.67-11.23l41.21-221.48c4.3-23.11-1.91-49.2-16.63-69.78-14.71-20.58-35.92-32.86-56.75-32.86h-275.46c-23.26,0-42.24,15.37-49.54,39.6l-5.21,23.3-7.68,34.33-.14-.07-44.74,200.54c-5.22,23.4.56,50.12,15.46,71.48,14.77,21.18,36.18,33.76,57.38,33.76h1.01l74.25-2.3,119.92-.4c-4.25-4.15-7.85-8.44-10.83-12.55-10.37-14.26-17.15-31.14-20.34-50.23l-102.67.4-70.6,2.18c-4.7-.03-7.76-3.4-9.17-5.43-1.43-2.05-3.65-6.27-2.49-11.5l56.46-253.01c.97-4.37,4.19-7.19,8.18-7.19h275.46c4.66,0,7.72,3.31,9.13,5.29,1.41,1.97,3.64,6.06,2.67,11.23l-39.19,210.66-2.27,12.45c-2.16,13.18-.96,27.24,3.24,40.66l-45.11.22h-.06c-7.5,0-13.41-1.73-15.44-4.51-2.05-2.82-3.56-9.48-3.72-17.54-.08-4.1.17-8.54.93-13.07l2.71-16.16,4.91-29.23,3.3-19.15,2.02-12.55,13.67-81.92c1.04-6.26.09-13.03-2.5-19.23-1.13-2.7-2.53-5.3-4.27-7.69-5.72-7.85-13.91-12.53-21.91-12.53h-.07l-124.28.41c-9.56.03-17.24,6.72-19.68,17.11l-26.96,114.96c-2.12,9.06.07,19.59,5.81,27.94,5.73,8.33,14.2,13.36,22.5,13.36h.08l80.45-.3,3.45-20.21,6.53-38.28-67.1-1.98,17-56.45,75.54,1.97-7.09,42.49.11.05-.38,2.25-.35,2.08c-.12,1.25-.2,2.51-.17,3.79.02.82-.32,1.66-.9,2.45l-5.38,31.54-1.69,10.04-3.39,20.19-.76,4.52c-.2,1.2-.43,2.76-.65,4.52l-.63,29.22c1.34,15.93,5.82,34.54,17.56,50.68,9.84,13.53,25.42,29.59,56.69,29.59.04,0,82.52,1.77,82.52,1.77h51.28l9.53-62.9h-42.96Z",
  "M1422.94,525.75l10.93,4.56,41.66,17.37,8.07-49s-.01-.02-.02-.03l36.62-202.86,2.49-12.66,2.95-17.97,2.95-17.97,2.06-14.73.53-3.25,16.06-97.49c.77-4.69,3.96-7.77,8.14-7.86l177.55-3.72,38.76-.81h.21c.13,0,.24.03.37.03.98.76,2,1.54,3.11,2.4,3.2,2.46,4.9,6.94,4.09,10.79l-19.89,94.96-16.43.35h0s-61.41,1.34-61.41,1.34l-134.62,2.9-2.47,15.09-2.95,17.97-2.95,17.97-2.02,12.31,233.53-5.04c25.35-.55,45.1-19.16,50.31-47.41l15.49-84.05c4.3-23.35-2.09-49.61-17.08-70.25-15-20.63-36.44-32.64-57.42-32.25l-216.3,4.53c-7.73.16-14.91,2.01-21.33,5.26-7.87,3.98-14.56,10.12-19.65,17.97-4.67,7.2-8.01,15.82-9.62,25.6l-31.09,188.63-17.13,103.94-10.37,62.9-4.17,26.05",
] as const

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

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .02, to: .13, port: [42, 120], inBends: [[130,120],[130,240],[230,240]], outBends: [[1380,150],[1480,150],[1480,105],[1640,105]], delay: .10 },
  { pathIndex: 0, from: .30, to: .43, port: [42, 300], inBends: [[125,300],[125,380],[225,380]], outBends: [[520,625],[520,760]], delay: .15 },
  { pathIndex: 0, from: .62, to: .75, port: [320, 42], inBends: [[320,130],[430,130],[430,215]], outBends: [[120,420],[-40,420]], delay: .20 },
  { pathIndex: 0, from: .79, to: .90, port: [560, 42], inBends: [[560,115],[525,115],[525,210]], outBends: [[1470,620],[1640,620]], delay: .13 },

  { pathIndex: 1, from: .04, to: .18, port: [800, 42], inBends: [[800,125],[760,125],[760,220]], outBends: [[720,620],[720,760]], delay: .12 },
  { pathIndex: 1, from: .34, to: .50, port: [42, 520], inBends: [[135,520],[135,465],[245,465]], outBends: [[1390,260],[1640,260]], delay: .18 },
  { pathIndex: 1, from: .52, to: .64, port: [1558, 465], inBends: [[1480,465],[1480,500],[1380,500]], outBends: [[260,620],[-40,620]], delay: .19 },
  { pathIndex: 1, from: .67, to: .82, port: [350, 678], inBends: [[350,610],[450,610],[450,560]], outBends: [[1080,120],[1080,-40]], delay: .24 },

  { pathIndex: 2, from: .04, to: .13, port: [1558, 150], inBends: [[1470,150],[1470,235],[1370,235]], outBends: [[170,205],[-40,205]], delay: .14 },
  { pathIndex: 2, from: .27, to: .40, port: [1558, 350], inBends: [[1470,350],[1470,420],[1375,420]], outBends: [[1030,105],[1030,-40]], delay: .20 },
  { pathIndex: 2, from: .46, to: .58, port: [1050, 678], inBends: [[1050,610],[1000,610],[1000,555]], outBends: [[1380,90],[1380,-40]], delay: .23 },
  { pathIndex: 2, from: .66, to: .79, port: [800, 678], inBends: [[800,610],[900,610],[900,560]], outBends: [[1430,465],[1640,465]], delay: .26 },

  { pathIndex: 3, from: .05, to: .18, port: [1280, 42], inBends: [[1280,125],[1200,125],[1200,220]], outBends: [[1240,625],[1240,760]], delay: .16 },
  { pathIndex: 3, from: .31, to: .47, port: [1558, 560], inBends: [[1460,560],[1460,515],[1360,515]], outBends: [[160,565],[-40,565]], delay: .22 },
  { pathIndex: 3, from: .61, to: .78, port: [1250, 678], inBends: [[1250,610],[1160,610],[1160,555]], outBends: [[1320,120],[1320,-40]], delay: .28 },
  { pathIndex: 3, from: .80, to: .91, port: [42, 650], inBends: [[125,650],[125,590],[235,590]], outBends: [[1480,420],[1640,420]], delay: .27 },
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
    const length = Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1])
    segments.push(length)
    total += length
  }
  return { points, segments, total }
}

function drawPrepared(ctx: CanvasRenderingContext2D, route: PreparedRoute, progress: number, stroke: string, width: number): Point {
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

function buildCircuit(spec: CircuitSpec): PreparedRoute {
  const logoSegment = sampleLogoSegment(coreLogoPaths[spec.pathIndex], spec.from, spec.to)
  const start: Point[] = [spec.port, ...spec.inBends]
  const firstLogo = logoSegment[0]
  const lastStart = start[start.length - 1]
  start.push(...orthogonalJoin(lastStart, firstLogo, spec.pathIndex % 2 === 0))

  const end: Point[] = [...spec.outBends]
  const firstEnd = end[0]
  const lastLogo = logoSegment[logoSegment.length - 1]
  const bridge = orthogonalJoin(lastLogo, firstEnd, spec.pathIndex % 2 !== 0)

  return prepareRoute([...start, ...logoSegment.slice(1), ...bridge, ...end.slice(1)])
}

export function PcbHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copyVisible, setCopyVisible] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    let frame = 0
    let cancelled = false
    let complete = false
    let startTime = 0
    let dpr = 1
    let cssWidth = 1
    let cssHeight = 1
    let logoImage: HTMLImageElement | null = null

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const circuits = circuitSpecs.map((spec) => {
      const route = buildCircuit(spec)
      const duration = route.total / CIRCUIT_SPEED
      return { spec, route, duration, end: spec.delay + duration }
    })

    const firstLogoMoment = Math.min(...circuits.map((circuit) => circuit.spec.delay + circuit.duration * .34))
    const lastCircuitEnd = Math.max(...circuits.map((circuit) => circuit.end))
    const fillStart = firstLogoMoment + .32
    const animationEnd = lastCircuitEnd + .20

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      cssWidth = Math.max(1, rect.width)
      cssHeight = Math.max(1, rect.height)
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

    const drawVia = (point: Point, alpha: number) => {
      if (alpha <= 0) return
      context.save()
      context.globalAlpha = alpha
      context.beginPath()
      context.arc(point[0], point[1], 4.1, 0, Math.PI * 2)
      context.fillStyle = "rgba(15,15,15,.94)"
      context.fill()
      context.strokeStyle = "rgba(218,160,0,.52)"
      context.lineWidth = 1.1
      context.stroke()
      context.beginPath()
      context.arc(point[0], point[1], 1.35, 0, Math.PI * 2)
      context.fillStyle = GOLD
      context.fill()
      context.restore()
    }

    const drawVias = (time: number) => {
      circuits.forEach((circuit, index) => {
        if (index % 2 !== 0) return
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        const inVia = circuit.spec.inBends[Math.min(1, circuit.spec.inBends.length - 1)]
        const outVia = circuit.spec.outBends[Math.min(1, circuit.spec.outBends.length - 1)]
        drawVia(inVia, smoothstep((progress - .08) / .10) * .82)
        drawVia(outVia, smoothstep((progress - .76) / .10) * .74)
      })
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .28)
        context.globalAlpha = 1 - settled * .64
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.0)
        context.globalAlpha = 1

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 2.7, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
        }
      })
    }

    const drawLogo = (time: number) => {
      if (!logoImage) return
      const fill = smoothstep((time - fillStart) / .82)
      if (fill <= 0) return

      context.save()
      context.globalAlpha = fill * .96
      context.drawImage(logoImage, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
      context.restore()
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)
      context.save()
      context.scale(cssWidth / VW, cssHeight / VH)
      drawPorts(time)
      drawVias(time)
      drawCircuits(time)
      drawLogo(time)
      context.restore()
    }

    const tick = (now: number) => {
      if (cancelled) return
      if (!startTime) startTime = now
      const elapsed = reducedMotion ? animationEnd : (now - startTime) / 1000
      draw(elapsed)
      if (elapsed >= animationEnd) {
        complete = true
        setCopyVisible(true)
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const image = new Image()
    logoImage = image
    image.onload = () => {
      if (cancelled) return
      resize()
      if (reducedMotion) {
        draw(animationEnd)
        complete = true
        setCopyVisible(true)
      } else {
        frame = requestAnimationFrame(tick)
      }
    }
    image.src = "/logo.svg"

    image.onerror = () => {
      if (cancelled) return
      resize()
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("resize", resize, { passive: true })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(218,160,0,0.055),transparent_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-16 text-center">
        <div className="relative h-[min(70svh,700px)] min-h-[500px] w-full sm:min-h-[540px]" aria-hidden="true">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>

        <div
          className={`mt-6 flex max-w-3xl flex-col items-center px-5 transition-all duration-500 sm:mt-8 sm:px-8 ${
            copyVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <p className="font-mono text-[0.67rem] uppercase tracking-[0.28em] text-primary/80 sm:text-xs">
            Hardware × software × people who build
          </p>
          <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Purdue&apos;s home for embedded systems.
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-sm leading-6 text-muted-foreground sm:text-base lg:text-lg">
            Design boards, program microcontrollers, work with FPGAs, and ship real systems with a community built around making.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="h-11 px-6" asChild>
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">Join ES@P</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 border-primary/30 bg-background/70 px-6" asChild>
              <Link href="/projects">Explore projects <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <a
          href="#landing-content"
          className={`absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-opacity duration-500 hover:text-primary ${copyVisible ? "opacity-80" : "opacity-0"}`}
          aria-label="Scroll to explore Embedded Systems at Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
