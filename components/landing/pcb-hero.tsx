import type { CSSProperties } from "react"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const GOLD = "#daa000"
const SIGNAL = "#f2c24f"
const LOGO_X = 270
const LOGO_Y = 250
const LOGO_SCALE = 1060 / 1920

const routes = [
  {
    port: [42, 210],
    feeder: "M42 210 H120 V300 H210 V389 H332",
    build: "M332 389 C378 388 404 370 432 338 C466 299 526 308 555 350 C580 386 563 430 522 455 C486 477 452 492 430 506",
    delay: 0.18,
    feederDuration: 0.64,
    buildDuration: 0.70,
  },
  {
    port: [42, 520],
    feeder: "M42 520 H150 V560 H270 V506 H430",
    build: "M430 506 C490 505 545 499 604 486 C668 472 716 444 734 405 C752 363 729 316 656 284",
    delay: 0.22,
    feederDuration: 0.70,
    buildDuration: 0.68,
  },
  {
    port: [1558, 210],
    feeder: "M1558 210 H1480 V300 H1380 V390 H1280",
    build: "M1280 390 C1240 370 1204 350 1174 322 C1148 298 1136 287 1124 284 C1138 326 1136 370 1118 411 C1103 447 1084 484 1070 548",
    delay: 0.20,
    feederDuration: 0.66,
    buildDuration: 0.72,
  },
  {
    port: [1558, 520],
    feeder: "M1558 520 H1460 V575 H1320 V548 H1070",
    build: "M1070 548 C1042 521 1016 500 984 483 C950 465 918 445 900 412 C880 375 874 330 860 284",
    delay: 0.24,
    feederDuration: 0.76,
    buildDuration: 0.68,
  },
  {
    port: [390, 42],
    feeder: "M390 42 V110 H420 V190 H442 V284",
    build: "M442 284 C445 328 438 369 427 409 C418 445 417 477 430 506",
    delay: 0.16,
    feederDuration: 0.60,
    buildDuration: 0.62,
  },
  {
    port: [650, 42],
    feeder: "M650 42 V120 H656 V284",
    build: "M656 284 C690 303 716 331 728 365 C739 397 731 430 708 455 C686 478 675 490 674 506",
    delay: 0.19,
    feederDuration: 0.58,
    buildDuration: 0.64,
  },
  {
    port: [900, 42],
    feeder: "M900 42 V120 H860 V284",
    build: "M860 284 C886 315 901 352 900 391 C899 430 915 469 950 506",
    delay: 0.21,
    feederDuration: 0.60,
    buildDuration: 0.64,
  },
  {
    port: [1170, 42],
    feeder: "M1170 42 V120 H1124 V284",
    build: "M1124 284 C1162 286 1200 301 1228 327 C1254 351 1270 374 1280 390",
    delay: 0.23,
    feederDuration: 0.62,
    buildDuration: 0.62,
  },
  {
    port: [650, 678],
    feeder: "M650 678 V610 H674 V506",
    build: "M674 506 C701 482 719 455 730 423 C742 386 733 341 712 317 C695 297 676 287 656 284",
    delay: 0.20,
    feederDuration: 0.58,
    buildDuration: 0.64,
  },
  {
    port: [1000, 678],
    feeder: "M1000 678 V610 H950 V506",
    build: "M950 506 C978 487 1007 467 1030 439 C1056 407 1067 371 1054 335 C1046 313 1018 292 986 284",
    delay: 0.22,
    feederDuration: 0.60,
    buildDuration: 0.64,
  },
] as const

