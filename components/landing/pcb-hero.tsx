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

const BOARD = { x: 18, y: 18, width: 1564, height: 724, cut: 30 }
const VOID = { x: 206, y: 116, width: 1188, height: 532, cut: 28 }

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

const activeRoutes: Route[] = [
  [[190,170],[266,170],[266,205],[356,205]],
  [[190,296],[282,296],[282,330],[370,330]],
  [[190,462],[282,462],[282,430],[370,430]],
  [[190,590],[266,590],[266,555],[356,555]],
  [[1410,170],[1334,170],[1334,205],[1244,205]],
  [[1410,296],[1318,296],[1318,330],[1230,330]],
  [[1410,462],[1318,462],[1318,430],[1230,430]],
  [[1410,590],[1334,590],[1334,555],[1244,555]],
  [[472,105],[472,170],[520,170],[520,220]],
  [[676,105],[676,174],[708,174],[708,218]],
  [[924,105],[924,174],[892,174],[892,218]],
  [[1128,105],[1128,170],[1080,170],[1080,220]],
  [[472,655],[472,590],[520,590],[520,540]],
  [[676,655],[676,586],[708,586],[708,542]],
  [[924,655],[924,586],[892,586],[892,542]],
  [[1128,655],[1128,590],[1080,590],[1080,540]],
]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

function clippedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  cut: number
) {
  ctx.beginPath()
  ctx.moveTo(x + cut, y)
  ctx.lineTo(x + width - cut, y)
  ctx.lineTo(x + width, y + cut)
  ctx.lineTo(x + width, y + height - cut)
  ctx.lineTo(x + width - cut, y + height)
  ctx.lineTo(x + cut, y + height)
  ctx.lineTo(x, y + height - cut)
  ctx.lineTo(x, y + cut)
  ctx.closePath()
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

function drawPadRail(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  count: number,
  horizontal: boolean,
  alpha: number
) {
  const gap = length / Math.max(1, count - 1)
  ctx.save()
  ctx.fillStyle = `rgba(218,160,0,${alpha})`
  for (let index = 0; index < count; index++) {
    if (horizontal) {
      const px = x + gap * index
      ctx.fillRect(px - 3, y - 6, 6, 12)
    } else {
      const py = y + gap * index
      ctx.fillRect(x - 6, py - 3, 12, 6)
    }
  }
  ctx.restore()
}

function drawViaCluster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  columns: number,
  rows: number,
  alpha: number
) {
  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = `rgba(218,160,0,${alpha})`
  ctx.fillStyle = `rgba(218,160,0,${alpha * .7})`
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const px = x + column * 15
      const py = y + row * 15
      ctx.beginPath()
      ctx.arc(px, py, 2.8, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px, py, .9, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  detail: string
) {
  ctx.save()
  clippedRectPath(ctx, x, y, width, height, 12)
  const fill = ctx.createLinearGradient(x, y, x + width, y + height)
  fill.addColorStop(0, "#0a0c08")
  fill.addColorStop(1, "#030403")
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.50)"
  ctx.lineWidth = 1.4
  ctx.stroke()

  drawPadRail(ctx, x + 20, y - 1, width - 40, 10, true, .42)
  drawPadRail(ctx, x + 20, y + height + 1, width - 40, 10, true, .42)

  ctx.fillStyle = "rgba(218,160,0,.16)"
  ctx.fillRect(x + 14, y + 14, width - 28, 2)
  ctx.fillRect(x + 14, y + height - 16, width * .36, 2)
  ctx.fillRect(x + width * .60, y + height - 16, width * .22, 2)

  ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(239,231,202,.78)"
  ctx.fillText(title, x + 14, y + 38)
  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(218,160,0,.62)"
  ctx.fillText(detail, x + 14, y + 58)
  ctx.restore()
}

function drawSmdBank(ctx: CanvasRenderingContext2D, x: number, y: number, columns: number, rows: number) {
  ctx.save()
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const px = x + column * 24
      const py = y + row * 17
      ctx.fillStyle = "#060706"
      ctx.fillRect(px, py, 14, 7)
      ctx.fillStyle = "rgba(218,160,0,.38)"
      ctx.fillRect(px - 3, py + 1, 2, 5)
      ctx.fillRect(px + 15, py + 1, 2, 5)
    }
  }
  ctx.restore()
}

function drawMountingHole(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 11, 0, Math.PI * 2)
  ctx.fillStyle = "#000"
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.48)"
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, 4.5, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(239,231,202,.30)"
  ctx.stroke()
  ctx.restore()
}

