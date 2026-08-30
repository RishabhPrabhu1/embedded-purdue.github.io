"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 760
const GOLD = "#daa000"
const BRIGHT = "#f4c64d"
const LOGO = { x: 270, y: 248, width: 1060, height: 338 }
const LOGO_SCALE = LOGO.width / 1920
const CIRCUIT_SPEED = 1280
const LOWER_EXTENSION_TIME = 0.92

type Point = readonly [number, number]
type Route = readonly Point[]
type PreparedRoute = { points: Route; segments: number[]; total: number }
type LowerNetworkRoute = {
  route: PreparedRoute
  start: number
  duration: number
  alpha: number
  widthScale: number
  junctions?: readonly Point[]
}

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

function buildCircuit(spec: CircuitSpec, logoPaths: readonly string[]): PreparedRoute {
  const logoSegment = sampleLogoSegment(logoPaths[spec.pathIndex], spec.from, spec.to)
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
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copyVisible, setCopyVisible] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!hero || !stage || !canvas) return

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
    let stageHeight = 1
    let stageOffsetY = 0
    let scaleX = 1
    let scaleY = 1
    let logoImage: HTMLImageElement | null = null
    let lowerNetwork: LowerNetworkRoute[] = []
    let circuits: Array<{ spec: CircuitSpec; route: PreparedRoute; duration: number; end: number }> = []
    let downwardCircuits: typeof circuits = []
    let fillStart = 0
    let copyStart = 0
    let animationEnd = 0

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const rebuildLowerNetwork = () => {
      const stageBottom = stageOffsetY + stageHeight
      const lowerDistance = cssHeight - stageBottom
      if (lowerDistance <= 1 || downwardCircuits.length === 0) {
        lowerNetwork = []
        return
      }

      const routes: LowerNetworkRoute[] = []
      const trunkXs = downwardCircuits.map((circuit) => {
        const last = circuit.route.points[circuit.route.points.length - 1]
        return last[0] * scaleX
      })
      const allStart = Math.max(...downwardCircuits.map((circuit) => circuit.end))
      const x = (fraction: number) => cssWidth * fraction
      const y = (fraction: number) => stageBottom + lowerDistance * fraction

      downwardCircuits.forEach((circuit, index) => {
        routes.push({
          route: prepareRoute([[trunkXs[index], stageBottom - 2], [trunkXs[index], cssHeight + 3]]),
          start: circuit.end,
          duration: LOWER_EXTENSION_TIME * .58,
          alpha: .55,
          widthScale: 1,
        })
      })

      const transitionPlans = [
        { source: 0, level: .012, target: -.025, drop: .23 },
        { source: 0, level: .048, target: .105, drop: .36 },
        { source: 0, level: .095, target: .245, drop: .56 },
        { source: 1, level: .020, target: .36, drop: .30 },
        { source: 1, level: .066, target: .50, drop: .44 },
        { source: 1, level: .118, target: .66, drop: .59 },
        { source: 2, level: .014, target: 1.025, drop: .24 },
        { source: 2, level: .052, target: .895, drop: .38 },
        { source: 2, level: .102, target: .755, drop: .55 },
      ] as const

      transitionPlans.forEach((plan, index) => {
        const sx = trunkXs[plan.source]
        const sy = y(plan.level)
        const tx = x(plan.target)
        routes.push({
          route: prepareRoute([[sx, sy], [tx, sy], [tx, y(plan.drop)]]),
          start: downwardCircuits[plan.source].end + LOWER_EXTENSION_TIME * (.025 + index * .022),
          duration: LOWER_EXTENSION_TIME * (.38 + (index % 3) * .035),
          alpha: .45 - (index % 3) * .025,
          widthScale: .94,
          junctions: [[sx, sy]],
        })
      })

      const secondaryPlans = [
        { source: 0, level: .20, target: .035, end: .52 },
        { source: 0, level: .31, target: .155, end: .77 },
        { source: 0, level: .47, target: .295, end: 1.02 },
        { source: 0, level: .68, target: -.02, end: .91 },
        { source: 1, level: .24, target: .405, end: .64 },
        { source: 1, level: .39, target: .575, end: .83 },
        { source: 1, level: .63, target: .47, end: 1.02 },
        { source: 2, level: .19, target: .965, end: .49 },
        { source: 2, level: .34, target: .835, end: .73 },
        { source: 2, level: .50, target: .705, end: 1.02 },
        { source: 2, level: .71, target: 1.02, end: .94 },
      ] as const

      secondaryPlans.forEach((plan, index) => {
        const sx = trunkXs[plan.source]
        const sy = y(plan.level)
        const tx = x(plan.target)
        routes.push({
          route: prepareRoute([[sx, sy], [tx, sy], [tx, y(plan.end)]]),
          start: downwardCircuits[plan.source].end + LOWER_EXTENSION_TIME * (.22 + index * .045),
          duration: LOWER_EXTENSION_TIME * (.48 + (index % 4) * .035),
          alpha: .34 - (index % 4) * .018,
          widthScale: index % 3 === 0 ? .88 : .78,
          junctions: [[sx, sy]],
        })
      })

      const sideExits: Array<{ points: Point[]; delay: number; alpha: number }> = [
        { points: [[x(.155), y(.27)], [x(.055), y(.27)], [-24, y(.27)]], delay: .24, alpha: .32 },
        { points: [[x(.295), y(.43)], [x(.12), y(.43)], [-24, y(.43)]], delay: .36, alpha: .29 },
        { points: [[x(.245), y(.60)], [x(.07), y(.60)], [-24, y(.60)]], delay: .48, alpha: .26 },
        { points: [[x(.835), y(.26)], [x(.945), y(.26)], [cssWidth + 24, y(.26)]], delay: .26, alpha: .32 },
        { points: [[x(.705), y(.42)], [x(.90), y(.42)], [cssWidth + 24, y(.42)]], delay: .38, alpha: .29 },
        { points: [[x(.755), y(.59)], [x(.94), y(.59)], [cssWidth + 24, y(.59)]], delay: .50, alpha: .26 },
        { points: [[x(.035), y(.82)], [-24, y(.82)]], delay: .62, alpha: .23 },
        { points: [[x(.965), y(.80)], [cssWidth + 24, y(.80)]], delay: .64, alpha: .23 },
      ]

      sideExits.forEach((exit) => {
        routes.push({
          route: prepareRoute(exit.points),
          start: allStart + LOWER_EXTENSION_TIME * exit.delay,
          duration: LOWER_EXTENSION_TIME * .42,
          alpha: exit.alpha,
          widthScale: .76,
        })
      })

      const buses: Array<{ points: Point[]; delay: number; alpha: number; junctions?: Point[] }> = [
        { points: [[x(.035), y(.15)], [x(.29), y(.15)]], delay: .18, alpha: .29 },
        { points: [[x(.71), y(.145)], [x(.965), y(.145)]], delay: .20, alpha: .29 },
        { points: [[x(.08), y(.365)], [x(.32), y(.365)]], delay: .34, alpha: .27 },
        { points: [[x(.68), y(.35)], [x(.93), y(.35)]], delay: .35, alpha: .27 },
        { points: [[x(.17), y(.54)], [x(.36), y(.54)]], delay: .46, alpha: .24 },
        { points: [[x(.64), y(.535)], [x(.85), y(.535)]], delay: .47, alpha: .24 },
        { points: [[x(.09), y(.705)], [x(.31), y(.705)]], delay: .57, alpha: .22 },
        { points: [[x(.69), y(.69)], [x(.91), y(.69)]], delay: .58, alpha: .22 },
        { points: [[x(.24), y(.86)], [x(.43), y(.86)]], delay: .68, alpha: .20 },
        { points: [[x(.57), y(.845)], [x(.78), y(.845)]], delay: .69, alpha: .20 },
        { points: [[x(.36), y(.955)], [x(.64), y(.955)]], delay: .76, alpha: .18 },
      ]

      buses.forEach((bus) => {
        routes.push({
          route: prepareRoute(bus.points),
          start: allStart + LOWER_EXTENSION_TIME * bus.delay,
          duration: LOWER_EXTENSION_TIME * .40,
          alpha: bus.alpha,
          widthScale: .70,
          junctions: bus.junctions,
        })
      })

      const stepped: Array<{ points: Point[]; delay: number; alpha: number }> = [
        { points: [[x(.035), y(.49)], [x(.095), y(.49)], [x(.095), y(.66)], [x(.18), y(.66)]], delay: .44, alpha: .25 },
        { points: [[x(.29), y(.57)], [x(.34), y(.57)], [x(.34), y(.78)]], delay: .52, alpha: .23 },
        { points: [[x(.965), y(.48)], [x(.905), y(.48)], [x(.905), y(.65)], [x(.82), y(.65)]], delay: .45, alpha: .25 },
        { points: [[x(.71), y(.56)], [x(.66), y(.56)], [x(.66), y(.79)]], delay: .53, alpha: .23 },
      ]

      stepped.forEach((step) => {
        routes.push({
          route: prepareRoute(step.points),
          start: allStart + LOWER_EXTENSION_TIME * step.delay,
          duration: LOWER_EXTENSION_TIME * .48,
          alpha: step.alpha,
          widthScale: .74,
        })
      })

      lowerNetwork = routes
    }

    const resize = () => {
      const heroRect = hero.getBoundingClientRect()
      const stageRect = stage.getBoundingClientRect()
      cssWidth = Math.max(1, heroRect.width)
      cssHeight = Math.max(1, heroRect.height)
      stageOffsetY = Math.max(0, stageRect.top - heroRect.top)
      stageHeight = Math.max(1, Math.min(cssHeight - stageOffsetY, stageRect.height))
      scaleX = cssWidth / VW
      scaleY = stageHeight / VH
      dpr = Math.min(window.devicePixelRatio || 1, 1.1)
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      rebuildLowerNetwork()
      if (complete) draw(animationEnd)
    }

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [px, py] = spec.port
        const activation = smoothstep((time - (circuits[index].spec.delay - .08)) / .12)

        context.beginPath()
        context.arc(px, py, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(15,15,15,.96)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.42 + activation * .34})`
        context.lineWidth = 1.4
        context.stroke()

        context.beginPath()
        context.arc(px, py, 3.6 + activation * .45, 0, Math.PI * 2)
        context.fillStyle = GOLD
        context.globalAlpha = .64 + activation * .36
        context.fill()
        context.globalAlpha = 1
      })
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .28)
        context.globalAlpha = 1 - settled * .64
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.35)
        context.globalAlpha = 1

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 2.9, 0, Math.PI * 2)
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

    const drawJunction = (jx: number, jy: number, alpha: number) => {
      if (alpha <= 0) return
      context.save()
      context.globalAlpha = alpha
      context.beginPath()
      context.arc(jx, jy, 3.45, 0, Math.PI * 2)
      context.fillStyle = "rgba(17,17,15,.96)"
      context.fill()
      context.strokeStyle = GOLD
      context.lineWidth = 1.15
      context.stroke()
      context.beginPath()
      context.arc(jx, jy, 1.15, 0, Math.PI * 2)
      context.fillStyle = GOLD
      context.fill()
      context.restore()
    }

    const drawLowerField = (time: number) => {
      if (lowerNetwork.length === 0) return
      const strokeWidth = Math.max(1.4, 2.35 * Math.min(1.15, Math.max(.82, scaleX)))

      context.save()
      context.lineCap = "round"
      context.lineJoin = "round"

      lowerNetwork.forEach((networkRoute) => {
        const progress = smoothstep((time - networkRoute.start) / networkRoute.duration)
        if (progress <= 0) return

        context.globalAlpha = networkRoute.alpha
        drawPrepared(
          context,
          networkRoute.route,
          progress,
          GOLD,
          Math.max(1.1, strokeWidth * networkRoute.widthScale)
        )

        if (networkRoute.junctions && progress > .08) {
          networkRoute.junctions.forEach(([jx, jy]) => {
            drawJunction(jx, jy, networkRoute.alpha * Math.min(1, progress * 1.3))
          })
        }
      })

      context.restore()
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      drawLowerField(time)

      context.save()
      context.translate(0, stageOffsetY)
      context.scale(scaleX, scaleY)
      drawPorts(time)
      drawCircuits(time)
      drawLogo(time)
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
          const route = buildCircuit(spec, logoPaths)
          const duration = route.total / CIRCUIT_SPEED
          return { spec, route, duration, end: spec.delay + duration }
        })
        downwardCircuits = circuits.filter(
          (circuit) => circuit.route.points[circuit.route.points.length - 1][1] >= VH - 1
        )

        const firstLogoMoment = Math.min(...circuits.map((circuit) => circuit.spec.delay + circuit.duration * .34))
        const lastCircuitEnd = Math.max(...circuits.map((circuit) => circuit.end))
        const lowerCircuitEnd = downwardCircuits.length
          ? Math.max(...downwardCircuits.map((circuit) => circuit.end + LOWER_EXTENSION_TIME * 1.85))
          : lastCircuitEnd
        fillStart = firstLogoMoment + .32
        copyStart = fillStart + .18
        animationEnd = Math.max(lastCircuitEnd + .20, lowerCircuitEnd)

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
    <section ref={heroRef} className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_44%,rgba(218,160,0,0.055),transparent_38%)]" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-16 text-center">
        <div ref={stageRef} className="relative h-[min(70svh,700px)] min-h-[500px] w-full sm:min-h-[540px]" aria-hidden="true" />

        <div
          className={`relative z-20 mt-6 flex w-[calc(100%-2.5rem)] max-w-3xl flex-col items-center border border-white/[0.11] border-t-[#daa000]/45 bg-[#10100e]/90 px-6 py-7 shadow-[0_18px_70px_rgba(0,0,0,0.38)] backdrop-blur-md transition-all duration-300 sm:mt-8 sm:px-9 sm:py-8 ${
            copyVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-primary/85 sm:text-[0.68rem]">
            Embedded Systems @ Purdue / Hardware × software × people who build
          </p>
          <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            A home for people who build embedded systems.
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
          className={`absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-opacity duration-300 hover:text-primary ${copyVisible ? "opacity-80" : "opacity-0"}`}
          aria-label="Scroll to explore Embedded Systems @ Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
