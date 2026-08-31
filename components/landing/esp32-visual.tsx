"use client"

import { useEffect, useState, type PointerEvent } from "react"

const pins = Array.from({ length: 15 })
const passives = [
  [31, 26], [38, 31], [45, 25], [54, 32], [64, 25], [72, 31],
  [29, 66], [38, 72], [47, 67], [58, 73], [68, 66], [76, 72],
] as const

export function Esp32Visual() {
  const [tilt, setTilt] = useState({ x: -7, y: 12 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -7 - y * 13, y: 12 + x * 18 })
  }

  const resetTilt = () => setTilt({ x: -7, y: 12 })

  return (
    <div
      className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-[#080a09] lg:min-h-[500px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      aria-label="Interactive ESP32 development board visual"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(88,101,242,0.09),transparent_28%),radial-gradient(circle_at_50%_58%,rgba(218,160,0,0.08),transparent_42%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div className="absolute left-5 top-5 font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#666a64] sm:left-7 sm:top-7">
        ESP32 · Wi-Fi / BLE MCU
      </div>
      <div className="absolute bottom-5 right-5 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#525650] sm:bottom-7 sm:right-7">
        Move pointer to inspect
      </div>

      <div className="relative h-[330px] w-[430px] max-w-[88%] [perspective:1100px] sm:h-[365px] sm:w-[500px]">
        <div
          className="absolute left-1/2 top-1/2 h-[245px] w-[350px] max-w-[76vw] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out [transform-style:preserve-3d] sm:h-[275px] sm:w-[390px]"
          style={{
            transform: `translate(-50%, -50%) perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(-2deg)`,
          }}
        >
          <div className="absolute inset-0 translate-x-[9px] translate-y-[12px] rounded-[18px] bg-[#031f1c] shadow-[0_34px_55px_rgba(0,0,0,.55)] [transform:translateZ(-14px)]" />
          <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-[#3c7168]/60 bg-[#0a4a43] shadow-[inset_0_0_45px_rgba(0,0,0,.36)] [transform:translateZ(0)]">
            <div className="absolute inset-[14px] rounded-[12px] border border-white/[0.035]" />

            {pins.map((_, index) => {
              const top = `${7 + index * 6.15}%`
              return (
                <div key={`left-${index}`} className="absolute left-[3.5%] h-[3px] w-[18px] -translate-y-1/2 bg-[#caa64d] shadow-[0_0_5px_rgba(202,166,77,.28)]" style={{ top }} />
              )
            })}
            {pins.map((_, index) => {
              const top = `${7 + index * 6.15}%`
              return (
                <div key={`right-${index}`} className="absolute right-[3.5%] h-[3px] w-[18px] -translate-y-1/2 bg-[#caa64d] shadow-[0_0_5px_rgba(202,166,77,.28)]" style={{ top }} />
              )
            })}

            <div className="absolute left-[20%] top-[9%] h-[42%] w-[60%] border border-[#ddd9ce]/55 bg-gradient-to-br from-[#b7b5ad] via-[#e0ddd4] to-[#8d8c87] shadow-[0_7px_16px_rgba(0,0,0,.32)]">
              <div className="absolute inset-[7px] border border-black/12" />
              <div className="absolute bottom-3 left-4 font-mono text-[0.7rem] font-semibold tracking-[0.12em] text-black/65 sm:text-[0.76rem]">ESP32</div>
              <div className="absolute right-3 top-3 font-mono text-[0.42rem] uppercase tracking-[0.14em] text-black/45">RF module</div>
              <div className="absolute left-[14%] right-[14%] top-[14%] h-[30%] opacity-55 [background-image:repeating-linear-gradient(90deg,transparent_0_7px,rgba(20,20,20,.48)_7px_9px)]" />
            </div>

            <div className="absolute left-[38%] top-[57%] h-[24%] w-[24%] border border-black/65 bg-[#111615] shadow-[0_5px_12px_rgba(0,0,0,.4)]">
              <div className="absolute inset-[18%] border border-white/[0.08]" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono text-[0.42rem] uppercase tracking-[0.11em] text-white/35">MCU</div>
            </div>

            <div className="absolute bottom-[-2%] left-1/2 h-[14%] w-[22%] -translate-x-1/2 rounded-t-[5px] border border-[#6d706e] bg-gradient-to-b from-[#a8aaa7] to-[#555957] shadow-[0_-3px_10px_rgba(0,0,0,.28)]">
              <div className="absolute bottom-0 left-[18%] right-[18%] top-[27%] rounded-t-[3px] bg-[#171a19]" />
            </div>

            <div className="absolute bottom-[8%] left-[20%] h-3 w-3 rounded-full border border-[#8d887b] bg-[#272a27]" />
            <div className="absolute bottom-[8%] right-[20%] h-3 w-3 rounded-full border border-[#8d887b] bg-[#272a27]" />
            <div className="absolute bottom-[17%] right-[23%] h-2 w-2 rounded-full bg-[#f3bd38] shadow-[0_0_7px_rgba(243,189,56,.85),0_0_18px_rgba(243,189,56,.28)] motion-safe:animate-pulse" />

            {passives.map(([left, top], index) => (
              <div
                key={`${left}-${top}`}
                className={`absolute h-[5px] w-[11px] ${index % 3 === 0 ? "bg-[#b8a16b]" : "bg-[#202725]"}`}
                style={{ left: `${left}%`, top: `${top}%` }}
              />
            ))}

            <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 390 275" preserveAspectRatio="none" aria-hidden="true">
              <path d="M54 220 H116 V176 H145" fill="none" stroke="#d6ad43" strokeWidth="1" />
              <path d="M336 218 H282 V176 H246" fill="none" stroke="#d6ad43" strokeWidth="1" />
              <path d="M54 198 H100 V153 H145" fill="none" stroke="#7eb6aa" strokeWidth="1" />
              <path d="M336 194 H296 V151 H246" fill="none" stroke="#7eb6aa" strokeWidth="1" />
              <path d="M92 72 H58 V118 H35" fill="none" stroke="#d6ad43" strokeWidth="1" />
              <path d="M298 72 H333 V118 H356" fill="none" stroke="#d6ad43" strokeWidth="1" />
              <circle cx="116" cy="176" r="2.5" fill="#e0b94e" />
              <circle cx="282" cy="176" r="2.5" fill="#e0b94e" />
              <circle cx="100" cy="153" r="2.5" fill="#72b3a6" />
              <circle cx="296" cy="151" r="2.5" fill="#72b3a6" />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-gradient-to-br from-white/[0.06] via-transparent to-black/20 [transform:translateZ(8px)]" />
        </div>
      </div>
    </div>
  )
}
