"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const VW = 1600
const VH = 720
const GOLD = "#daa000"
const BRIGHT = "#f5c94f"
const LOGO = { x: 270, y: 248, width: 1060, height: 338 }
const FEED_SPEED = 980
const BUILD_SPEED = 1120

const routePoints = [
  [[42, 160], [125, 160], [125, 235], [205, 235], [205, 333], [270, 333]],
  [[42, 355], [115, 355], [115, 415], [205, 415], [205, 426], [270, 426]],
  [[42, 590], [130, 590], [130, 545], [215, 545], [215, 518], [270, 518]],
  [[1558, 160], [1475, 160], [1475, 235], [1395, 235], [1395, 333], [1330, 333]],
  [[1558, 355], [1485, 355], [1485, 415], [1395, 415], [1395, 426], [1330, 426]],
  [[1558, 590], [1470, 590], [1470, 545], [1385, 545], [1385, 518], [1330, 518]],
  [[390, 42], [390, 120], [470, 120], [470, 190], [490, 190], [490, 248]],
  [[800, 42], [800, 125], [800, 180], [800, 248]],
  [[1210, 42], [1210, 120], [1130, 120], [1130, 190], [1110, 190], [1110, 248]],
  [[420, 678], [420, 620], [500, 620], [500, 586]],
  [[800, 678], [800, 620], [800, 586]],
  [[1180, 678], [1180, 620], [1100, 620], [1100, 586]],
] as const

const buildPoints = [
  [[0, 85], [145, 85], [145, 55], [330, 55], [330, 105], [535, 105], [535, 75], [760, 75], [760, 120], [1060, 120]],
  [[0, 178], [120, 178], [120, 145], [300, 145], [300, 205], [515, 205], [515, 165], [740, 165], [740, 215], [1060, 215]],
  [[0, 270], [150, 270], [150, 235], [340, 235], [340, 300], [560, 300], [560, 250], [810, 250], [810, 285], [1060, 285]],
  [[1060, 85], [910, 85], [910, 50], [720, 50], [720, 110], [505, 110], [505, 70], [280, 70], [280, 120], [0, 120]],
  [[1060, 178], [935, 178], [935, 145], [755, 145], [755, 205], [535, 205], [535, 165], [300, 165], [300, 215], [0, 215]],
  [[1060, 270], [900, 270], [900, 235], [710, 235], [710, 300], [490, 300], [490, 250], [245, 250], [245, 285], [0, 285]],
  [[220, 0], [220, 70], [265, 70], [265, 155], [315, 155], [315, 245], [365, 245], [365, 338]],
  [[530, 0], [530, 75], [575, 75], [575, 165], [620, 165], [620, 250], [665, 250], [665, 338]],
  [[840, 0], [840, 70], [795, 70], [795, 155], [750, 155], [750, 245], [705, 245], [705, 338]],
  [[230, 338], [230, 270], [280, 270], [280, 190], [330, 190], [330, 105], [380, 105], [380, 0]],
  [[530, 338], [530, 270], [575, 270], [575, 185], [620, 185], [620, 95], [665, 95], [665, 0]],
  [[830, 338], [830, 270], [785, 270], [785, 190], [740, 190], [740, 105], [695, 105], [695, 0]],
] as const

type Point = readonly [number, number]
type Route = readonly Point[]

function lengthOf(points: Route) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  }
  return total
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function smoothstep(value: number) {
  const x = clamp01(value)
  return x * x * (3 - 2 * x)
}