function drawSideRouting(ctx: CanvasRenderingContext2D) {
  ctx.save()
  for (let index = 0; index < 8; index++) {
    const y = 96 + index * 76
    const leftEnd = 178 + (index % 3) * 26
    const rightEnd = VW - leftEnd
    const offset = index % 2 === 0 ? 32 : 54

    strokeRoute(ctx, [[32,y],[94,y],[94,y + offset],[leftEnd,y + offset],[leftEnd + 34,y + offset + 26]], "rgba(218,160,0,.28)", index % 3 === 0 ? 1.7 : 1.2)
    strokeRoute(ctx, [[1568,y],[1506,y],[1506,y + offset],[rightEnd,y + offset],[rightEnd - 34,y + offset + 26]], "rgba(218,160,0,.28)", index % 3 === 0 ? 1.7 : 1.2)
  }

  for (let index = 0; index < 7; index++) {
    const x = 232 + index * 190
    const turn = index % 2 === 0 ? 70 : 92
    strokeRoute(ctx, [[x,30],[x,72],[x + turn,72],[x + turn,112]], "rgba(218,160,0,.22)", 1.2)
    strokeRoute(ctx, [[x,730],[x,688],[x + turn,688],[x + turn,648]], "rgba(218,160,0,.22)", 1.2)
  }
  ctx.restore()
}

function drawCoreVoid(ctx: CanvasRenderingContext2D, active: boolean) {
  ctx.save()

  clippedRectPath(ctx, VOID.x - 14, VOID.y - 14, VOID.width + 28, VOID.height + 28, VOID.cut + 7)
  ctx.fillStyle = active ? "rgba(218,160,0,.075)" : "rgba(218,160,0,.045)"
  ctx.fill()
  ctx.strokeStyle = active ? "rgba(218,160,0,.48)" : "rgba(218,160,0,.34)"
  ctx.lineWidth = active ? 2 : 1.5
  ctx.stroke()

  clippedRectPath(ctx, VOID.x, VOID.y, VOID.width, VOID.height, VOID.cut)
  const voidFill = ctx.createRadialGradient(800, 382, 60, 800, 382, 640)
  voidFill.addColorStop(0, "#000000")
  voidFill.addColorStop(.44, "#010201")
  voidFill.addColorStop(.78, active ? "#090704" : "#050604")
  voidFill.addColorStop(1, active ? "#171007" : "#0c0d08")
  ctx.fillStyle = voidFill
  ctx.fill()
  ctx.strokeStyle = active ? "rgba(218,160,0,.58)" : "rgba(218,160,0,.42)"
  ctx.lineWidth = active ? 1.8 : 1.4
  ctx.stroke()

  clippedRectPath(ctx, VOID.x + 24, VOID.y + 24, VOID.width - 48, VOID.height - 48, 20)
  ctx.strokeStyle = active ? "rgba(218,160,0,.24)" : "rgba(218,160,0,.15)"
  ctx.lineWidth = 1
  ctx.stroke()

  drawPadRail(ctx, VOID.x + 82, VOID.y - 6, VOID.width - 164, 28, true, active ? .38 : .26)
  drawPadRail(ctx, VOID.x + 82, VOID.y + VOID.height + 6, VOID.width - 164, 28, true, active ? .38 : .26)
  drawPadRail(ctx, VOID.x - 6, VOID.y + 76, VOID.height - 152, 12, false, active ? .34 : .22)
  drawPadRail(ctx, VOID.x + VOID.width + 6, VOID.y + 76, VOID.height - 152, 12, false, active ? .34 : .22)

  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = active ? "rgba(218,160,0,.50)" : "rgba(218,160,0,.30)"
  ctx.fillText("CORE SOCKET / SIGNAL FABRIC", VOID.x + 36, VOID.y + 48)
  ctx.fillText("REV 01 · EMBEDDED BACKPLANE", VOID.x + VOID.width - 214, VOID.y + VOID.height - 34)
  ctx.restore()
}

function renderBaseEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)
  ctx.fillStyle = "#000100"
  ctx.fillRect(0, 0, VW, VH)

  ctx.save()
  clippedRectPath(ctx, BOARD.x, BOARD.y, BOARD.width, BOARD.height, BOARD.cut)
  const boardFill = ctx.createLinearGradient(0, 0, VW, VH)
  boardFill.addColorStop(0, "#1b2114")
  boardFill.addColorStop(.30, "#11170d")
  boardFill.addColorStop(.62, "#17190e")
  boardFill.addColorStop(1, "#090c08")
  ctx.fillStyle = boardFill
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.52)"
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.clip()

  ctx.fillStyle = "rgba(218,160,0,.055)"
  ctx.fillRect(38, 76, 188, 608)
  ctx.fillRect(1374, 76, 188, 608)
  ctx.fillRect(238, 30, 1124, 82)
  ctx.fillRect(238, 648, 1124, 82)

  ctx.strokeStyle = "rgba(236,228,197,.055)"
  ctx.lineWidth = .8
  for (let x = 52; x < 1560; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 34)
    ctx.lineTo(x, 726)
    ctx.stroke()
  }
  for (let y = 42; y < 724; y += 38) {
    ctx.beginPath()
    ctx.moveTo(34, y)
    ctx.lineTo(1566, y)
    ctx.stroke()
  }

  drawSideRouting(ctx)

  drawModule(ctx, 62, 92, 166, 104, "MCU / CTRL", "SWD · 3V3 · CLK")
  drawModule(ctx, 1372, 92, 166, 104, "IO / GPIO", "SPI · UART · PWM")
  drawModule(ctx, 62, 564, 166, 104, "PWR / REG", "3V3 · 5V · GND")
  drawModule(ctx, 1372, 564, 166, 104, "BUS / COMM", "I2C · CAN · USB")

  drawSmdBank(ctx, 70, 246, 5, 3)
  drawSmdBank(ctx, 1410, 246, 5, 3)
  drawSmdBank(ctx, 70, 442, 5, 3)
  drawSmdBank(ctx, 1410, 442, 5, 3)

  drawViaCluster(ctx, 250, 74, 6, 2, .30)
  drawViaCluster(ctx, 1265, 74, 6, 2, .30)
  drawViaCluster(ctx, 250, 660, 6, 2, .26)
  drawViaCluster(ctx, 1265, 660, 6, 2, .26)
  drawViaCluster(ctx, 78, 342, 4, 4, .27)
  drawViaCluster(ctx, 1472, 342, 4, 4, .27)

  ctx.restore()

  drawMountingHole(ctx, 54, 54)
  drawMountingHole(ctx, 1546, 54)
  drawMountingHole(ctx, 54, 706)
  drawMountingHole(ctx, 1546, 706)

  drawCoreVoid(ctx, false)

  ctx.save()
  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(237,227,194,.42)"
  ctx.fillText("JTAG", 70, 228)
  ctx.fillText("ADC", 70, 424)
  ctx.fillText("GPIO", 1480, 228)
  ctx.fillText("PWM", 1480, 424)
  ctx.fillText("SPI0", 326, 700)
  ctx.fillText("I2C0", 1218, 700)
  ctx.fillText("CLK / 48MHz", 758, 72)
  ctx.fillStyle = "rgba(218,160,0,.55)"
  ctx.fillText("ES@P / EMBEDDED SYSTEMS", 710, 708)
  ctx.restore()

  ctx.save()
  ctx.fillStyle = "rgba(240,232,204,.040)"
  for (let index = 0; index < 760; index++) {
    const px = (index * 83 + 29) % VW
    const py = (index * 137 + 47) % VH
    ctx.fillRect(px, py, index % 13 === 0 ? 1.2 : .7, index % 13 === 0 ? 1.2 : .7)
  }
  ctx.restore()
}

function renderActiveEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)

  const activation = ctx.createRadialGradient(800, 380, 80, 800, 380, 660)
  activation.addColorStop(0, "rgba(218,160,0,.10)")
  activation.addColorStop(.34, "rgba(218,160,0,.065)")
  activation.addColorStop(.72, "rgba(218,160,0,.020)")
  activation.addColorStop(1, "rgba(218,160,0,0)")
  ctx.fillStyle = activation
  ctx.fillRect(0, 0, VW, VH)

  drawCoreVoid(ctx, true)

  ctx.save()
  activeRoutes.forEach((route, index) => {
    strokeRoute(ctx, route, index % 3 === 0 ? "rgba(244,198,77,.46)" : "rgba(218,160,0,.34)", index % 4 === 0 ? 1.9 : 1.45)
  })

  drawViaCluster(ctx, 238, 204, 4, 3, .42)
  drawViaCluster(ctx, 1317, 204, 4, 3, .42)
  drawViaCluster(ctx, 238, 512, 4, 3, .34)
  drawViaCluster(ctx, 1317, 512, 4, 3, .34)

  ctx.fillStyle = "rgba(244,198,77,.72)"
  const leds: Point[] = [[192,138],[1408,138],[192,622],[1408,622]]
  leds.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  })
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
      const wake = reducedMotion ? 1 : smoothstep((time - .04) / 1.05)
      context.save()
      context.globalAlpha = .10 + wake * .90
      context.drawImage(activeLayer, 0, 0, VW, VH)
      context.restore()
    }

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const activation = smoothstep((time - (circuits[index].spec.delay - .08)) / .12)

        context.beginPath()
        context.arc(x, y, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(2,3,2,.98)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.64 + activation * .28})`
        context.lineWidth = 1.6
        context.stroke()

        context.beginPath()
        context.arc(x, y, 3.8 + activation * .45, 0, Math.PI * 2)
        context.fillStyle = GOLD
        context.globalAlpha = .76 + activation * .24
        context.fill()
        context.globalAlpha = 1
      })
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .28)
        context.globalAlpha = 1 - settled * .54
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.55)
        context.globalAlpha = 1

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 3.1, 0, Math.PI * 2)
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
      context.globalAlpha = fill
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
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/35 bg-black"
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
