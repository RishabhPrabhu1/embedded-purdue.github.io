"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 760
const GOLD = "#daa000"
const BRIGHT = "#f4c64d"
const COPPER = "#8f6718"
const BOARD = { x: 92, y: 52, width: 1416, height: 656, cut: 28 }
const MODULE = { x: 612, y: 112, width: 376, height: 188, cut: 16 }
const SIGNAL_BAY = { x: 218, y: 304, width: 1164, height: 350, cut: 26 }
const LOGO = { x: 250, y: 332, width: 1100, height: 350 }
const LOGO_SCALE = LOGO.width / 1920
const CIRCUIT_SPEED = 1480
const CORE_READY = 0.62
const HEADER_START_X = 300
const HEADER_END_X = 1300
const HEADER_COUNT = 22
const HEADER_TOP_Y = 90
const HEADER_BOTTOM_Y = 670

const PIN_LABELS_TOP = ["3V3", "EN", "IO36", "IO39", "IO34", "IO35", "IO32", "IO33", "IO25", "IO26", "IO27", "IO14", "IO12", "GND", "IO13", "SD2", "SD3", "CMD", "5V", "VIN", "RST", "GND"]
const PIN_LABELS_BOTTOM = ["GND", "TX0", "RX0", "IO22", "IO21", "IO19", "IO18", "IO5", "IO17", "IO16", "IO4", "IO0", "IO2", "IO15", "SD1", "SD0", "CLK", "SDA", "SCL", "3V3", "GND", "5V"]

type Point = readonly [number, number]
type Route = readonly Point[]
type PreparedRoute = { points: Route; segments: number[]; total: number }

type SignalSpec = {
  route: Route
  delay: number
}

type SignalRuntime = {
  route: PreparedRoute
  delay: number
  duration: number
  end: number
}

type CircuitSpec = {
  pathIndex: number
  from: number
  to: number
  source: Point
  entry: Route
  exit: Route
  sink: Point
  delay: number
}

