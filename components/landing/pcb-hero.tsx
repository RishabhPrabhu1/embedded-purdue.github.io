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

const BOARD = { x: 28, y: 24, width: 1544, height: 712, cut: 34 }
const CORE = { x: 232, y: 144, width: 1136, height: 474, cut: 28 }

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
  [[52,96],[124,96],[124,128],[206,128],[206,174],[300,174]],
  [[52,210],[106,210],[106,252],[196,252],[196,296],[302,296]],
  [[52,338],[132,338],[132,374],[218,374],[218,412],[304,412]],
  [[52,520],[112,520],[112,484],[204,484],[204,450],[306,450]],
  [[52,650],[146,650],[146,616],[230,616],[230,582],[330,582]],
  [[1548,98],[1470,98],[1470,138],[1388,138],[1388,178],[1296,178]],
  [[1548,214],[1494,214],[1494,258],[1404,258],[1404,296],[1298,296]],
  [[1548,340],[1470,340],[1470,378],[1382,378],[1382,416],[1296,416]],
  [[1548,520],[1488,520],[1488,484],[1396,484],[1396,450],[1294,450]],
  [[1548,652],[1454,652],[1454,616],[1370,616],[1370,582],[1270,582]],
  [[126,48],[126,86],[176,86],[176,126],[236,126]],
  [[356,48],[356,94],[404,94],[404,138],[462,138]],
  [[544,48],[544,102],[502,102],[502,152]],
  [[1056,48],[1056,102],[1098,102],[1098,152]],
  [[1244,48],[1244,94],[1196,94],[1196,138],[1138,138]],
  [[1474,48],[1474,86],[1424,86],[1424,126],[1364,126]],
  [[126,712],[126,674],[176,674],[176,634],[236,634]],
  [[356,712],[356,666],[404,666],[404,622],[462,622]],
  [[544,712],[544,658],[502,658],[502,608]],
  [[1056,712],[1056,658],[1098,658],[1098,608]],
  [[1244,712],[1244,666],[1196,666],[1196,622],[1138,622]],
  [[1474,712],[1474,674],[1424,674],[1424,634],[1364,634]],
]

const activeRoutes: Route[] = [
  [[306,196],[382,196],[382,224],[448,224]],
  [[304,286],[390,286],[390,316],[454,316]],
  [[304,470],[382,470],[382,438],[452,438]],
  [[306,562],[392,562],[392,532],[462,532]],
  [[1294,196],[1218,196],[1218,224],[1152,224]],
  [[1296,286],[1210,286],[1210,316],[1146,316]],
  [[1296,470],[1218,470],[1218,438],[1148,438]],
  [[1294,562],[1208,562],[1208,532],[1138,532]],
  [[512,150],[512,202],[548,202],[548,232]],
  [[684,150],[684,198],[706,198],[706,224]],
  [[916,150],[916,198],[894,198],[894,224]],
  [[1088,150],[1088,202],[1052,202],[1052,232]],
  [[512,610],[512,558],[548,558],[548,528]],
  [[684,610],[684,562],[706,562],[706,536]],
  [[916,610],[916,562],[894,562],[894,536]],
  [[1088,610],[1088,558],[1052,558],[1052,528]],
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
  ctx.fillStyle = `rgba(218,160,0,${alpha * .52})`
  ctx.lineWidth = .9

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const px = x + column * spacingX
      const py = y + row * spacingY
      ctx.beginPath()
      ctx.arc(px, py, 2.4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px, py, .78, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

function drawMountingHole(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 10, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(1,2,1,.88)"
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.24)"
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, 4.2, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(219,211,184,.14)"
  ctx.stroke()
  ctx.restore()
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
  ctx.save()
  ctx.fillStyle = `rgba(218,160,0,${alpha})`
  const gap = length / Math.max(1, count - 1)

  for (let index = 0; index < count; index++) {
    if (horizontal) {
      const px = x + gap * index
      ctx.fillRect(px - 2.2, y - 5, 4.4, 10)
    } else {
      const py = y + gap * index
      ctx.fillRect(x - 5, py - 2.2, 10, 4.4)
    }
  }
  ctx.restore()
}

function drawSmdBank(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  columns: number,
  rows: number,
  alpha: number
) {
  ctx.save()
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const px = x + column * 22
      const py = y + row * 16
      ctx.fillStyle = `rgba(10,11,8,${.82 + (row % 2) * .08})`
      ctx.fillRect(px, py, 13, 6)
      ctx.fillStyle = `rgba(218,160,0,${alpha})`
      ctx.fillRect(px - 3, py + 1, 2, 4)
      ctx.fillRect(px + 14, py + 1, 2, 4)
    }
  }
  ctx.restore()
}

function drawControllerModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  subLabel: string,
  alpha: number
) {
  ctx.save()
  clippedRectPath(ctx, x, y, width, height, 12)
  const fill = ctx.createLinearGradient(x, y, x + width, y + height)
  fill.addColorStop(0, "rgba(20,21,15,.90)")
  fill.addColorStop(1, "rgba(5,6,4,.94)")
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = `rgba(218,160,0,${alpha})`
  ctx.lineWidth = 1.1
  ctx.stroke()

  drawPadRail(ctx, x + 20, y - 1, width - 40, 9, true, alpha * .78)
  drawPadRail(ctx, x + 20, y + height + 1, width - 40, 9, true, alpha * .78)
  drawPadRail(ctx, x - 1, y + 18, height - 36, 5, false, alpha * .68)
  drawPadRail(ctx, x + width + 1, y + 18, height - 36, 5, false, alpha * .68)

  ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = `rgba(227,217,186,${Math.min(.48, alpha * 1.9)})`
  ctx.fillText(label, x + 14, y + 24)
  ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = `rgba(218,160,0,${Math.min(.42, alpha * 1.55)})`
  ctx.fillText(subLabel, x + 14, y + 42)

  ctx.fillStyle = `rgba(218,160,0,${alpha * .85})`
  ctx.fillRect(x + 14, y + height - 22, width * .28, 2)
  ctx.fillRect(x + width * .54, y + height - 22, width * .16, 2)
  ctx.fillRect(x + width * .75, y + height - 22, width * .12, 2)
  ctx.restore()
}

function drawEdgeConnector(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  count: number,
  horizontal: boolean,
  alpha: number
) {
  ctx.save()
  ctx.fillStyle = `rgba(218,160,0,${alpha})`
  for (let index = 0; index < count; index++) {
    if (horizontal) {
      ctx.fillRect(x + index * 15, y, 8, 20)
    } else {
      ctx.fillRect(x, y + index * 15, 20, 8)
    }
  }
  ctx.restore()
}

function drawCoreSocket(ctx: CanvasRenderingContext2D, active = false) {
  ctx.save()

  clippedRectPath(ctx, CORE.x, CORE.y, CORE.width, CORE.height, CORE.cut)
  const socketFill = ctx.createRadialGradient(800, 380, 40, 800, 380, 610)
  socketFill.addColorStop(0, active ? "rgba(1,2,1,.985)" : "rgba(1,2,1,.995)")
  socketFill.addColorStop(.44, active ? "rgba(7,6,3,.97)" : "rgba(4,5,3,.985)")
  socketFill.addColorStop(1, active ? "rgba(17,13,6,.86)" : "rgba(9,10,7,.94)")
  ctx.fillStyle = socketFill
  ctx.fill()
  ctx.strokeStyle = active ? "rgba(218,160,0,.30)" : "rgba(218,160,0,.20)"
  ctx.lineWidth = active ? 1.55 : 1.2
  ctx.stroke()

  clippedRectPath(ctx, CORE.x + 26, CORE.y + 26, CORE.width - 52, CORE.height - 52, 18)
  ctx.strokeStyle = active ? "rgba(218,160,0,.13)" : "rgba(218,160,0,.075)"
  ctx.lineWidth = 1
  ctx.stroke()

  drawPadRail(ctx, CORE.x + 76, CORE.y - 7, CORE.width - 152, 25, true, active ? .18 : .10)
  drawPadRail(ctx, CORE.x + 76, CORE.y + CORE.height + 7, CORE.width - 152, 25, true, active ? .18 : .10)
  drawPadRail(ctx, CORE.x - 7, CORE.y + 72, CORE.height - 144, 10, false, active ? .15 : .085)
  drawPadRail(ctx, CORE.x + CORE.width + 7, CORE.y + 72, CORE.height - 144, 10, false, active ? .15 : .085)

  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = active ? "rgba(218,160,0,.24)" : "rgba(218,160,0,.13)"
  ctx.fillText("CORE_0 / SIGNAL FABRIC", CORE.x + 38, CORE.y + 50)
  ctx.fillText("EMBEDDED BACKPLANE", CORE.x + CORE.width - 166, CORE.y + CORE.height - 34)
  ctx.restore()
}

function renderBaseEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)
  ctx.fillStyle = "#020302"
  ctx.fillRect(0, 0, VW, VH)

  const outerAmbient = ctx.createRadialGradient(800, 380, 90, 800, 380, 930)
  outerAmbient.addColorStop(0, "rgba(20,14,5,.10)")
  outerAmbient.addColorStop(.48, "rgba(22,18,8,.22)")
  outerAmbient.addColorStop(.78, "rgba(4,5,3,.82)")
  outerAmbient.addColorStop(1, "rgba(0,0,0,1)")
  ctx.fillStyle = outerAmbient
  ctx.fillRect(0, 0, VW, VH)

  ctx.save()
  clippedRectPath(ctx, BOARD.x, BOARD.y, BOARD.width, BOARD.height, BOARD.cut)
  const boardFill = ctx.createLinearGradient(BOARD.x, BOARD.y, BOARD.x + BOARD.width, BOARD.y + BOARD.height)
  boardFill.addColorStop(0, "#14150f")
  boardFill.addColorStop(.38, "#0c0e09")
  boardFill.addColorStop(.68, "#121109")
  boardFill.addColorStop(1, "#070806")
  ctx.fillStyle = boardFill
  ctx.fill()
  ctx.strokeStyle = "rgba(218,160,0,.26)"
  ctx.lineWidth = 1.4
  ctx.stroke()
  ctx.clip()

  ctx.strokeStyle = "rgba(229,222,194,.022)"
  ctx.lineWidth = .8
  for (let x = 76; x < VW - 60; x += 46) {
    ctx.beginPath()
    ctx.moveTo(x, 46)
    ctx.lineTo(x, 714)
    ctx.stroke()
  }
  for (let y = 62; y < VH - 40; y += 42) {
    ctx.beginPath()
    ctx.moveTo(44, y)
    ctx.lineTo(1556, y)
    ctx.stroke()
  }

  ctx.fillStyle = "rgba(218,160,0,.024)"
  ctx.fillRect(54, 110, 198, 530)
  ctx.fillRect(1348, 110, 198, 530)
  ctx.fillRect(302, 48, 996, 88)
  ctx.fillRect(302, 624, 996, 88)

  substrateRoutes.forEach((route, index) => {
    strokeRoute(
      ctx,
      route,
      index % 4 === 0 ? "rgba(218,160,0,.16)" : index % 2 === 0 ? "rgba(218,160,0,.115)" : "rgba(218,160,0,.085)",
      index % 5 === 0 ? 1.45 : 1.05
    )
  })

  drawEdgeConnector(ctx, 264, 28, 8, true, .18)
  drawEdgeConnector(ctx, 584, 28, 8, true, .18)
  drawEdgeConnector(ctx, 904, 28, 8, true, .18)
  drawEdgeConnector(ctx, 1224, 28, 8, true, .18)
  drawEdgeConnector(ctx, 264, 712, 8, true, .16)
  drawEdgeConnector(ctx, 584, 712, 8, true, .16)
  drawEdgeConnector(ctx, 904, 712, 8, true, .16)
  drawEdgeConnector(ctx, 1224, 712, 8, true, .16)

  drawControllerModule(ctx, 82, 106, 176, 108, "MCU / CTRL", "SWD  ·  3V3", .25)
  drawControllerModule(ctx, 1342, 106, 176, 108, "IO / GPIO", "SPI  ·  UART", .22)
  drawControllerModule(ctx, 82, 546, 176, 108, "PWR / REG", "3V3  ·  GND", .20)
  drawControllerModule(ctx, 1342, 546, 176, 108, "BUS / COMM", "I2C  ·  CAN", .20)

  drawSmdBank(ctx, 88, 244, 4, 3, .20)
  drawSmdBank(ctx, 1420, 244, 4, 3, .18)
  drawSmdBank(ctx, 88, 430, 4, 3, .17)
  drawSmdBank(ctx, 1420, 430, 4, 3, .17)

  drawViaCluster(ctx, 280, 92, 5, 2, 15, 14, .15)
  drawViaCluster(ctx, 1258, 92, 5, 2, 15, 14, .15)
  drawViaCluster(ctx, 280, 646, 5, 2, 15, 14, .13)
  drawViaCluster(ctx, 1258, 646, 5, 2, 15, 14, .13)
  drawViaCluster(ctx, 72, 320, 3, 5, 14, 14, .13)
  drawViaCluster(ctx, 1498, 320, 3, 5, 14, 14, .13)

  ctx.restore()

  drawMountingHole(ctx, 70, 66)
  drawMountingHole(ctx, 1530, 66)
  drawMountingHole(ctx, 70, 694)
  drawMountingHole(ctx, 1530, 694)

  drawCoreSocket(ctx, false)

  ctx.save()
  ctx.font = "9px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillStyle = "rgba(229,220,188,.18)"
  ctx.fillText("JTAG", 70, 286)
  ctx.fillText("ADC", 70, 414)
  ctx.fillText("GPIO", 1474, 286)
  ctx.fillText("PWM", 1474, 414)
  ctx.fillText("SPI0", 342, 684)
  ctx.fillText("I2C0", 1194, 684)
  ctx.fillText("CLK", 768, 76)
  ctx.fillText("ES@P / REV 01", 754, 704)
  ctx.restore()

  ctx.save()
  ctx.fillStyle = "rgba(235,228,208,.024)"
  for (let index = 0; index < 620; index++) {
    const px = (index * 83 + 29) % VW
    const py = (index * 137 + 47) % VH
    const size = index % 11 === 0 ? 1.15 : .62
    ctx.fillRect(px, py, size, size)
  }
  ctx.restore()

  const edgeFade = ctx.createRadialGradient(800, 380, 330, 800, 380, 930)
  edgeFade.addColorStop(0, "rgba(0,0,0,0)")
  edgeFade.addColorStop(.62, "rgba(0,0,0,.06)")
  edgeFade.addColorStop(.84, "rgba(0,0,0,.34)")
  edgeFade.addColorStop(1, "rgba(0,0,0,.82)")
  ctx.fillStyle = edgeFade
  ctx.fillRect(0, 0, VW, VH)
}