const ePaths = [
  "M120.67,220.27c4.37,7.39,7.47,15.8,8.78,24.75,2.2,14.98-1.07,28.48-8.04,38.1l91.88.54,10.87-62.78-103.5-.61h.01Z",
  "M522.61,215.02c-.87,4.61-4.11,7.58-8.32,7.58h-.07l-200.72-1.19-10.87,62.79,220.48,1.31h.46c25.83,0,45.97-18.45,51.36-47.13l13.89-73.71c4.35-23.12-1.83-49.24-16.55-69.86-14.71-20.62-35.95-32.94-56.81-32.94h-204.38c-25.95,0-46.7,19.48-51.62,48.48l-18.77,110.63-10.65,62.78-13.58,80.02c-3.91,23.05,2.54,48.9,17.25,69.16,14.69,20.23,35.75,32.3,56.34,32.3h.09l278.89-.45,1.05-6.06,7-40.35,2.9-16.73-18.71.22v.02l-280.43.45h-.01c-4.6,0-7.66-3.25-9.07-5.2-1.41-1.94-3.65-5.97-2.77-11.13l17.29-101.91,10.65-62.79,15.06-88.74c.79-4.67,4.13-7.81,8.31-7.81h204.38c4.66,0,7.73,3.32,9.14,5.3,1.41,1.98,3.64,6.07,2.66,11.24l-13.89,73.71h.02Z",
  "M129.45,245.02c-1.31-8.95-4.42-17.36-8.78-24.75l-8.42-.05,8.95,62.9h.22c6.97-9.62,10.23-23.12,8.04-38.1h0Z",
]

const sPaths = [
  "M1031.87,61.73h-331.67c-25.06,0-45.08,17.75-51,45.23l-16.36,75.96c-4.91,22.81.78,48.83,15.23,69.61,14.45,20.78,35.5,33.22,56.34,33.29l156.26.37c4.82.02,7.91,3.51,9.32,5.6,1.41,2.09,3.59,6.36,2.31,11.58l-22.15,90.17c-1.03,4.22-4.22,6.94-8.17,6.94h-.06l-118.79-.55-126.99,1.52-10.95,63.15,147.32-1.77,118.38.55h.36c24.27,0,44.08-16.91,50.52-43.17l22.15-90.17c5.73-23.31.35-50.2-14.37-71.94-14.73-21.74-36.39-34.75-57.97-34.82l-156.26-.37c-4.23-.01-6.98-3.06-8.24-4.87s-3.22-5.54-2.23-10.18l16.35-75.95c.95-4.42,4.18-7.28,8.21-7.28h282.74l5.21-23.3c7.3-24.23,11.23-39.6,34.49-39.6h.02Z",
]

const atPaths = [
  "M1014.55,124.64h.18l5.21-23.3c-.5,1.66-.95,3.35-1.34,5.09l-4.06,18.21h.01Z",
  "M1216.32,344.97h-.08l-1.54,9.04h.21c.22-1.76.45-3.32.65-4.52l.76-4.52h0Z",
  "M1324.52,364.25l2.27-12.45-2.01,10.82c-.1.54-.16,1.08-.25,1.62h-.01Z",
  "M1227.67,280.74c-.03-1.28.05-2.54.17-3.79l-1.06,6.24c.57-.79.91-1.63.9-2.45h-.01Z",
  "M1228.08,274.91v-.08l.11.04.38-2.25-.11-.05-.38,2.28v.05h0Z",
  "M1226.66,283.34s.07-.1.11-.15l1.06-6.24c.07-.69.13-1.37.24-2.04l-1.41,8.43Z",
  "M1221.39,314.74l5.38-31.54s-.07.1-.11.15l-5.27,31.39h0Z",
  "M1228.08,274.91c-.11.67-.17,1.36-.24,2.04l.35-2.08-.1-.04v.08h-.01Z",
  "M1278.7,385.78c0,.47.02.93.04,1.36.38.02.78.02,1.2.02",
  "M1388.94,402.37c-4.66,0-7.72-3.31-9.13-5.29s-3.64-6.06-2.67-11.23l41.21-221.48c4.3-23.11-1.91-49.2-16.63-69.78-14.71-20.58-35.92-32.86-56.75-32.86h-275.46c-23.26,0-42.24,15.37-49.54,39.6l-5.21,23.3-7.68,34.33-.14-.07-44.74,200.54c-5.22,23.4.56,50.12,15.46,71.48,14.77,21.18,36.18,33.76,57.38,33.76h1.01l74.25-2.3,119.92-.4c-4.25-4.15-7.85-8.44-10.83-12.55-10.37-14.26-17.15-31.14-20.34-50.23l-102.67.4-70.6,2.18c-4.7-.03-7.76-3.4-9.17-5.43-1.43-2.05-3.65-6.27-2.49-11.5l56.46-253.01c.97-4.37,4.19-7.19,8.18-7.19h275.46c4.66,0,7.72,3.31,9.13,5.29,1.41,1.97,3.64,6.06,2.67,11.23l-39.19,210.66-2.27,12.45c-2.16,13.18-.96,27.24,3.24,40.66l-45.11.22h-.06c-7.5,0-13.41-1.73-15.44-4.51-2.05-2.82-3.56-9.48-3.72-17.54-.08-4.1.17-8.54.93-13.07l2.71-16.16,4.91-29.23,3.3-19.15,2.02-12.55,13.67-81.92c1.04-6.26.09-13.03-2.5-19.23-1.13-2.7-2.53-5.3-4.27-7.69-5.72-7.85-13.91-12.53-21.91-12.53h-.07l-124.28.41c-9.56.03-17.24,6.72-19.68,17.11l-26.96,114.96c-2.12,9.06.07,19.59,5.81,27.94,5.73,8.33,14.2,13.36,22.5,13.36h.08l80.45-.3,3.45-20.21,6.53-38.28-67.1-1.98,17-56.45,75.54,1.97-7.09,42.49.11.05-.38,2.25-.35,2.08c-.12,1.25-.2,2.51-.17,3.79.02.82-.32,1.66-.9,2.45l-5.38,31.54-1.69,10.04-3.39,20.19-.76,4.52c-.2,1.2-.43,2.76-.65,4.52l-.63,29.22c1.34,15.93,5.82,34.54,17.56,50.68,9.84,13.53,25.42,29.59,56.69,29.59.04,0,82.52,1.77,82.52,1.77h51.28l9.53-62.9h-42.96Z",
]