type CircuitRuntime = {
  spec: CircuitSpec
  route: PreparedRoute
  duration: number
  start: number
  end: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

function headerPoint(index: number, top: boolean): Point {
  const t = index / (HEADER_COUNT - 1)
  return [HEADER_START_X + (HEADER_END_X - HEADER_START_X) * t, top ? HEADER_TOP_Y : HEADER_BOTTOM_Y]
}

const leftTestPads: Point[] = [[150, 208], [150, 292], [150, 468], [150, 552]]
const rightTestPads: Point[] = [[1450, 208], [1450, 292], [1450, 468], [1450, 552]]

const inputSignalSpecs: SignalSpec[] = [
  { route: [headerPoint(2, true), [395, 146], [552, 146], [552, 164], [MODULE.x, 164]], delay: .06 },
  { route: [headerPoint(6, true), [586, 142], [586, 194], [MODULE.x, 194]], delay: .11 },
  { route: [headerPoint(15, true), [1086, 142], [1032, 142], [1032, 164], [MODULE.x + MODULE.width, 164]], delay: .08 },
  { route: [headerPoint(19, true), [1278, 150], [1042, 150], [1042, 194], [MODULE.x + MODULE.width, 194]], delay: .15 },
  { route: [headerPoint(4, false), [490, 612], [490, 282], [654, 282], [654, MODULE.y + MODULE.height]], delay: .12 },
  { route: [headerPoint(8, false), [681, 608], [681, MODULE.y + MODULE.height]], delay: .18 },
  { route: [headerPoint(13, false), [919, 608], [919, MODULE.y + MODULE.height]], delay: .10 },
  { route: [headerPoint(18, false), [1157, 612], [1157, 282], [946, 282], [946, MODULE.y + MODULE.height]], delay: .16 },
]

const outputSources: Point[] = [
  [640, 300], [674, 300], [708, 300], [742, 300],
  [776, 300], [824, 300], [858, 300], [892, 300],
  [926, 300], [960, 300], [612, 182], [612, 230],
  [988, 182], [988, 230], [724, 112], [876, 112],
]

const circuitSpecs: CircuitSpec[] = [
  { pathIndex: 0, from: .02, to: .13, source: outputSources[0], entry: [[640, 318], [366, 318]], exit: [[310, 420], [188, 420]], sink: leftTestPads[2], delay: .02 },
  { pathIndex: 0, from: .30, to: .43, source: outputSources[1], entry: [[674, 322], [438, 322]], exit: [[426, 618], [426, 650]], sink: headerPoint(3, false), delay: .07 },
  { pathIndex: 0, from: .62, to: .75, source: outputSources[2], entry: [[708, 326], [520, 326]], exit: [[236, 250], [188, 250]], sink: leftTestPads[1], delay: .12 },
  { pathIndex: 0, from: .79, to: .90, source: outputSources[3], entry: [[742, 330], [612, 330]], exit: [[1382, 418], [1418, 418]], sink: rightTestPads[2], delay: .16 },

  { pathIndex: 1, from: .04, to: .18, source: outputSources[4], entry: [[776, 326]], exit: [[666, 618], [666, 650]], sink: headerPoint(8, false), delay: .05 },
  { pathIndex: 1, from: .34, to: .50, source: outputSources[5], entry: [[824, 326], [770, 326]], exit: [[1382, 246], [1418, 246]], sink: rightTestPads[1], delay: .10 },
  { pathIndex: 1, from: .52, to: .64, source: outputSources[6], entry: [[858, 330], [918, 330]], exit: [[264, 530], [188, 530]], sink: leftTestPads[3], delay: .14 },
  { pathIndex: 1, from: .67, to: .82, source: outputSources[7], entry: [[892, 326], [1000, 326]], exit: [[1038, 148], [1038, 110]], sink: headerPoint(15, true), delay: .19 },

  { pathIndex: 2, from: .04, to: .13, source: outputSources[8], entry: [[926, 326], [1088, 326]], exit: [[312, 188], [188, 188]], sink: leftTestPads[0], delay: .06 },
  { pathIndex: 2, from: .27, to: .40, source: outputSources[9], entry: [[960, 322], [1164, 322]], exit: [[974, 150], [974, 110]], sink: headerPoint(14, true), delay: .11 },
  { pathIndex: 2, from: .46, to: .58, source: outputSources[10], entry: [[586, 182], [586, 314]], exit: [[1172, 618], [1172, 650]], sink: headerPoint(18, false), delay: .15 },
  { pathIndex: 2, from: .66, to: .79, source: outputSources[11], entry: [[568, 230], [568, 318]], exit: [[1378, 500], [1418, 500]], sink: rightTestPads[3], delay: .20 },

  { pathIndex: 3, from: .05, to: .18, source: outputSources[12], entry: [[1012, 182], [1012, 314]], exit: [[1208, 618], [1208, 650]], sink: headerPoint(19, false), delay: .08 },
  { pathIndex: 3, from: .31, to: .47, source: outputSources[13], entry: [[1032, 230], [1032, 318]], exit: [[1384, 332], [1418, 332]], sink: rightTestPads[2], delay: .13 },
  { pathIndex: 3, from: .61, to: .78, source: outputSources[14], entry: [[724, 132], [724, 318]], exit: [[1258, 150], [1258, 110]], sink: headerPoint(20, true), delay: .18 },
  { pathIndex: 3, from: .80, to: .91, source: outputSources[15], entry: [[876, 132], [876, 318]], exit: [[1382, 206], [1418, 206]], sink: rightTestPads[0], delay: .23 },
]

function clippedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, cut: number) {
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

function strokeRoute(ctx: CanvasRenderingContext2D, route: Route, stroke: string, width = 1) {
  if (route.length < 2) return
  ctx.beginPath()
  ctx.moveTo(route[0][0], route[0][1])
  for (let index = 1; index < route.length; index++) ctx.lineTo(route[index][0], route[index][1])
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.stroke()
}

function drawThroughHole(ctx: CanvasRenderingContext2D, x: number, y: number, active = false, radius = 6.4) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = active ? "rgba(218,160,0,.92)" : "rgba(182,132,31,.72)"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, radius * .52, 0, Math.PI * 2)
  ctx.fillStyle = "#05100c"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.strokeStyle = active ? "rgba(244,198,77,.95)" : "rgba(234,195,99,.34)"
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawHeaderRows(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.textAlign = "center"

  for (let index = 0; index < HEADER_COUNT; index++) {
    const [xTop, yTop] = headerPoint(index, true)
    const [xBottom, yBottom] = headerPoint(index, false)
    drawThroughHole(ctx, xTop, yTop)
    drawThroughHole(ctx, xBottom, yBottom)

    if (index % 2 === 0) {
      ctx.fillStyle = "rgba(225,229,214,.55)"
      ctx.fillText(PIN_LABELS_TOP[index], xTop, yTop + 24)
      ctx.fillText(PIN_LABELS_BOTTOM[index], xBottom, yBottom - 18)
    }
  }
  ctx.restore()
}

