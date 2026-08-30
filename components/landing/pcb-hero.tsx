import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const LOGO = { x: 270, y: 300, width: 1060, height: 338 }

const traces = [
  "M0 170 H105 V225 H185 V350 H270",
  "M0 315 H95 V385 H175 V410 H270",
  "M0 505 H115 V470 H205 V495 H270",
  "M0 710 H100 V625 H190 V585 H270",
  "M1600 175 H1490 V230 H1410 V350 H1330",
  "M1600 320 H1500 V390 H1420 V415 H1330",
  "M1600 515 H1485 V475 H1395 V500 H1330",
  "M1600 715 H1505 V630 H1415 V585 H1330",
  "M250 0 V105 H365 V185 H455 V300",
  "M610 0 V115 H650 V205 H650 V300",
  "M990 0 V105 H950 V205 H950 V300",
  "M1350 0 V105 H1235 V180 H1145 V300",
  "M245 900 V790 H355 V720 H500 V638",
  "M615 900 V800 H675 V720 H675 V638",
  "M990 900 V790 H930 V720 H930 V638",
  "M1355 900 V790 H1245 V720 H1100 V638",
]

const ports = [
  [0, 170], [0, 315], [0, 505], [0, 710],
  [1600, 175], [1600, 320], [1600, 515], [1600, 715],
  [250, 0], [610, 0], [990, 0], [1350, 0],
  [245, 900], [615, 900], [990, 900], [1355, 900],
]

const vias = [
  [105, 225], [185, 350], [95, 385], [205, 495],
  [1490, 230], [1420, 415], [1485, 475], [1415, 585],
  [365, 185], [650, 205], [950, 205], [1235, 180],
  [355, 720], [675, 720], [930, 720], [1245, 720],
]

const ingress = [
  [270, 350], [270, 410], [270, 495], [270, 585],
  [1330, 350], [1330, 415], [1330, 500], [1330, 585],
  [455, 300], [650, 300], [950, 300], [1145, 300],
  [500, 638], [675, 638], [930, 638], [1100, 638],
]

const logoChannels = [
  "M270 350 H390 V385 H555 V360 H720 V405 H880",
  "M270 410 H410 V445 H585 V420 H780 V450 H985",
  "M270 495 H395 V470 H570 V510 H760 V485 H1030",
  "M270 585 H430 V545 H620 V575 H825 V535 H1090",
  "M1330 350 H1210 V385 H1050 V355 H890 V405 H735",
  "M1330 415 H1190 V450 H1020 V420 H835 V455 H650",
  "M1330 500 H1205 V475 H1045 V515 H855 V485 H665",
  "M1330 585 H1170 V545 H990 V580 H790 V535 H610",
  "M455 300 V365 H505 V455 H565 V555",
  "M650 300 V390 H700 V500 H760 V610",
  "M950 300 V390 H900 V500 H845 V610",
  "M1145 300 V365 H1095 V455 H1035 V555",
  "M500 638 V575 H555 V500 H610 V405",
  "M675 638 V565 H725 V475 H785 V360",
  "M930 638 V565 H880 V475 H820 V360",
  "M1100 638 V575 H1045 V500 H990 V405",
]

