"use client"

import { createElement, useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
const ESP32_MODEL = "/models/esp32/esp32-38pin.glb"

type TiltPoint = {
  x: number
  y: number
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const targetRef = useRef<TiltPoint>({ x: 0, y: 0 })
  const currentRef = useRef<TiltPoint>({ x: 0, y: 0 })
  const [shouldLoadModel, setShouldLoadModel] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)
  const [modelFailed, setModelFailed] = useState(false)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    if (!("IntersectionObserver" in window)) {
      setShouldLoadModel(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadModel(true)
        observer.disconnect()
      },
      { rootMargin: "700px 0px" }
    )

    observer.observe(viewer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoadModel) return

    if (customElements.get("model-viewer")) {
      setViewerReady(true)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-esap-model-viewer="1"]'
    )

    if (existing) {
      if (customElements.get("model-viewer")) {
        setViewerReady(true)
        return
      }

      const onLoad = () => setViewerReady(true)
      const onError = () => setModelFailed(true)
      existing.addEventListener("load", onLoad, { once: true })
      existing.addEventListener("error", onError, { once: true })
      return () => {
        existing.removeEventListener("load", onLoad)
        existing.removeEventListener("error", onError)
      }
    }

    const script = document.createElement("script")
    script.type = "module"
    script.src = MODEL_VIEWER_SCRIPT
    script.dataset.esapModelViewer = "1"
    script.onload = () => setViewerReady(true)
    script.onerror = () => setModelFailed(true)
    document.head.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [shouldLoadModel])

  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const animateTilt = () => {
    const model = modelRef.current
    if (!model) {
      animationRef.current = null
      return
    }

    const current = currentRef.current
    const target = targetRef.current

    // Keep the board feeling like a rigid object: only the camera's orbit angles
    // change. Radius, FOV, model scale, and target stay fixed.
    current.x += (target.x - current.x) * 0.12
    current.y += (target.y - current.y) * 0.12

    const theta = 180 + current.x * 12
    const phi = 68 + current.y * 8
    model.setAttribute(
      "camera-orbit",
      `${theta.toFixed(3)}deg ${phi.toFixed(3)}deg 112%`
    )

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
    if (!rect.width || !rect.height) return

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(218,160,0,0.07),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,.018),transparent_24%,transparent_74%,rgba(0,0,0,.34))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:38px_38px]" />

      {shouldLoadModel && viewerReady && !modelFailed &&
        createElement("model-viewer", {
          ref: (node: HTMLElement | null) => {
            modelRef.current = node
          },
          src: ESP32_MODEL,
          alt: "ESP32 38-pin ESP-WROOM-32 development board",
          loading: "lazy",
          reveal: "auto",
          "camera-orbit": "180deg 68deg 112%",
          "field-of-view": "28deg",
          "camera-target": "auto auto auto",
          "interaction-prompt": "none",
          "environment-image": "neutral",
          exposure: "1.02",
          "shadow-intensity": "0.72",
          "shadow-softness": "0.92",
          "interpolation-decay": "180",
          onError: () => setModelFailed(true),
          style: {
            position: "absolute",
            inset: "-5% -7%",
            width: "114%",
            height: "110%",
            background: "transparent",
            pointerEvents: "none",
          },
        })}

      {shouldLoadModel && !viewerReady && !modelFailed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/20">
          Loading model
        </div>
      )}

      {modelFailed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/20">
          Model unavailable
        </div>
      )}
    </div>
  )
}
