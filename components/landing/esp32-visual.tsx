"use client"

import { createElement, useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
const ESP32_MODEL =
  "https://www.espressif.com/sites/default/files/3dmodel/ESP32-WROOM-32E_20210903.glb"

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLElement | null>(null)
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
      const onLoad = () => setViewerReady(true)
      existing.addEventListener("load", onLoad, { once: true })
      return () => existing.removeEventListener("load", onLoad)
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

  const setHover = (hovered: boolean) => {
    const model = modelRef.current
    if (!model) return

    model.setAttribute(
      "camera-orbit",
      hovered ? "32deg 63deg 118%" : "18deg 68deg 124%"
    )
    model.setAttribute("field-of-view", hovered ? "26deg" : "29deg")
  }

  return (
    <div
      ref={viewerRef}
      className="relative h-full min-h-[390px] w-full overflow-hidden bg-[#080a09] lg:min-h-[500px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_45%,rgba(218,160,0,0.07),transparent_32%),linear-gradient(to_bottom,rgba(8,10,9,0.02),transparent_72%,rgba(8,10,9,0.28))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="pointer-events-none absolute left-5 top-5 z-20 font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#777b74] sm:left-7 sm:top-7">
        ESP32-WROOM-32E
      </div>

      {shouldLoadModel && viewerReady && !modelFailed &&
        createElement("model-viewer", {
          ref: (node: HTMLElement | null) => {
            modelRef.current = node
          },
          src: ESP32_MODEL,
          alt: "ESP32-WROOM-32E 3D model",
          loading: "lazy",
          reveal: "auto",
          "camera-orbit": "18deg 68deg 124%",
          "field-of-view": "29deg",
          "interaction-prompt": "none",
          "environment-image": "neutral",
          exposure: "0.95",
          "shadow-intensity": "0.55",
          "shadow-softness": "0.95",
          "interpolation-decay": "110",
          onError: () => setModelFailed(true),
          style: {
            position: "absolute",
            inset: "2% -4% -2% -4%",
            width: "108%",
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

      <a
        href="https://www.espressif.com/en/products/modules/esp32-wroom-32"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-5 z-20 font-mono text-[0.46rem] uppercase tracking-[0.13em] text-white/30 transition-colors hover:text-white/55 sm:bottom-5 sm:left-7"
      >
        Official Espressif model
      </a>
    </div>
  )
}