function drawProtoGrid(ctx: CanvasRenderingContext2D, x: number, y: number, columns: number, rows: number) {
  ctx.save()
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      drawThroughHole(ctx, x + column * 21, y + row * 21, false, 4.2)
    }
  }
  ctx.restore()
}

function drawSmd(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = "rgba(7,9,7,.96)"
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = "rgba(200,148,42,.55)"
  ctx.fillRect(x - 3, y + 2, 2, Math.max(2, height - 4))
  ctx.fillRect(x + width + 1, y + 2, 2, Math.max(2, height - 4))
}

function drawBoardModule(ctx: CanvasRenderingContext2D) {
  ctx.save()
  clippedRectPath(ctx, MODULE.x, MODULE.y, MODULE.width, MODULE.height, MODULE.cut)
  ctx.fillStyle = "#07110e"
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.48)"
  ctx.lineWidth = 1.2
  ctx.stroke()

  for (let x = MODULE.x + 18; x <= MODULE.x + MODULE.width - 18; x += 20) {
    ctx.fillStyle = "rgba(196,143,34,.68)"
    ctx.fillRect(x, MODULE.y - 5, 9, 6)
    ctx.fillRect(x, MODULE.y + MODULE.height - 1, 9, 6)
  }

  const shieldX = MODULE.x + 26
  const shieldY = MODULE.y + 28
  const shieldW = 224
  const shieldH = 116
  const shield = ctx.createLinearGradient(shieldX, shieldY, shieldX + shieldW, shieldY + shieldH)
  shield.addColorStop(0, "#a9aca5")
  shield.addColorStop(.5, "#737970")
  shield.addColorStop(1, "#b9bbb3")
  ctx.fillStyle = shield
  ctx.fillRect(shieldX, shieldY, shieldW, shieldH)
  ctx.strokeStyle = "rgba(255,255,255,.28)"
  ctx.strokeRect(shieldX + .5, shieldY + .5, shieldW - 1, shieldH - 1)

  ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(15,18,16,.76)"
  ctx.fillText("ES@P CORE", shieldX + 18, shieldY + 34)
  ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText("ESP32-STYLE MODULE", shieldX + 18, shieldY + 54)
  ctx.fillText("2.4 GHz / MCU", shieldX + 18, shieldY + 72)

  const antennaX = MODULE.x + 275
  const antennaY = MODULE.y + 26
  ctx.strokeStyle = "rgba(218,160,0,.72)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(antennaX, antennaY + 18)
  ctx.lineTo(antennaX + 62, antennaY + 18)
  ctx.lineTo(antennaX + 62, antennaY + 34)
  ctx.lineTo(antennaX + 12, antennaY + 34)
  ctx.lineTo(antennaX + 12, antennaY + 50)
  ctx.lineTo(antennaX + 62, antennaY + 50)
  ctx.lineTo(antennaX + 62, antennaY + 66)
  ctx.lineTo(antennaX + 12, antennaY + 66)
  ctx.lineTo(antennaX + 12, antennaY + 82)
  ctx.lineTo(antennaX + 62, antennaY + 82)
  ctx.stroke()
  ctx.font = "7px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(222,226,211,.48)"
  ctx.fillText("RF", antennaX + 74, antennaY + 54)

  ctx.restore()
}

