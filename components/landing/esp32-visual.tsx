"use client"

import { useEffect, useRef, useState } from "react"

const ESP32_RENDER =
  "https://public.blenderkit.com/thumbnails/assets/c381d52284394f138f30c2ae26528708/files/thumbnail_d65b8be8-6804-4220-a0bd-e52a3b454c93.jpg.2048x2048_q85.jpg"

type TiltPoint = {
  x: number
  y: number
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const targetRef = useRef<TiltPoint>({ x: 0, y: 0 })
  const currentRef = useRef<TiltPoint>({ x: 0, y: 0 })
  const [shouldLoadRender, setShouldLoadRender] = useState(false)
  const [renderFailed, setRenderFailed] = useState(false)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    if (!("IntersectionObserver" in window)) {
      setShouldLoadRender(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadRender(true)
        observer.disconnect()
      },
      { rootMargin: "700px 0px" }
    )

    observer.observe(viewer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const animateTilt = () => {
    const card = cardRef.current
    if (!card) {
      animationRef.current = null
      return
    }

    const current = currentRef.current
    const target = targetRef.current

    current.x += (target.x - current.x) * 0.14
    current.y += (target.y - current.y) * 0.14

    const rotateY = current.x * 10.5
    const rotateX = current.y * -8.5
    const radius = Math.min(1, Math.hypot(current.x, current.y))
    const scale = 1.035 - radius * 0.012

    card.style.transform = [
      "perspective(1050px)",
      `rotateX(${rotateX.toFixed(3)}deg)`,
      `rotateY(${rotateY.toFixed(3)}deg)`,
      `translate3d(${(current.x * 5).toFixed(2)}px, ${(current.y * 4).toFixed(2)}px, 26px)`,
      `scale(${scale.toFixed(4)})`,
    ].join(" ")

    const glare = glareRef.current
    if (glare) {
      const gx = 50 + current.x * 24
      const gy = 50 + current.y * 24
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.16), rgba(244,198,77,.045) 19%, transparent 46%)`
      glare.style.opacity = String(0.34 + (1 - radius) * 0.12)
    }

    const moving =
      Math.abs(target.x - current.x) > 0.001 ||
      Math.abs(target.y - current.y) > 0.001

    if (moving) {
      animationRef.current = requestAnimationFrame(animateTilt)
    } else {
      current.x = target.x
      current.y = target.y
      animationRef.current = null
    }
  }

  const requestTiltFrame = () => {
    if (animationRef.current !== null) return
    animationRef.current = requestAnimationFrame(animateTilt)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1

    targetRef.current.x = Math.max(-1, Math.min(1, x))
    targetRef.current.y = Math.max(-1, Math.min(1, y))
    requestTiltFrame()
  }

  const handlePointerLeave = () => {
    targetRef.current.x = 0
    targetRef.current.y = 0
    requestTiltFrame()
  }

  return (
    <div
      ref={viewerRef}
      className="relative h-full min-h-[390px] w-full overflow-hidden bg-[#050606] lg:min-h-[500px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(218,160,0,0.065),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,.018),transparent_24%,transparent_74%,rgba(0,0,0,.34))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-5 sm:px-8 sm:py-7">
        <div
          ref={cardRef}
          className="relative h-[92%] w-[92%] max-w-[690px] overflow-hidden will-change-transform"
          style={{
            transform:
              "perspective(1050px) rotateX(0deg) rotateY(0deg) translate3d(0,0,26px) scale(1.035)",
            transformStyle: "preserve-3d",
            filter: "drop-shadow(0 30px 42px rgba(0,0,0,.56))",
          }}
        >
          {shouldLoadRender && !renderFailed && (
            <img
              src={ESP32_RENDER}
              alt="Detailed ESP32 development board render"
              loading="lazy"
              decoding="async"
              onError={() => setRenderFailed(true)}
              className="absolute inset-0 h-full w-full scale-[1.11] object-cover object-center"
              draggable={false}
            />
          )}

          <div
            ref={glareRef}
            className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-300"
            aria-hidden="true"
          />
        </div>
      </div>

      {!shouldLoadRender && (
        <div className="pointer-events-none absolute inset-0" />
      )}

      {renderFailed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/20">
          Visual unavailable
        </div>
      )}
    </div>
  )
}