function renderActiveEnvironment(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, VW, VH)

  const activation = ctx.createRadialGradient(800, 380, 54, 800, 380, 610)
  activation.addColorStop(0, "rgba(218,160,0,.12)")
  activation.addColorStop(.24, "rgba(218,160,0,.085)")
  activation.addColorStop(.55, "rgba(218,160,0,.035)")
  activation.addColorStop(1, "rgba(218,160,0,0)")
  ctx.fillStyle = activation
  ctx.fillRect(0, 0, VW, VH)

  drawCoreSocket(ctx, true)

  ctx.save()
  activeRoutes.forEach((route, index) => {
    strokeRoute(
      ctx,
      route,
      index % 3 === 0 ? "rgba(218,160,0,.22)" : "rgba(218,160,0,.15)",
      index % 4 === 0 ? 1.45 : 1.1
    )
  })

  drawViaCluster(ctx, 286, 224, 3, 3, 14, 14, .20)
  drawViaCluster(ctx, 1272, 224, 3, 3, 14, 14, .20)
  drawViaCluster(ctx, 286, 502, 3, 3, 14, 14, .17)
  drawViaCluster(ctx, 1272, 502, 3, 3, 14, 14, .17)

  ctx.fillStyle = "rgba(244,198,77,.54)"
  ctx.beginPath(); ctx.arc(226, 160, 3.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(1374, 160, 3.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(226, 600, 3.2, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(1374, 600, 3.2, 0, Math.PI * 2); ctx.fill()

  ctx.strokeStyle = "rgba(218,160,0,.20)"
  ctx.lineWidth = 1.2
  const brackets = [
    [[248,180],[248,164],[264,164]],
    [[1352,180],[1352,164],[1336,164]],
    [[248,580],[248,596],[264,596]],
    [[1352,580],[1352,596],[1336,596]],
  ] as Route[]
  brackets.forEach((route) => strokeRoute(ctx, route, "rgba(218,160,0,.24)", 1.2))
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

      const wake = reducedMotion ? 1 : smoothstep((time - .04) / 1.08)
      context.save()
      context.globalAlpha = .12 + wake * .88
      context.drawImage(activeLayer, 0, 0, VW, VH)
      context.restore()
    }

    const drawPorts = (time: number) => {
      circuitSpecs.forEach((spec, index) => {
        const [x, y] = spec.port
        const activation = smoothstep((time - (circuits[index].spec.delay - .08)) / .12)

        context.beginPath()
        context.arc(x, y, 10.5, 0, Math.PI * 2)
        context.fillStyle = "rgba(5,6,4,.98)"
        context.fill()
        context.strokeStyle = `rgba(218,160,0,${.52 + activation * .32})`
        context.lineWidth = 1.5
        context.stroke()

        context.beginPath()
        context.arc(x, y, 3.6 + activation * .45, 0, Math.PI * 2)
        context.fillStyle = GOLD
        context.globalAlpha = .68 + activation * .32
        context.fill()
        context.globalAlpha = 1
      })
    }

    const drawCircuits = (time: number) => {
      circuits.forEach((circuit) => {
        const progress = clamp01((time - circuit.spec.delay) / circuit.duration)
        if (progress <= 0) return

        const settled = smoothstep((time - circuit.end) / .28)
        context.globalAlpha = 1 - settled * .58
        const head = drawPrepared(context, circuit.route, progress, GOLD, 2.45)
        context.globalAlpha = 1

        if (progress < 1) {
          context.beginPath()
          context.arc(head[0], head[1], 3, 0, Math.PI * 2)
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
        className="relative isolate h-[min(78svh,760px)] min-h-[600px] overflow-hidden border-b border-[#daa000]/25 bg-[#020302]"
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