function drawUsbAndControls(ctx: CanvasRenderingContext2D) {
  ctx.save()
  const usbX = BOARD.x - 24
  const usbY = 318
  const usbW = 94
  const usbH = 72
  const metal = ctx.createLinearGradient(usbX, usbY, usbX + usbW, usbY + usbH)
  metal.addColorStop(0, "#9ea4a0")
  metal.addColorStop(.48, "#555c59")
  metal.addColorStop(1, "#b7bbb7")
  ctx.fillStyle = metal
  ctx.fillRect(usbX, usbY, usbW, usbH)
  ctx.fillStyle = "#111816"
  ctx.fillRect(usbX + 10, usbY + 14, usbW - 20, usbH - 28)
  ctx.fillStyle = "rgba(218,160,0,.60)"
  for (let index = 0; index < 6; index++) ctx.fillRect(usbX + 24 + index * 8, usbY + 26, 4, 16)
  ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(226,229,215,.58)"
  ctx.fillText("USB-C / PWR", BOARD.x + 82, usbY + 32)

  const buttons = [
    { x: BOARD.x + 118, y: 250, label: "EN" },
    { x: BOARD.x + 118, y: 456, label: "BOOT" },
  ]
  buttons.forEach((button) => {
    ctx.fillStyle = "#151915"
    ctx.fillRect(button.x, button.y, 42, 28)
    ctx.strokeStyle = "rgba(210,215,198,.25)"
    ctx.strokeRect(button.x + .5, button.y + .5, 41, 27)
    ctx.fillStyle = "rgba(222,226,211,.55)"
    ctx.fillText(button.label, button.x + 52, button.y + 18)
  })
  ctx.restore()
}