const pPaths = [
  "M1422.94,525.75l10.93,4.56,41.66,17.37,8.07-49s-.01-.02-.02-.03l36.62-202.86,2.49-12.66,2.95-17.97,2.95-17.97,2.06-14.73.53-3.25,16.06-97.49c.77-4.69,3.96-7.77,8.14-7.86l177.55-3.72,38.76-.81h.21c.13,0,.24.03.37.03.98.76,2,1.54,3.11,2.4,3.2,2.46,4.9,6.94,4.09,10.79l-19.89,94.96-16.43.35h0s-61.41,1.34-61.41,1.34l-134.62,2.9-2.47,15.09-2.95,17.97-2.95,17.97-2.02,12.31,233.53-5.04c25.35-.55,45.1-19.16,50.31-47.41l15.49-84.05c4.3-23.35-2.09-49.61-17.08-70.25-15-20.63-36.44-32.64-57.42-32.25l-216.3,4.53c-7.73.16-14.91,2.01-21.33,5.26-7.87,3.98-14.56,10.12-19.65,17.97-4.67,7.2-8.01,15.82-9.62,25.6l-31.09,188.63-17.13,103.94-10.37,62.9-4.17,26.05",
]

function LogoShape() {
  return (
    <>
      {ePaths.map((d) => <path key={`e-${d}`} d={d} />)}
      <ellipse cx="112.25" cy="251.67" rx="45.23" ry="48.58" />
      {sPaths.map((d) => <path key={`s-${d}`} d={d} />)}
      {atPaths.map((d) => <path key={`a-${d}`} d={d} />)}
      {pPaths.map((d) => <path key={`p-${d}`} d={d} />)}
      <ellipse cx="1448.52" cy="539.9" rx="45.23" ry="48.58" />
    </>
  )
}

