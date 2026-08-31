"use client"

import { createElement, useCallback, useEffect, useRef, useState } from "react"

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
  jumpCameraToGoal?: () => void
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
  const handleValue = (event: React.FormEvent<HTMLInputElement>) => {
    onChange(Number(event.currentTarget.value))
  }

  return (
    <label className="grid grid-cols-[72px_1fr_54px] items-center gap-2">
      <span className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-white/45">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={handleValue}
        onChange={handleValue}
        className="h-4 w-full cursor-ew-resize accent-[#daa000]"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="w-[54px] border border-white/[0.08] bg-black/50 px-1 py-0.5 text-right font-mono text-[0.5rem] tabular-nums text-[#d8c076] outline-none focus:border-[#daa000]/45"
        aria-label={`${label} numeric value`}
      />
      <span className="sr-only">{suffix}</span>
    </label>
  )
}

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ModelViewerElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const hoverRef = useRef({ x: 0, y: 0 })
  const tuningRef = useRef<TuningValues>({ ...DEFAULT_TUNING })
  const pendingOrbitRef = useRef(
    `${DEFAULT_TUNING.theta}deg ${DEFAULT_TUNING.phi}deg ${DEFAULT_TUNING.radius}%`
  )

  const [tuning, setTuning] = useState<TuningValues>({ ...DEFAULT_TUNING })
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

  // Warm the model-viewer runtime as soon as the page mounts. The actual WebGL
  // element stays deferred until the workshops section approaches the viewport.
  useEffect(() => {
    const markReady = () => {
      const ModelViewer = customElements.get(
        "model-viewer"
      ) as ModelViewerConstructor | undefined
      if (!ModelViewer) return false

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
  }, [])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const applyValuesToModel = useCallback(
    (model: ModelViewerElement, values: TuningValues, snapCamera = false) => {
      const hover = hoverRef.current

      // Use model-viewer's public properties directly. This avoids React/custom-
      // element attribute timing issues in Safari and works before or after load.
      model.orientation = `${values.modelX}deg ${values.modelY}deg ${values.modelZ}deg`
      model.fieldOfView = `${values.fov}deg`
      model.cameraOrbit = `${(
        values.theta +
        hover.x * HORIZONTAL_ORBIT
      ).toFixed(3)}deg ${(
        values.phi -
        hover.y * VERTICAL_ORBIT
      ).toFixed(3)}deg ${values.radius}%`

      if (snapCamera) model.jumpCameraToGoal?.()
    },
    []
  )

  const setModelNode = useCallback(
    (node: HTMLElement | null) => {
      const model = node as ModelViewerElement | null
      modelRef.current = model
      if (model) applyValuesToModel(model, tuningRef.current, true)
    },
    [applyValuesToModel]
  )

  const flushOrbit = () => {
    frameRef.current = null
    const model = modelRef.current
    if (!model) return
    model.cameraOrbit = pendingOrbitRef.current
  }

  const queueOrbit = (theta: number, phi: number, radius: number) => {
    pendingOrbitRef.current = `${theta.toFixed(3)}deg ${phi.toFixed(
      3
    )}deg ${radius}%`

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(flushOrbit)
    }
  }

  const applyCurrentOrbit = (values = tuningRef.current) => {
    const hover = hoverRef.current
    queueOrbit(
      values.theta + hover.x * HORIZONTAL_ORBIT,
      values.phi - hover.y * VERTICAL_ORBIT,
      values.radius
    )
  }

  const updateTuning = (key: TuningKey, value: number) => {
    if (!Number.isFinite(value)) return

    const next = { ...tuningRef.current, [key]: value }
    tuningRef.current = next
    setTuning(next)

    const model = modelRef.current
    if (model) applyValuesToModel(model, next, true)
  }

  const resetTuning = () => {
    const next = { ...DEFAULT_TUNING }
    tuningRef.current = next
    hoverRef.current = { x: 0, y: 0 }
    setTuning(next)

    const model = modelRef.current
    if (model) applyValuesToModel(model, next, true)
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

    applyCurrentOrbit()
  }

  const handlePointerLeave = () => {
    hoverRef.current = { x: 0, y: 0 }
    applyCurrentOrbit()
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

      {shouldLoadModel && viewerReady && !modelFailed &&
        createElement("model-viewer", {
          ref: setModelNode,
          src: ESP32_MODEL,
          alt: "ESP32 38-pin ESP-WROOM-32 development board",
          loading: "eager",
          reveal: "auto",
          orientation: `${DEFAULT_TUNING.modelX}deg ${DEFAULT_TUNING.modelY}deg ${DEFAULT_TUNING.modelZ}deg`,
          "camera-orbit": `${DEFAULT_TUNING.theta}deg ${DEFAULT_TUNING.phi}deg ${DEFAULT_TUNING.radius}%`,
          "field-of-view": `${DEFAULT_TUNING.fov}deg`,
          "camera-target": "auto auto auto",
          "interaction-prompt": "none",
          "environment-image": "neutral",
          "tone-mapping": "neutral",
          exposure: "0.82",
          "shadow-intensity": "0",
          "interpolation-decay": "72",
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

      <div
        className="absolute bottom-3 left-3 z-20 w-[310px] border border-white/[0.1] bg-black/75 p-3 shadow-[0_12px_36px_rgba(0,0,0,.42)] backdrop-blur-md"
        onPointerMove={(event) => event.stopPropagation()}
        onPointerLeave={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-2">
          <div>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.15em] text-[#d8c076]">
              ESP32 tuning
            </p>
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
          <TuningSlider
            label="Model X"
            value={tuning.modelX}
            min={-180}
            max={180}
            onChange={(value) => updateTuning("modelX", value)}
          />
          <TuningSlider
            label="Model Y"
            value={tuning.modelY}
            min={-180}
            max={180}
            onChange={(value) => updateTuning("modelY", value)}
          />
          <TuningSlider
            label="Model Z"
            value={tuning.modelZ}
            min={-180}
            max={180}
            onChange={(value) => updateTuning("modelZ", value)}
          />
          <div className="my-2 border-t border-white/[0.07]" />
          <TuningSlider
            label="Azimuth"
            value={tuning.theta}
            min={0}
            max={360}
            onChange={(value) => updateTuning("theta", value)}
          />
          <TuningSlider
            label="Elevation"
            value={tuning.phi}
            min={20}
            max={100}
            onChange={(value) => updateTuning("phi", value)}
          />
          <TuningSlider
            label="Distance"
            value={tuning.radius}
            min={65}
            max={130}
            suffix="%"
            onChange={(value) => updateTuning("radius", value)}
          />
          <TuningSlider
            label="FOV"
            value={tuning.fov}
            min={18}
            max={45}
            suffix="°"
            onChange={(value) => updateTuning("fov", value)}
          />
        </div>
      </div>
    </div>
  )
}
