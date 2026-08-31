"use client"

import { useEffect, useRef, useState } from "react"

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"
const ESP32_MODEL = "/models/esp32/esp32-38pin.glb?v=5"

const HORIZONTAL_ORBIT = 6.5
const VERTICAL_ORBIT = 4.25

const DEFAULT_TUNING = {
  modelX: 0,
  modelY: 90,
  modelZ: 0,
  theta: 82,
  phi: 58,
  radius: 89,
  fov: 30,
}

type TuningValues = typeof DEFAULT_TUNING
type TuningKey = keyof TuningValues

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string
  orientation: string
  fieldOfView: string
  loaded?: boolean
  jumpCameraToGoal?: () => void
  updateFraming?: () => Promise<void>
}

type ModelViewerConstructor = CustomElementConstructor & {
  minimumRenderScale: number
}

type TuningSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}

function TuningSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "°",
  onChange,
}: TuningSliderProps) {
  return (
    <label className="grid grid-cols-[72px_1fr_58px] items-center gap-2">
      <span className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-white/45">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="h-4 w-full cursor-ew-resize accent-[#daa000]"
      />
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          className="w-full border border-white/[0.08] bg-black/50 py-0.5 pl-1 pr-3 text-right font-mono text-[0.5rem] tabular-nums text-[#d8c076] outline-none focus:border-[#daa000]/45"
          aria-label={`${label} numeric value`}
        />
        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[0.42rem] text-white/25">
          {suffix}
        </span>
      </div>
    </label>
  )
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelHostRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ModelViewerElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const hoverRef = useRef({ x: 0, y: 0 })
  const tuningRef = useRef<TuningValues>({ ...DEFAULT_TUNING })

  const [tuning, setTuning] = useState<TuningValues>({ ...DEFAULT_TUNING })
  const [shouldMountModel, setShouldMountModel] = useState(false)
  const [runtimeReady, setRuntimeReady] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelFailed, setModelFailed] = useState(false)

  // Begin downloading the GLB while the hero animation is still playing. The
  // actual WebGL viewer remains deferred until this section approaches view.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch(ESP32_MODEL, { cache: "force-cache" }).catch(() => {})
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

  // Warm the model-viewer runtime immediately. Keeping the custom element out of
  // React's rendered tree avoids Safari custom-element hydration/ref races.
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

  const cameraOrbitFor = (values: TuningValues) => {
    const hover = hoverRef.current
    return `${(values.theta + hover.x * HORIZONTAL_ORBIT).toFixed(3)}deg ${(
      values.phi -
      hover.y * VERTICAL_ORBIT
    ).toFixed(3)}deg ${values.radius}%`
  }

  const applyCamera = (
    model: ModelViewerElement,
    values: TuningValues,
    snap = false
  ) => {
    const orbit = cameraOrbitFor(values)
    const fov = `${values.fov}deg`

    // Set both the public property and reflected attribute. Doing this outside
    // React makes the tuner deterministic across Safari/Chrome.
    model.cameraOrbit = orbit
    model.fieldOfView = fov
    model.setAttribute("camera-orbit", orbit)
    model.setAttribute("field-of-view", fov)

    if (snap) model.jumpCameraToGoal?.()
  }

  const applyOrientation = (
    model: ModelViewerElement,
    values: TuningValues,
    snap = false
  ) => {
    const orientation = `${values.modelX}deg ${values.modelY}deg ${values.modelZ}deg`
    model.orientation = orientation
    model.setAttribute("orientation", orientation)

    // Recalculate framing after changing the model transform, then restore the
    // camera values selected by the tuner.
    const framing = model.updateFraming?.()
    if (framing) {
      void framing.then(() => {
        if (modelRef.current !== model) return
        applyCamera(model, tuningRef.current, snap)
      })
    } else {
      applyCamera(model, values, snap)
    }
  }

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
    model.setAttribute(
      "orientation",
      `${DEFAULT_TUNING.modelX}deg ${DEFAULT_TUNING.modelY}deg ${DEFAULT_TUNING.modelZ}deg`
    )
    model.setAttribute(
      "camera-orbit",
      `${DEFAULT_TUNING.theta}deg ${DEFAULT_TUNING.phi}deg ${DEFAULT_TUNING.radius}%`
    )
    model.setAttribute("field-of-view", `${DEFAULT_TUNING.fov}deg`)
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
      applyOrientation(model, tuningRef.current, true)
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
      applyCamera(model, tuningRef.current)
    })
  }

  const updateTuning = (key: TuningKey, value: number) => {
    if (!Number.isFinite(value)) return

    const next = { ...tuningRef.current, [key]: value }
    tuningRef.current = next
    setTuning(next)

    const model = modelRef.current
    if (!model || !modelLoaded) return

    if (key === "modelX" || key === "modelY" || key === "modelZ") {
      applyOrientation(model, next, true)
    } else {
      applyCamera(model, next, true)
    }
  }

  const resetTuning = () => {
    const next = { ...DEFAULT_TUNING }
    tuningRef.current = next
    hoverRef.current = { x: 0, y: 0 }
    setTuning(next)

    const model = modelRef.current
    if (model && modelLoaded) applyOrientation(model, next, true)
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

      <div
        className="absolute bottom-3 left-3 z-20 w-[318px] border border-white/[0.1] bg-black/75 p-3 shadow-[0_12px_36px_rgba(0,0,0,.42)] backdrop-blur-md"
        onPointerMove={(event) => event.stopPropagation()}
        onPointerLeave={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-[#d8c076]">
                ESP32 tuning
              </p>
              <span
                className={`font-mono text-[0.42rem] uppercase tracking-[0.12em] ${
                  modelLoaded ? "text-emerald-400/70" : "text-white/25"
                }`}
              >
                {modelLoaded ? "Ready" : "Loading"}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[0.43rem] uppercase tracking-[0.1em] text-white/25">
              Screenshot these values
            </p>
          </div>
          <button
            type="button"
            onClick={resetTuning}
            className="border border-white/[0.1] px-2 py-1 font-mono text-[0.45rem] uppercase tracking-[0.12em] text-white/45 transition-colors hover:border-[#daa000]/50 hover:text-[#d8c076]"
          >
            Reset
          </button>
        </div>

        <div className="space-y-1.5">
          <TuningSlider label="Model X" value={tuning.modelX} min={-180} max={180} onChange={(value) => updateTuning("modelX", value)} />
          <TuningSlider label="Model Y" value={tuning.modelY} min={-180} max={180} onChange={(value) => updateTuning("modelY", value)} />
          <TuningSlider label="Model Z" value={tuning.modelZ} min={-180} max={180} onChange={(value) => updateTuning("modelZ", value)} />
          <div className="my-2 border-t border-white/[0.07]" />
          <TuningSlider label="Azimuth" value={tuning.theta} min={0} max={360} onChange={(value) => updateTuning("theta", value)} />
          <TuningSlider label="Elevation" value={tuning.phi} min={20} max={100} onChange={(value) => updateTuning("phi", value)} />
          <TuningSlider label="Distance" value={tuning.radius} min={65} max={130} suffix="%" onChange={(value) => updateTuning("radius", value)} />
          <TuningSlider label="FOV" value={tuning.fov} min={18} max={45} onChange={(value) => updateTuning("fov", value)} />
        </div>
      </div>
    </div>
  )
}