export function PcbHero() {
  return (
    <section className="pcb4-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <style>{`
        .pcb4-hero {
          background: radial-gradient(circle at 50% 45%, rgba(218,160,0,.045), transparent 34%), var(--background);
        }
        .pcb4-stage {
          height: min(68svh, 680px);
          min-height: 500px;
          contain: layout paint;
        }
        .pcb4-port-ring {
          fill: var(--background);
          stroke: rgba(218,160,0,.62);
          stroke-width: 1.4;
          vector-effect: non-scaling-stroke;
        }
        .pcb4-port-core { fill: ${GOLD}; }
        .pcb4-feeder,
        .pcb4-reveal,
        .pcb4-signal {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .pcb4-feeder {
          stroke: ${GOLD};
          stroke-width: 2;
          vector-effect: non-scaling-stroke;
          animation: pcb4Draw var(--dur) cubic-bezier(.4,0,.2,1) var(--delay) forwards;
        }
        .pcb4-reveal {
          stroke: ${GOLD};
          stroke-width: 88;
          animation: pcb4Draw var(--build-dur) cubic-bezier(.4,0,.2,1) var(--build-delay) forwards;
        }
        .pcb4-signal {
          stroke: ${SIGNAL};
          stroke-width: 2.3;
          vector-effect: non-scaling-stroke;
          animation: pcb4Draw var(--build-dur) cubic-bezier(.4,0,.2,1) var(--build-delay) forwards;
        }
        .pcb4-logo-fill {
          opacity: 0;
          animation: pcb4Resolve .16s linear 1.58s forwards;
        }
        .pcb4-copy {
          opacity: 0;
          transform: translateY(7px);
          animation: pcb4Copy .38s cubic-bezier(.2,.7,.2,1) 1.70s forwards;
        }
        .pcb4-scroll { opacity: 0; animation: pcb4Resolve .25s linear 2.02s forwards; }
        @keyframes pcb4Draw { to { stroke-dashoffset: 0; } }
        @keyframes pcb4Resolve { to { opacity: 1; } }
        @keyframes pcb4Copy { to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .pcb4-stage { height: 56svh; min-height: 420px; }
          .pcb4-feeder, .pcb4-signal { stroke-width: 1.65; }
          .pcb4-reveal { stroke-width: 72; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pcb4-feeder, .pcb4-reveal, .pcb4-signal, .pcb4-logo-fill, .pcb4-copy, .pcb4-scroll { animation: none !important; }
          .pcb4-feeder, .pcb4-reveal, .pcb4-signal { stroke-dashoffset: 0; }
          .pcb4-logo-fill, .pcb4-copy, .pcb4-scroll { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-12 text-center">
        <div className="pcb4-stage relative w-full" aria-hidden="true">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1600 720"
            preserveAspectRatio="xMidYMid slice"
            shapeRendering="geometricPrecision"
          >
            <defs>
              <clipPath id="pcb4LogoClip" clipPathUnits="userSpaceOnUse">
                <g transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${LOGO_SCALE})`}>
                  <LogoShape />
                </g>
              </clipPath>
            </defs>

            {routes.map(({ port: [cx, cy] }) => (
              <g key={`port-${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="11" className="pcb4-port-ring" />
                <circle cx={cx} cy={cy} r="4" className="pcb4-port-core" />
              </g>
            ))}

            {routes.map(({ feeder, build, delay, feederDuration, buildDuration }) => {
              const buildDelay = delay + feederDuration - 0.045
              const style = {
                "--delay": `${delay}s`,
                "--dur": `${feederDuration}s`,
                "--build-delay": `${buildDelay}s`,
                "--build-dur": `${buildDuration}s`,
              } as CSSProperties

              return (
                <g key={feeder} style={style}>
                  <path d={feeder} pathLength="1" className="pcb4-feeder" />
                  <g clipPath="url(#pcb4LogoClip)">
                    <path d={build} pathLength="1" className="pcb4-reveal" />
                    <path d={build} pathLength="1" className="pcb4-signal" />
                  </g>
                </g>
              )
            })}

            <g className="pcb4-logo-fill" fill={GOLD} transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${LOGO_SCALE})`}>
              <LogoShape />
            </g>
          </svg>
        </div>

        <div className="pcb4-copy -mt-10 flex max-w-3xl flex-col items-center px-5 sm:px-8">
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
              <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">Join ES@P</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 border-primary/30 bg-background/70 px-6" asChild>
              <Link href="/projects">Explore projects <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </div>
        </div>

        <a
          href="#landing-content"
          className="pcb4-scroll absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to explore Embedded Systems at Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