function renderBoardBase(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)
  ctx.fillStyle = "#010302"
  ctx.fillRect(0, 0, VW, VH)

  const halo = ctx.createRadialGradient(800, 380, 100, 800, 380, 860)
  halo.addColorStop(0, "rgba(16,28,20,.18)")
  halo.addColorStop(.55, "rgba(5,10,7,.56)")
  halo.addColorStop(1, "rgba(0,0,0,1)")
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, VW, VH)

  ctx.save()
  clippedRectPath(ctx, BOARD.x, BOARD.y, BOARD.width, BOARD.height, BOARD.cut)
  const boardFill = ctx.createLinearGradient(BOARD.x, BOARD.y, BOARD.x + BOARD.width, BOARD.y + BOARD.height)
  boardFill.addColorStop(0, "#183329")
  boardFill.addColorStop(.38, "#0f271f")
  boardFill.addColorStop(.72, "#112c23")
  boardFill.addColorStop(1, "#0a1d17")
  ctx.fillStyle = boardFill
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.55)"
  ctx.lineWidth = 1.7
  ctx.stroke()
  ctx.clip()

  ctx.strokeStyle = "rgba(224,231,217,.045)"
  ctx.lineWidth = .8
  for (let x = BOARD.x + 24; x < BOARD.x + BOARD.width - 20; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, BOARD.y + 16)
    ctx.lineTo(x, BOARD.y + BOARD.height - 16)
    ctx.stroke()
  }

  const staticTraces: Route[] = [
    [[190,150],[266,150],[266,205],[430,205],[430,266],[558,266]],
    [[190,610],[278,610],[278,548],[430,548],[430,510],[554,510]],
    [[1410,150],[1328,150],[1328,205],[1166,205],[1166,266],[1038,266]],
    [[1410,610],[1322,610],[1322,548],[1170,548],[1170,510],[1042,510]],
    [[362,112],[362,152],[492,152],[492,184],[574,184]],
    [[1238,112],[1238,152],[1108,152],[1108,184],[1026,184]],
    [[362,646],[362,600],[512,600],[512,566],[604,566]],
    [[1238,646],[1238,600],[1088,600],[1088,566],[996,566]],
  ]
  staticTraces.forEach((route, index) => strokeRoute(ctx, route, index % 2 === 0 ? "rgba(206,151,38,.32)" : "rgba(206,151,38,.22)", index % 3 === 0 ? 2 : 1.2))

  ctx.restore()

  drawHeaderRows(ctx)
  drawUsbAndControls(ctx)
  drawBoardModule(ctx)

  drawProtoGrid(ctx, 164, 150, 4, 6)
  drawProtoGrid(ctx, 1373, 150, 4, 6)
  drawProtoGrid(ctx, 164, 480, 4, 6)
  drawProtoGrid(ctx, 1373, 480, 4, 6)

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      drawSmd(ctx, 382 + col * 28, 214 + row * 18, 14, 7)
      drawSmd(ctx, 1050 + col * 28, 214 + row * 18, 14, 7)
    }
  }

  ctx.save()
  clippedRectPath(ctx, SIGNAL_BAY.x, SIGNAL_BAY.y, SIGNAL_BAY.width, SIGNAL_BAY.height, SIGNAL_BAY.cut)
  const bay = ctx.createRadialGradient(800, 485, 70, 800, 485, 640)
  bay.addColorStop(0, "rgba(0,1,1,.995)")
  bay.addColorStop(.48, "rgba(3,8,6,.985)")
  bay.addColorStop(1, "rgba(7,18,14,.92)")
  ctx.fillStyle = bay
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.48)"
  ctx.lineWidth = 1.4
  ctx.stroke()

  clippedRectPath(ctx, SIGNAL_BAY.x + 18, SIGNAL_BAY.y + 18, SIGNAL_BAY.width - 36, SIGNAL_BAY.height - 36, 18)
  ctx.strokeStyle = "rgba(212,223,205,.09)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(218,160,0,.58)"
  ctx.fillText("SIGNAL FABRIC / OUTPUT PLANE", SIGNAL_BAY.x + 28, SIGNAL_BAY.y + 28)
  ctx.fillStyle = "rgba(220,225,210,.30)"
  ctx.fillText("ES@P DEV BOARD  ·  REV 01", 118, 690)
  ctx.fillText("3V3", 236, 136)
  ctx.fillText("GND", 1334, 136)
  ctx.fillText("UART", 236, 628)
  ctx.fillText("I2C", 1328, 628)
  ctx.restore()

  ;[...leftTestPads, ...rightTestPads].forEach(([x, y]) => drawThroughHole(ctx, x, y, false, 6.2))
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
  const start: Point[] = [spec.source, ...spec.entry]
  const firstLogo = logoSegment[0]
  const lastStart = start[start.length - 1]
  start.push(...orthogonalJoin(lastStart, firstLogo, spec.pathIndex % 2 === 0))

  const exit = [...spec.exit, spec.sink]
  const firstExit = exit[0]
  const lastLogo = logoSegment[logoSegment.length - 1]
  const bridge = orthogonalJoin(lastLogo, firstExit, spec.pathIndex % 2 !== 0)

  return prepareRoute([...start, ...logoSegment.slice(1), ...bridge, ...exit.slice(1)])
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

    const boardLayer = document.createElement("canvas")
    boardLayer.width = VW
    boardLayer.height = VH
    const boardContext = boardLayer.getContext("2d", { alpha: false })
    if (boardContext) renderBoardBase(boardContext)

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
    let inputSignals: SignalRuntime[] = []
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

    const drawDormantFabric = () => {
      context.save()
      context.globalAlpha = .34
      inputSignals.forEach((signal) => drawPrepared(context, signal.route, 1, "rgba(143,103,24,.46)", 2.1))
      context.globalAlpha = .20
      circuits.forEach((circuit) => drawPrepared(context, circuit.route, 1, "rgba(143,103,24,.36)", 2.55))
      context.restore()
    }

    const drawInputSignals = (time: number) => {
      inputSignals.forEach((signal) => {
        const progress = smoothstep((time - signal.delay) / signal.duration)
        if (progress <= 0) return

        const head = drawPrepared(context, signal.route, progress, progress < 1 ? BRIGHT : GOLD, 2.55)
        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 3.2, 0, Math.PI * 2)
          context.fillStyle = "#fff0a8"
          context.fill()
        }
      })
    }

    const drawCoreActivity = (time: number) => {
      const power = smoothstep((time - .24) / .42)
      if (power <= 0) return

      context.save()
      context.strokeStyle = `rgba(244,198,77,${.18 + power * .62})`
      context.lineWidth = 1.5 + power * .8
      clippedRectPath(context, MODULE.x - 5, MODULE.y - 5, MODULE.width + 10, MODULE.height + 10, MODULE.cut + 2)
      context.stroke()

      const coreGlow = context.createRadialGradient(800, 206, 8, 800, 206, 170)
      coreGlow.addColorStop(0, `rgba(244,198,77,${.10 + power * .16})`)
      coreGlow.addColorStop(1, "rgba(218,160,0,0)")
      context.fillStyle = coreGlow
      context.fillRect(MODULE.x - 90, MODULE.y - 60, MODULE.width + 180, MODULE.height + 120)

      context.beginPath()
      context.arc(MODULE.x + 278, MODULE.y + 145, 4.6, 0, Math.PI * 2)
      context.fillStyle = power > .72 ? "#9de68a" : `rgba(218,160,0,${power})`
      context.fill()

      context.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace"
      context.fillStyle = `rgba(228,230,218,${.22 + power * .46})`
      context.fillText(power > .72 ? "CORE READY" : "BOOTING", MODULE.x + 292, MODULE.y + 148)

      outputSources.forEach(([x, y], index) => {
        const active = smoothstep((time - CORE_READY - circuitSpecs[index].delay + .04) / .12)
        if (active <= 0) return
        context.beginPath()
        context.arc(x, y, 2.2 + active * 1.1, 0, Math.PI * 2)
        context.fillStyle = `rgba(244,198,77,${.42 + active * .58})`
        context.fill()
      })
      context.restore()
    }

    const drawLogoCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.start) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .30)
        context.globalAlpha = 1 - settled * .38
        drawPrepared(context, circuit.route, progress, "rgba(92,64,12,.94)", 4.1)
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
      const fill = smoothstep((time - fillStart) / .72)
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
      context.drawImage(boardLayer, 0, 0, VW, VH)
      drawDormantFabric()
      drawInputSignals(time)
      drawCoreActivity(time)
      drawLogoCircuits(time)
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

        inputSignals = inputSignalSpecs.map((spec) => {
          const route = prepareRoute(spec.route)
          const duration = Math.max(.28, route.total / 920)
          return { route, delay: spec.delay, duration, end: spec.delay + duration }
        })

        circuits = circuitSpecs.map((spec) => {
          const route = buildCircuit(spec, logoPaths)
          const duration = Math.max(.42, route.total / CIRCUIT_SPEED)
          const startTime = CORE_READY + spec.delay
          return { spec, route, duration, start: startTime, end: startTime + duration }
        })

        const firstLogoMoment = Math.min(...circuits.map((circuit) => circuit.start + circuit.duration * .34))
        const lastCircuitEnd = Math.max(...circuits.map((circuit) => circuit.end))
        fillStart = firstLogoMoment + .18
        copyStart = fillStart + .12
        animationEnd = lastCircuitEnd + .24

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
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/25 bg-[#010302]"
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