export function PcbHero() {
  return (
    <section className="pcb-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <div className="pcb-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pcb-hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-14 pt-5 text-center">
        <div className="pcb-circuit-stage relative w-full" aria-hidden="true">
          <div className="pcb-logo-halo pointer-events-none absolute left-1/2 top-1/2 h-[34%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="pcbGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="pcbStrongGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="logoMaskWhite" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
                />
              </filter>

              <mask id="logoShapeMask" maskUnits="userSpaceOnUse" x={LOGO.x} y={LOGO.y} width={LOGO.width} height={LOGO.height}>
                <rect x={LOGO.x} y={LOGO.y} width={LOGO.width} height={LOGO.height} fill="black" />
                <image
                  href="/logo.svg"
                  x={LOGO.x}
                  y={LOGO.y}
                  width={LOGO.width}
                  height={LOGO.height}
                  preserveAspectRatio="xMidYMid meet"
                  filter="url(#logoMaskWhite)"
                />
              </mask>

              <mask id="logoBuildMask" maskUnits="userSpaceOnUse" x={LOGO.x} y={LOGO.y} width={LOGO.width} height={LOGO.height}>
                <rect x={LOGO.x} y={LOGO.y} width={LOGO.width} height={LOGO.height} fill="black" />
                {logoChannels.map((d, index) => (
                  <path
                    key={`mask-${d}`}
                    d={d}
                    pathLength="1"
                    className="pcb-logo-mask-channel"
                    style={{ animationDelay: `${1180 + index * 42}ms` }}
                  />
                ))}
                <rect
                  x={LOGO.x}
                  y={LOGO.y}
                  width={LOGO.width}
                  height={LOGO.height}
                  className="pcb-logo-mask-fill"
                />
              </mask>
            </defs>

            <rect
              x={LOGO.x - 18}
              y={LOGO.y - 18}
              width={LOGO.width + 36}
              height={LOGO.height + 36}
              rx="38"
              className="pcb-logo-board-shadow"
            />

            {traces.map((d, index) => (
              <g key={d}>
                <path d={d} className="pcb-trace-base" />
                <path
                  d={d}
                  pathLength="1"
                  className="pcb-trace-energy"
                  style={{ animationDelay: `${220 + index * 38}ms` }}
                />
                {index % 3 === 0 && (
                  <path
                    d={d}
                    pathLength="1"
                    className="pcb-trace-packet"
                    style={{ animationDelay: `${3450 + index * 170}ms` }}
                  />
                )}
              </g>
            ))}

            {vias.map(([cx, cy], index) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="8" className="pcb-via-ring" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.2"
                  className="pcb-via-core"
                  style={{ animationDelay: `${620 + index * 30}ms` }}
                />
              </g>
            ))}

            {ports.map(([cx, cy], index) => (
              <g key={`${cx}-${cy}`} filter="url(#pcbGlow)">
                <circle cx={cx} cy={cy} r="15" className="pcb-port-ring" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="5.5"
                  className="pcb-port-core"
                  style={{ animationDelay: `${40 + index * 32}ms` }}
                />
              </g>
            ))}

            {ingress.map(([cx, cy], index) => (
              <g key={`ingress-${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="8.5" className="pcb-ingress-ring" />
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.4"
                  className="pcb-ingress-core"
                  style={{ animationDelay: `${980 + index * 34}ms` }}
                />
              </g>
            ))}

            <image
              href="/logo.svg"
              x={LOGO.x}
              y={LOGO.y}
              width={LOGO.width}
              height={LOGO.height}
              preserveAspectRatio="xMidYMid meet"
              mask="url(#logoBuildMask)"
              className="pcb-logo-built"
            />

            <g mask="url(#logoShapeMask)" filter="url(#pcbStrongGlow)">
              {logoChannels.map((d, index) => (
                <path
                  key={`current-${d}`}
                  d={d}
                  pathLength="1"
                  className="pcb-logo-current"
                  style={{ animationDelay: `${1110 + index * 42}ms` }}
                />
              ))}
            </g>

            <image
              href="/logo.svg"
              x={LOGO.x}
              y={LOGO.y}
              width={LOGO.width}
              height={LOGO.height}
              preserveAspectRatio="xMidYMid meet"
              className="pcb-logo-final"
            />
          </svg>
        </div>

        <div className="pcb-hero-copy -mt-4 flex max-w-3xl flex-col items-center px-5 sm:px-8">
          <p className="font-mono text-[0.67rem] uppercase tracking-[0.28em] text-primary/80 sm:text-xs">
            Hardware × software × people who build
          </p>
          <h1 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Purdue&apos;s home for embedded systems.
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-sm leading-6 text-muted-foreground sm:text-base lg:text-lg">
            Design boards, program microcontrollers, work with FPGAs, and ship real systems with a community built around making.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="h-11 px-6" asChild>
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                Join ES@P
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 border-primary/30 bg-background/55 px-6 backdrop-blur-sm" asChild>
              <Link href="/projects">
                Explore projects <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <a
          href="#landing-content"
          className="pcb-scroll-cue absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to explore Embedded Systems at Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
