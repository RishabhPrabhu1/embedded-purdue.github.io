"use client"

import { useEffect, useRef, useState } from "react"

export function Esp32Visual() {
  const viewerRef = useRef<HTMLDivElement>(null)
  const [shouldLoadModel, setShouldLoadModel] = useState(false)

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

  return (
    <div
      ref={viewerRef}
      className="relative h-full min-h-[390px] w-full overflow-hidden bg-[#080a09] lg:min-h-[500px]"
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(88,101,242,0.05),transparent_34%),linear-gradient(to_bottom,rgba(8,10,9,0.10),transparent_22%,transparent_76%,rgba(8,10,9,0.18))]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.028)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="pointer-events-none absolute left-5 top-5 z-20 font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#777b74] sm:left-7 sm:top-7">
        ESP32 WROOM 32
      </div>

      {shouldLoadModel && (
        <iframe
          title="Interactive ESP32 WROOM 32 3D model"
          src="https://sketchfab.com/models/af0851c326ef4cbaa42439f801acbe98/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_watermark_link=0"
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      )}

      <a
        href="https://sketchfab.com/3d-models/esp32-wroom-32-low-poly-photorealistic-af0851c326ef4cbaa42439f801acbe98"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-5 z-20 font-mono text-[0.46rem] uppercase tracking-[0.13em] text-white/30 transition-colors hover:text-white/55 sm:bottom-5 sm:left-7"
      >
        Model: wojteX · CC BY
      </a>
    </div>
  )
}
