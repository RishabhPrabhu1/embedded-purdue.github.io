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

type CircuitRuntime = {
  spec: CircuitSpec
  route: PreparedRoute
  duration: number
  end: number
}

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .02, to: .13, port: [42, 152], inBends: [[130,152],[130,240],[230,240]], outBends: [[1380,150],[1480,150],[1480,105],[1640,105]], delay: .10 },
  { pathIndex: 0, from: .30, to: .43, port: [42, 304], inBends: [[125,304],[125,380],[225,380]], outBends: [[520,625],[520,760]], delay: .15 },
  { pathIndex: 0, from: .62, to: .75, port: [320, 42], inBends: [[320,130],[430,130],[430,215]], outBends: [[120,420],[-40,420]], delay: .20 },
  { pathIndex: 0, from: .79, to: .90, port: [640, 42], inBends: [[640,115],[525,115],[525,210]], outBends: [[1470,620],[1640,620]], delay: .13 },

  { pathIndex: 1, from: .04, to: .18, port: [960, 42], inBends: [[960,125],[760,125],[760,220]], outBends: [[720,620],[720,760]], delay: .12 },
  { pathIndex: 1, from: .34, to: .50, port: [42, 456], inBends: [[135,456],[135,500],[245,500]], outBends: [[1390,260],[1640,260]], delay: .18 },
  { pathIndex: 1, from: .52, to: .64, port: [1558, 456], inBends: [[1480,456],[1480,500],[1380,500]], outBends: [[260,620],[-40,620]], delay: .19 },
  { pathIndex: 1, from: .67, to: .82, port: [320, 718], inBends: [[320,610],[450,610],[450,560]], outBends: [[1080,120],[1080,-40]], delay: .24 },

  { pathIndex: 2, from: .04, to: .13, port: [1558, 152], inBends: [[1470,152],[1470,235],[1370,235]], outBends: [[170,205],[-40,205]], delay: .14 },
  { pathIndex: 2, from: .27, to: .40, port: [1558, 304], inBends: [[1470,304],[1470,420],[1375,420]], outBends: [[1030,105],[1030,-40]], delay: .20 },
  { pathIndex: 2, from: .46, to: .58, port: [960, 718], inBends: [[960,610],[1000,610],[1000,555]], outBends: [[1380,90],[1380,-40]], delay: .23 },
  { pathIndex: 2, from: .66, to: .79, port: [640, 718], inBends: [[640,610],[900,610],[900,560]], outBends: [[1430,465],[1640,465]], delay: .26 },

  { pathIndex: 3, from: .05, to: .18, port: [1280, 42], inBends: [[1280,125],[1200,125],[1200,220]], outBends: [[1240,625],[1240,760]], delay: .16 },
  { pathIndex: 3, from: .31, to: .47, port: [1558, 608], inBends: [[1460,608],[1460,515],[1360,515]], outBends: [[160,565],[-40,565]], delay: .22 },
  { pathIndex: 3, from: .61, to: .78, port: [1280, 718], inBends: [[1280,610],[1160,610],[1160,555]], outBends: [[1320,120],[1320,-40]], delay: .28 },
  { pathIndex: 3, from: .80, to: .91, port: [42, 608], inBends: [[125,608],[125,590],[235,590]], outBends: [[1480,420],[1640,420]], delay: .27 },
]

const substrateRoutes: Route[] = [
  [[0,94],[92,94],[92,132],[196,132],[196,176],[304,176]],
  [[0,212],[68,212],[68,258],[176,258],[176,294],[258,294]],
  [[0,548],[96,548],[96,514],[204,514],[204,472],[298,472]],
  [[0,676],[126,676],[126,636],[238,636],[238,604],[352,604]],
  [[1600,96],[1516,96],[1516,138],[1414,138],[1414,184],[1320,184]],
  [[1600,222],[1528,222],[1528,270],[1436,270],[1436,312],[1346,312]],
  [[1600,538],[1504,538],[1504,498],[1418,498],[1418,452],[1322,452]],
  [[1600,674],[1478,674],[1478,628],[1388,628],[1388,596],[1280,596]],
  [[132,0],[132,72],[190,72],[190,116]],
  [[468,0],[468,82],[426,82],[426,146]],
  [[1132,0],[1132,76],[1184,76],[1184,136]],
  [[1466,0],[1466,68],[1408,68],[1408,124]],
  [[146,760],[146,690],[210,690],[210,642]],
  [[466,760],[466,696],[416,696],[416,634]],
  [[1130,760],[1130,700],[1184,700],[1184,642]],
  [[1464,760],[1464,690],[1400,690],[1400,640]],
]

