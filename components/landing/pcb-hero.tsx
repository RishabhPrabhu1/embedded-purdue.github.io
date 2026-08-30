import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const traces = [
  "M0 150 H150 V235 H300 V315 H435",
  "M0 310 H120 V390 H255 V435 H435",
  "M0 505 H175 V555 H315 V515 H435",
  "M0 715 H135 V645 H295 V585 H435",
  "M1600 170 H1450 V245 H1300 V315 H1165",
  "M1600 325 H1485 V405 H1340 V445 H1165",
  "M1600 520 H1435 V565 H1280 V520 H1165",
  "M1600 730 H1470 V655 H1305 V590 H1165",
  "M245 0 V115 H420 V205 H555 V280",
  "M620 0 V120 H705 V220 H705 V280",
  "M980 0 V125 H905 V220 H905 V280",
  "M1360 0 V145 H1225 V215 H1045 V280",
  "M250 900 V790 H430 V700 H565 V620",
  "M625 900 V790 H710 V690 H710 V620",
  "M985 900 V785 H915 V690 H915 V620",
  "M1350 900 V770 H1220 V690 H1045 V620",
]

const ports = [
  [0, 150],
  [0, 310],
  [0, 505],
  [0, 715],
  [1600, 170],
  [1600, 325],
  [1600, 520],
  [1600, 730],
  [245, 0],
  [620, 0],
  [980, 0],
  [1360, 0],
  [250, 900],
  [625, 900],
  [985, 900],
  [1350, 900],
]

const vias = [
  [150, 235],
  [300, 315],
  [120, 390],
  [315, 515],
  [1450, 245],
  [1340, 445],
  [1435, 565],
  [1305, 590],
  [420, 205],
  [705, 220],
  [905, 220],
  [1225, 215],
  [430, 700],
  [710, 690],
  [915, 690],
  [1220, 690],
]

export function PcbHero() {
  return (
    <section className="pcb-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <div className="pcb-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pcb-hero-vignette pointer-events-none absolute inset-0" aria-hidden="true" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="pcbGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {traces.map((d, index) => (
          <g key={d}>
            <path d={d} className="pcb-trace-base" />
            <path
              d={d}
              pathLength="1"
              className="pcb-trace-energy"
              style={{ animationDelay: `${280 + index * 48}ms` }}
            />
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
              style={{ animationDelay: `${760 + index * 34}ms` }}
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
              style={{ animationDelay: `${80 + index * 42}ms` }}
            />
          </g>
        ))}
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col items-center justify-center px-5 pb-14 pt-10 text-center sm:px-8 lg:px-12">
        <div className="pcb-logo-stage relative flex w-full max-w-6xl items-center justify-center py-7 sm:py-10">
          <div className="pcb-logo-halo pointer-events-none absolute left-1/2 top-1/2 h-[45%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="pcb-logo-reveal relative w-[min(84vw,72rem)]">
            <Image
              src="/logo.svg"
              alt="Embedded Systems @ Purdue"
              width={1920}
              height={612}
              priority
              sizes="(max-width: 768px) 88vw, 72rem"
              className="h-auto w-full drop-shadow-[0_0_28px_rgba(218,160,0,0.18)]"
            />
          </div>
        </div>

        <div className="pcb-hero-copy mt-1 flex max-w-3xl flex-col items-center">
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