function drawProgress(
  ctx: CanvasRenderingContext2D,
  points: Route,
  progress: number,
  stroke: string,
  width: number,
) {
  if (progress <= 0) return points[0]

  const total = lengthOf(points)
  let remaining = total * clamp01(progress)
  let head = points[0]

  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])

  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const segment = Math.hypot(x1 - x0, y1 - y0)

    if (remaining >= segment) {
      ctx.lineTo(x1, y1)
      remaining -= segment
      head = points[i]
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

const feeders = routePoints.map((points, index) => {
  const delay = 0.12 + index * 0.045
  const duration = lengthOf(points) / FEED_SPEED
  return { points, delay, duration, arrival: delay + duration }
})

const builds = buildPoints.map((points, index) => ({
  points,
  start: feeders[index].arrival - 0.025,
  duration: lengthOf(points) / BUILD_SPEED,
}))

const ANIMATION_END = Math.max(...builds.map((build) => build.start + build.duration)) + 0.16

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
    let logoImage: HTMLImageElement | null = null
    let logoMask: HTMLCanvasElement | null = null
    let buildLayer: HTMLCanvasElement | null = null
    let buildContext: CanvasRenderingContext2D | null = null
    let maskContext: CanvasRenderingContext2D | null = null
    let dpr = 1
    let cssWidth = 1
    let cssHeight = 1

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const prepareBuffers = () => {
      logoMask = document.createElement("canvas")
      buildLayer = document.createElement("canvas")
      logoMask.width = LOGO.width
      logoMask.height = LOGO.height
      buildLayer.width = LOGO.width
      buildLayer.height = LOGO.height
      maskContext = logoMask.getContext("2d")
      buildContext = buildLayer.getContext("2d")

      if (maskContext && logoImage) {
        maskContext.clearRect(0, 0, LOGO.width, LOGO.height)
        maskContext.drawImage(logoImage, 0, 0, LOGO.width, LOGO.height)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      cssWidth = Math.max(1, rect.width)
      cssHeight = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      if (complete) draw(ANIMATION_END)
    }

    const drawPorts = (ctx: CanvasRenderingContext2D, time: number) => {
      routePoints.forEach((route, index) => {
        const [x, y] = route[0]
        const active = smoothstep((time - (feeders[index].delay - 0.12)) / 0.18)

        ctx.beginPath()
        ctx.arc(x, y, 11, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(15,15,15,.96)"
        ctx.fill()
        ctx.strokeStyle = `rgba(218,160,0,${0.42 + active * 0.4})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 3.8 + active * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = GOLD
        ctx.globalAlpha = 0.58 + active * 0.42
        ctx.fill()
        ctx.globalAlpha = 1
      })
    }

    const drawLogoBuild = (time: number) => {
      if (!buildLayer || !buildContext || !logoMask || !maskContext) return

      buildContext.clearRect(0, 0, LOGO.width, LOGO.height)
      buildContext.lineCap = "round"
      buildContext.lineJoin = "round"

      builds.forEach((build) => {
        const progress = clamp01((time - build.start) / build.duration)
        drawProgress(buildContext!, build.points, progress, GOLD, 54)
      })

      buildContext.globalCompositeOperation = "destination-in"
      buildContext.drawImage(logoMask, 0, 0)
      buildContext.globalCompositeOperation = "source-over"

      context.drawImage(buildLayer, LOGO.x, LOGO.y, LOGO.width, LOGO.height)

      const finalStart = ANIMATION_END - 0.20
      const polish = smoothstep((time - finalStart) / 0.20)
      if (polish > 0) {
        context.save()
        context.globalAlpha = polish * 0.72
        context.drawImage(logoMask, LOGO.x, LOGO.y, LOGO.width, LOGO.height)
        context.restore()
      }
    }

    const draw = (time: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, cssWidth, cssHeight)

      const sx = cssWidth / VW
      const sy = cssHeight / VH
      context.save()
      context.scale(sx, sy)

      drawPorts(context, time)

      feeders.forEach((feeder, index) => {
        const progress = clamp01((time - feeder.delay) / feeder.duration)
        if (progress <= 0) return

        drawProgress(context, feeder.points, progress, "rgba(218,160,0,.92)", 2.15)

        if (progress > 0 && progress < 1) {
          const head = drawProgress(context, feeder.points, progress, BRIGHT, 2.65)
          context.beginPath()
          context.arc(head[0], head[1], 3.2, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.fill()
        }

        const build = builds[index]
        const buildProgress = clamp01((time - build.start) / build.duration)
        if (buildProgress > 0 && buildProgress < 1) {
          const [anchorX, anchorY] = feeder.points[feeder.points.length - 1]
          context.beginPath()
          context.arc(anchorX, anchorY, 3.4, 0, Math.PI * 2)
          context.fillStyle = BRIGHT
          context.globalAlpha = 0.45 + 0.55 * (1 - buildProgress)
          context.fill()
          context.globalAlpha = 1
        }
      })

      drawLogoBuild(time)
      context.restore()
    }

    const tick = (now: number) => {
      if (cancelled) return
      if (!startTime) startTime = now
      const elapsed = reducedMotion ? ANIMATION_END : (now - startTime) / 1000
      draw(elapsed)

      if (elapsed >= ANIMATION_END) {
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
      prepareBuffers()
      resize()
      if (reducedMotion) {
        draw(ANIMATION_END)
        complete = true
        setCopyVisible(true)
      } else {
        frame = requestAnimationFrame(tick)
      }
    }
    image.src = "/logo.svg"

    window.addEventListener("resize", resize, { passive: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(218,160,0,0.06),transparent_38%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-12 text-center">
        <div className="relative h-[min(70svh,700px)] min-h-[500px] w-full sm:min-h-[540px]" aria-hidden="true">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        </div>

        <div
          className={`-mt-10 flex max-w-3xl flex-col items-center px-5 transition-all duration-500 sm:px-8 ${
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
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                Join ES@P
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 border-primary/30 bg-background/70 px-6" asChild>
              <Link href="/projects">
                Explore projects <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <a
          href="#landing-content"
          className={`absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-opacity duration-500 hover:text-primary ${
            copyVisible ? "opacity-80" : "opacity-0"
          }`}
          aria-label="Scroll to explore Embedded Systems at Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