const activeRoutes: Route[] = [
  [[318,204],[388,204],[388,236],[470,236]],
  [[280,390],[376,390],[376,354],[464,354]],
  [[322,578],[398,578],[398,540],[480,540]],
  [[1282,206],[1212,206],[1212,238],[1130,238]],
  [[1320,390],[1224,390],[1224,352],[1136,352]],
  [[1278,578],[1202,578],[1202,540],[1120,540]],
  [[548,122],[548,188],[586,188],[586,232]],
  [[800,116],[800,184],[800,218]],
  [[1052,122],[1052,188],[1014,188],[1014,232]],
  [[548,638],[548,590],[586,590],[586,548]],
  [[800,644],[800,590],[800,554]],
  [[1052,638],[1052,590],[1014,590],[1014,548]],
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

function strokeRoute(
  ctx: CanvasRenderingContext2D,
  route: Route,
  stroke: string,
  width = 1
) {
  if (route.length < 2) return
  ctx.beginPath()
  ctx.moveTo(route[0][0], route[0][1])
  for (let index = 1; index < route.length; index++) {
    ctx.lineTo(route[index][0], route[index][1])
  }
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.stroke()
}

function drawViaCluster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  columns: number,
  rows: number,
  spacingX: number,
  spacingY: number,
  alpha: number
) {
  ctx.save()
  ctx.strokeStyle = `rgba(218,160,0,${alpha})`
  ctx.fillStyle = `rgba(218,160,0,${alpha * .48})`
  ctx.lineWidth = .8

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const px = x + column * spacingX
      const py = y + row * spacingY
      ctx.beginPath()
      ctx.arc(px, py, 2.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px, py, .75, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

function drawChipFootprint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  pins: number,
  label: string,
  alpha: number
) {
  ctx.save()
  ctx.strokeStyle = `rgba(218,160,0,${alpha})`
  ctx.fillStyle = `rgba(218,160,0,${alpha * .72})`
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, width, height)

  const horizontalGap = width / (pins + 1)
  const verticalGap = height / (Math.max(4, Math.round(pins * .55)) + 1)

  for (let index = 1; index <= pins; index++) {
    const px = x + horizontalGap * index
    ctx.fillRect(px - 1.8, y - 8, 3.6, 6)
    ctx.fillRect(px - 1.8, y + height + 2, 3.6, 6)
  }

  const verticalPins = Math.max(4, Math.round(pins * .55))
  for (let index = 1; index <= verticalPins; index++) {
    const py = y + verticalGap * index
    ctx.fillRect(x - 8, py - 1.8, 6, 3.6)
    ctx.fillRect(x + width + 2, py - 1.8, 6, 3.6)
  }

  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = `rgba(218,160,0,${alpha * 1.12})`
  ctx.fillText(label, x + 8, y + 14)
  ctx.restore()
}

function renderBaseEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)
  ctx.fillStyle = "#040504"
  ctx.fillRect(0, 0, VW, VH)

  const voidField = ctx.createRadialGradient(800, 382, 30, 800, 382, 760)
  voidField.addColorStop(0, "rgba(1,2,1,1)")
  voidField.addColorStop(.20, "rgba(5,5,4,1)")
  voidField.addColorStop(.43, "rgba(35,27,12,.42)")
  voidField.addColorStop(.72, "rgba(12,12,9,.9)")
  voidField.addColorStop(1, "rgba(3,4,3,1)")
  ctx.fillStyle = voidField
  ctx.fillRect(0, 0, VW, VH)

  const vignette = ctx.createRadialGradient(800, 380, 220, 800, 380, 930)
  vignette.addColorStop(0, "rgba(0,0,0,0)")
  vignette.addColorStop(.55, "rgba(0,0,0,.08)")
  vignette.addColorStop(.80, "rgba(0,0,0,.46)")
  vignette.addColorStop(1, "rgba(0,0,0,.88)")
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, VW, VH)

  ctx.save()
  substrateRoutes.forEach((route, index) => {
    strokeRoute(
      ctx,
      route,
      index % 3 === 0 ? "rgba(218,160,0,.075)" : "rgba(218,160,0,.048)",
      index % 4 === 0 ? 1.15 : .9
    )
  })
  ctx.restore()

  drawChipFootprint(ctx, 118, 70, 156, 88, 10, "U3 / MCU", .075)
  drawChipFootprint(ctx, 1328, 82, 144, 82, 9, "U7 / IO", .065)
  drawChipFootprint(ctx, 116, 590, 136, 76, 8, "J2", .055)
  drawChipFootprint(ctx, 1340, 582, 132, 78, 8, "U9", .055)

  drawViaCluster(ctx, 58, 338, 4, 4, 15, 15, .08)
  drawViaCluster(ctx, 1482, 334, 4, 4, 15, 15, .08)
  drawViaCluster(ctx, 354, 86, 5, 2, 14, 14, .055)
  drawViaCluster(ctx, 1186, 650, 5, 2, 14, 14, .055)

  ctx.save()
  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(218,160,0,.09)"
  ctx.fillText("3V3", 74, 188)
  ctx.fillText("GND", 1450, 194)
  ctx.fillText("SPI0", 120, 530)
  ctx.fillText("CLK", 1436, 526)
  ctx.fillText("R14", 330, 102)
  ctx.fillText("C08", 1228, 664)
  ctx.restore()

  ctx.save()
  ctx.fillStyle = "rgba(235,228,208,.018)"
  for (let index = 0; index < 460; index++) {
    const px = (index * 83 + 29) % VW
    const py = (index * 137 + 47) % VH
    const size = index % 7 === 0 ? 1.1 : .65
    ctx.fillRect(px, py, size, size)
  }
  ctx.restore()
}

function renderActiveEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)

  const activation = ctx.createRadialGradient(800, 382, 64, 800, 382, 560)
  activation.addColorStop(0, "rgba(218,160,0,.055)")
  activation.addColorStop(.26, "rgba(218,160,0,.044)")
  activation.addColorStop(.62, "rgba(218,160,0,.016)")
  activation.addColorStop(1, "rgba(218,160,0,0)")
  ctx.fillStyle = activation
  ctx.fillRect(0, 0, VW, VH)

  ctx.save()
  ctx.strokeStyle = "rgba(218,160,0,.075)"
  ctx.lineWidth = 1
  ctx.strokeRect(418, 176, 764, 414)
  ctx.strokeStyle = "rgba(218,160,0,.04)"
  ctx.strokeRect(444, 202, 712, 362)

  ctx.fillStyle = "rgba(218,160,0,.07)"
  for (let x = 472; x <= 1128; x += 41) {
    ctx.fillRect(x, 166, 3, 8)
    ctx.fillRect(x, 592, 3, 8)
  }
  for (let y = 214; y <= 552; y += 36) {
    ctx.fillRect(408, y, 8, 3)
    ctx.fillRect(1184, y, 8, 3)
  }

  activeRoutes.forEach((route, index) => {
    strokeRoute(
      ctx,
      route,
      index % 4 === 0 ? "rgba(218,160,0,.10)" : "rgba(218,160,0,.065)",
      index % 3 === 0 ? 1.2 : .9
    )
  })

  drawViaCluster(ctx, 390, 224, 3, 3, 13, 13, .095)
  drawViaCluster(ctx, 1184, 224, 3, 3, 13, 13, .095)
  drawViaCluster(ctx, 390, 514, 3, 3, 13, 13, .075)
  drawViaCluster(ctx, 1184, 514, 3, 3, 13, 13, .075)

  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(218,160,0,.10)"
  ctx.fillText("CORE / 01", 438, 194)
  ctx.fillText("EMBEDDED BUS", 1062, 578)
  ctx.restore()
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copyVisible, setCopyVisible] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return

    const baseLayer = document.createElement("canvas")
    baseLayer.width = VW
    baseLayer.height = VH
    const baseContext = baseLayer.getContext("2d", { alpha: false })

    const activeLayer = document.createElement("canvas")
    activeLayer.width = VW
    activeLayer.height = VH
    const activeContext = activeLayer.getContext("2d", { alpha: true })

    if (baseContext) renderBaseEnvironment(baseContext)
    if (activeContext) renderActiveEnvironment(activeContext)

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

    const drawEnvironment = (time: number) => {
      context.drawImage(baseLayer, 0, 0, VW, VH)

      const wake = reducedMotion ? 1 : smoothstep((time - .04) / 1.15)
      context.save()
      context.globalAlpha = .14 + wake * .86
      context.drawImage(activeLayer, 0, 0, VW, VH)
      context.restore()
    }

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const activation = smoothstep((time - (circuits[index].spec.delay - .08)) / .12)

        context.beginPath()
        context.arc(x, y, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(9,10,8,.98)"
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

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      context.save()
      context.scale(scaleX, scaleY)
      drawEnvironment(time)
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

        const firstLogoMoment = Math.min(...circuits.map((circuit) => circuit.spec.delay + circuit.duration * .34))
        const lastCircuitEnd = Math.max(...circuits.map((circuit) => circuit.end))
        fillStart = firstLogoMoment + .32
        copyStart = fillStart + .12
        animationEnd = lastCircuitEnd + .20

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
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/20 bg-[#040504]"
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
