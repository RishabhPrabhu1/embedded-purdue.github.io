"use client"

import { useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"
const ESP32_MODEL = "/models/esp32/esp32-38pin.glb?v=5"

const MODEL_ORIENTATION = "0deg 90deg 0deg"
const BASE_THETA = 65
const BASE_PHI = 50
const CAMERA_RADIUS = 80
const FIELD_OF_VIEW = 30
const HORIZONTAL_ORBIT = 6.5
const VERTICAL_ORBIT = 4.25

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string
}

type ModelViewerConstructor = CustomElementConstructor & {
  minimumRenderScale: number
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelHostRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ModelViewerElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const hoverRef = useRef({ x: 0, y: 0 })

  const [shouldMountModel, setShouldMountModel] = useState(false)
  const [runtimeReady, setRuntimeReady] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelFailed, setModelFailed] = useState(false)

  // Start downloading the GLB while the hero animation is still running. The
  // actual WebGL scene stays deferred until this section approaches the viewport.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch(ESP32_MODEL, { cache: "force-cache" })
        .then((response) => {
          if (!response.ok) throw new Error("ESP32 preload failed")
          return response.arrayBuffer()
        })
        .catch(() => {
          // model-viewer will still make its normal request when the section mounts.
        })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    if (!("IntersectionObserver" in window)) {
      setShouldMountModel(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldMountModel(true)
        observer.disconnect()
      },
      { rootMargin: "700px 0px" }
    )

    observer.observe(viewer)
    return () => observer.disconnect()
  }, [])

  // Warm the runtime immediately, but keep the custom element outside React's
  // rendered tree to avoid Safari custom-element hydration/ref races.
  useEffect(() => {
    const markReady = () => {
      const ModelViewer = customElements.get(
        "model-viewer"
      ) as ModelViewerConstructor | undefined
      if (!ModelViewer) return false

      ModelViewer.minimumRenderScale = 1
      setRuntimeReady(true)
      return true
    }

    if (markReady()) return

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-esap-model-viewer="1"]'
    )

    if (existing) {
      const onLoad = () => {
        if (!markReady()) setModelFailed(true)
      }
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
    script.onload = () => {
      if (!markReady()) setModelFailed(true)
    }
    script.onerror = () => setModelFailed(true)
    document.head.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [])

  useEffect(() => {
    if (!runtimeReady || !shouldMountModel || modelFailed) return

    const host = modelHostRef.current
    if (!host || modelRef.current) return

    const model = document.createElement("model-viewer") as ModelViewerElement
    modelRef.current = model

    model.setAttribute("src", ESP32_MODEL)
    model.setAttribute("alt", "ESP32 38-pin ESP-WROOM-32 development board")
    model.setAttribute("loading", "eager")
    model.setAttribute("reveal", "auto")
    model.setAttribute("orientation", MODEL_ORIENTATION)
    model.setAttribute(
      "camera-orbit",
      `${BASE_THETA}deg ${BASE_PHI}deg ${CAMERA_RADIUS}%`
    )
    model.setAttribute("field-of-view", `${FIELD_OF_VIEW}deg`)
    model.setAttribute("camera-target", "auto auto auto")
    model.setAttribute("interaction-prompt", "none")
    model.setAttribute("environment-image", "neutral")
    model.setAttribute("tone-mapping", "neutral")
    model.setAttribute("exposure", "0.82")
    model.setAttribute("shadow-intensity", "0")
    model.setAttribute("interpolation-decay", "72")

    Object.assign(model.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      background: "transparent",
      pointerEvents: "none",
    })

    const handleLoad = () => {
      setModelLoaded(true)
      setModelFailed(false)
    }

    const handleError = () => {
      setModelLoaded(false)
      setModelFailed(true)
    }

    model.addEventListener("load", handleLoad)
    model.addEventListener("error", handleError)
    host.appendChild(model)

    return () => {
      model.removeEventListener("load", handleLoad)
      model.removeEventListener("error", handleError)
      if (model.parentNode === host) host.removeChild(model)
      if (modelRef.current === model) modelRef.current = null
    }
  }, [runtimeReady, shouldMountModel, modelFailed])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const queueHoverCamera = () => {
    if (frameRef.current !== null) return

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      const model = modelRef.current
      if (!model) return

      const hover = hoverRef.current
      model.cameraOrbit = `${(
        BASE_THETA -
        hover.x * HORIZONTAL_ORBIT
      ).toFixed(3)}deg ${(
        BASE_PHI +
        hover.y * VERTICAL_ORBIT
      ).toFixed(3)}deg ${CAMERA_RADIUS}%`
    })
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return

    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    hoverRef.current = {
      x: Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)
      ),
      y: Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)
      ),
    }

    queueHoverCamera()
  }

  const handlePointerLeave = () => {
    hoverRef.current = { x: 0, y: 0 }
    queueHoverCamera()
  }

  return (
    <div
      ref={viewerRef}
      className="relative h-full min-h-[390px] w-full overflow-hidden bg-[#050606] lg:min-h-[500px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(218,160,0,0.055),transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,.012),transparent_24%,transparent_74%,rgba(0,0,0,.38))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div ref={modelHostRef} className="pointer-events-none absolute inset-0" />

      {shouldMountModel && !modelLoaded && !modelFailed && (
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
