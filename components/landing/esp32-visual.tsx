"use client"

import { createElement, useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"
const ESP32_MODEL = "/models/esp32/esp32-38pin.glb?v=2"

// The converted CAD arrives with its PCB plane standing vertically. Rotate the
// model itself onto a tabletop-like pose, then use a modest camera orbit around
// that stable baseline so the board reads horizontally with the pins below it.
const BASE_THETA = 82
const BASE_PHI = 58
const CAMERA_RADIUS = 89
const HORIZONTAL_ORBIT = 6.5
const VERTICAL_ORBIT = 4.25
const MODEL_ORIENTATION = "0deg 90deg 0deg"

type ModelViewerMaterial = {
  index: number
  pbrMetallicRoughness: {
    setMetallicFactor: (value: number) => void
    setRoughnessFactor: (value: number) => void
  }
}

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string
  model?: {
    materials: ModelViewerMaterial[]
  }
}

type ModelViewerConstructor = CustomElementConstructor & {
  minimumRenderScale: number
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ModelViewerElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const pendingOrbitRef = useRef(
    `${BASE_THETA}deg ${BASE_PHI}deg ${CAMERA_RADIUS}%`
  )
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

    const markReady = () => {
      const ModelViewer = customElements.get(
        "model-viewer"
      ) as ModelViewerConstructor | undefined
      if (!ModelViewer) return false

      // Keep full render resolution during motion. model-viewer otherwise lowers
      // its internal render scale under load, which is visible as a quality pulse.
      ModelViewer.minimumRenderScale = 1
      setViewerReady(true)
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
  }, [shouldLoadModel])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const flushOrbit = () => {
    frameRef.current = null
    const model = modelRef.current
    if (!model) return
    model.cameraOrbit = pendingOrbitRef.current
  }

  const queueOrbit = (theta: number, phi: number) => {
    pendingOrbitRef.current = `${theta.toFixed(3)}deg ${phi.toFixed(
      3
    )}deg ${CAMERA_RADIUS}%`

    // Collapse pointer bursts to one camera goal per display frame. model-viewer
    // supplies the visible damping, so the response stays direct rather than floaty.
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(flushOrbit)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return

    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const x = Math.max(
      -1,
      Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)
    )
    const y = Math.max(
      -1,
      Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)
    )

    // Keep the first visual's direct cursor-follow feel, but only orbit a few
    // degrees around the horizontal product-shot baseline.
    queueOrbit(
      BASE_THETA + x * HORIZONTAL_ORBIT,
      BASE_PHI - y * VERTICAL_ORBIT
    )
  }

  const handlePointerLeave = () => {
    queueOrbit(BASE_THETA, BASE_PHI)
  }

  const handleModelLoad = () => {
    const model = modelRef.current
    const pcbMaterial = model?.model?.materials.find(
      (material) => material.index === 1
    )
    if (!pcbMaterial) return

    // PCB solder mask is a matte dielectric, not a glossy metal. Keeping this
    // surface rough suppresses the bright specular wedges that make any residual
    // CAD tessellation/normal imperfections visible while the board is moving.
    pcbMaterial.pbrMetallicRoughness.setMetallicFactor(0.02)
    pcbMaterial.pbrMetallicRoughness.setRoughnessFactor(0.82)
  }

  return (
    <div
      ref={viewerRef}
      className="relative h-full min-h-[390px] w-full overflow-hidden bg-[#050606] lg:min-h-[500px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(218,160,0,0.075),transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,.018),transparent_24%,transparent_74%,rgba(0,0,0,.34))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.024)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.024)_1px,transparent_1px)] [background-size:38px_38px]" />

      {shouldLoadModel && viewerReady && !modelFailed &&
        createElement("model-viewer", {
          ref: (node: HTMLElement | null) => {
            modelRef.current = node as ModelViewerElement | null
          },
          src: ESP32_MODEL,
          alt: "ESP32 38-pin ESP-WROOM-32 development board",
          loading: "lazy",
          reveal: "auto",
          orientation: MODEL_ORIENTATION,
          "camera-orbit": `${BASE_THETA}deg ${BASE_PHI}deg ${CAMERA_RADIUS}%`,
          "field-of-view": "30deg",
          "camera-target": "auto auto auto",
          "interaction-prompt": "none",
          "environment-image": "neutral",
          "tone-mapping": "agx",
          exposure: "1.1",
          "shadow-intensity": "0",
          "interpolation-decay": "72",
          onLoad: handleModelLoad,
          onError: () => setModelFailed(true),
          style: {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
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
