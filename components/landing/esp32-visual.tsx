"use client"

import { createElement, useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
const ESP32_MODEL = "https://boardrepo.com/api/files/301447c7-a16e-46fe-a5d6-aa1ca0165007"

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLElement | null>(null)
  const [shouldLoadModel, setShouldLoadModel] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)

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
      `script[data-esap-model-viewer="1"]`
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
    document.head.appendChild(script)

    return () => {
      script.onload = null
    }
  }, [shouldLoadModel])

  const moveModel = (hovered: boolean) => {
    const model = modelRef.current
    if (!model) return

    model.setAttribute(
      "camera-orbit",
      hovered ? "34deg 64deg 108%" : "18deg 68deg 112%"
    )
    model.setAttribute("field-of-view", hovered ? "27deg" : "30deg")
  }

  return (
    <div
      ref={viewerRef}
      className="group relative h-full min-h-[390px] w-full overflow-hidden bg-[#080a09] lg:min-h-[500px]"
      onMouseEnter={() => moveModel(true)}
      onMouseLeave={() => moveModel(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_44%,rgba(218,160,0,0.075),transparent_31%),linear-gradient(to_bottom,rgba(8,10,9,0.02),transparent_72%,rgba(8,10,9,0.32))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="pointer-events-none absolute left-5 top-5 z-20 font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#777b74] sm:left-7 sm:top-7">
        ESP32 DevKit
      </div>

      {shouldLoadModel && viewerReady &&
        createElement("model-viewer", {
          ref: (node: HTMLElement | null) => {
            modelRef.current = node
          },
          src: ESP32_MODEL,
          alt: "ESP32 DevKit 3D model",
          loading: "lazy",
          reveal: "auto",
          "camera-orbit": "18deg 68deg 112%",
          "field-of-view": "30deg",
          "interaction-prompt": "none",
          "environment-image": "neutral",
          exposure: "0.92",
          "shadow-intensity": "0.7",
          "shadow-softness": "0.9",
          "interpolation-decay": "110",
          style: {
            position: "absolute",
            inset: "3% -5% -3% -5%",
            width: "110%",
            height: "100%",
            background: "transparent",
            transition: "filter 280ms cubic-bezier(.22,1,.36,1)",
          },
        })}

      {!viewerReady && shouldLoadModel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.52rem] uppercase tracking-[0.16em] text-white/25">
          Loading model
        </div>
      )}

      <a
        href="https://boardrepo.com/moucha19/esp32-devkit-type-c"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-5 z-20 font-mono text-[0.46rem] uppercase tracking-[0.13em] text-white/30 transition-colors hover:text-white/55 sm:bottom-5 sm:left-7"
      >
        Model: moucha19 · MIT
      </a>
    </div>
  )
}
