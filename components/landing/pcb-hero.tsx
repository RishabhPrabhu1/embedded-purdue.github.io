import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const GOLD = "#daa000"
const LOGO_X = 270
const LOGO_Y = 250
const LOGO_SCALE = 1060 / 1920

const feederTraces = [
  { d: "M42 150 H145 V220 H245 V352 H334", delay: 0.34 },
  { d: "M42 340 H125 V400 H235 V445 H338", delay: 0.42 },
  { d: "M42 610 H150 V570 H250 V530 H350", delay: 0.50 },
  { d: "M1558 150 H1460 V220 H1370 V350 H1270", delay: 0.36 },
  { d: "M1558 350 H1475 V405 H1360 V445 H1265", delay: 0.44 },
  { d: "M1558 610 H1450 V570 H1355 V525 H1260", delay: 0.52 },
  { d: "M360 42 V130 H455 V205 H520 V286", delay: 0.38 },
  { d: "M720 42 V135 H730 V205 H730 V276", delay: 0.46 },
  { d: "M1060 42 V135 H990 V205 H990 V276", delay: 0.54 },
  { d: "M370 678 V605 H455 V570 H520 V588", delay: 0.40 },
  { d: "M790 678 V620 H820 V585 H820 V588", delay: 0.48 },
  { d: "M1215 678 V605 H1145 V570 H1090 V588", delay: 0.56 },
]

const ports = [
  [42, 150], [42, 340], [42, 610],
  [1558, 150], [1558, 350], [1558, 610],
  [360, 42], [720, 42], [1060, 42],
  [370, 678], [790, 678], [1215, 678],
]

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

function LogoPathGroup({ paths, delay }: { paths: string[]; delay: number }) {
  return (
    <>
      {paths.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength="1"
          className="pcb3-logo-line"
          style={{ animationDelay: `${delay + index * 0.035}s` }}
        />
      ))}
    </>
  )
}

function FilledLogoGeometry() {
  return (
    <g className="pcb3-logo-fill" fill={GOLD}>
      {ePaths.map((d) => <path key={`fill-e-${d}`} d={d} />)}
      <ellipse cx="112.25" cy="251.67" rx="45.23" ry="48.58" />
      {sPaths.map((d) => <path key={`fill-s-${d}`} d={d} />)}
      {atPaths.map((d) => <path key={`fill-a-${d}`} d={d} />)}
      {pPaths.map((d) => <path key={`fill-p-${d}`} d={d} />)}
      <ellipse cx="1448.52" cy="539.9" rx="45.23" ry="48.58" />
    </g>
  )
}

export function PcbHero() {
  return (
    <section className="pcb3-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-primary/15 bg-background">
      <style>{`
        .pcb3-hero {
          background: radial-gradient(circle at 50% 46%, rgba(218,160,0,.055), transparent 36%), var(--background);
        }
        .pcb3-stage {
          height: min(72svh, 720px);
          min-height: 520px;
          contain: layout paint;
          transform: translateZ(0);
        }
        .pcb3-port-ring { fill: var(--background); stroke: rgba(218,160,0,.62); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
        .pcb3-port-core { fill: ${GOLD}; transform-box: fill-box; transform-origin: center; animation: pcb3Port 2.4s ease-in-out infinite; }
        .pcb3-trace {
          fill: none; stroke: ${GOLD}; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 1; stroke-dashoffset: 1; vector-effect: non-scaling-stroke;
          animation: pcb3Trace 1.32s cubic-bezier(.22,.72,.18,1) forwards;
          will-change: stroke-dashoffset;
        }
        .pcb3-junction { fill: ${GOLD}; opacity: 0; animation: pcb3Junction .22s ease-out forwards; }
        .pcb3-logo-line {
          fill: transparent; stroke: ${GOLD}; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round;
          stroke-dasharray: 1; stroke-dashoffset: 1;
          animation: pcb3LogoDraw 1.38s cubic-bezier(.2,.72,.16,1) forwards;
          will-change: stroke-dashoffset;
        }
        .pcb3-logo-fill { opacity: 0; animation: pcb3Fill .5s ease-out 3.05s forwards; }
        .pcb3-copy { opacity: 0; transform: translateY(10px); animation: pcb3Copy .55s ease-out 3.34s forwards; }
        .pcb3-scroll { opacity: 0; animation: pcb3Copy .45s ease-out 3.72s forwards; }
        @keyframes pcb3Trace { to { stroke-dashoffset: 0; } }
        @keyframes pcb3LogoDraw { 0% { stroke-dashoffset: 1; } 100% { stroke-dashoffset: 0; } }
        @keyframes pcb3Fill { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcb3Copy { to { opacity: 1; transform: translateY(0); } }
        @keyframes pcb3Junction { 0% { opacity: 0; transform: scale(.4); } 65% { opacity: 1; transform: scale(1.6); } 100% { opacity: .9; transform: scale(1); } }
        @keyframes pcb3Port { 0%,100% { opacity: .62; transform: scale(.82); } 50% { opacity: 1; transform: scale(1.08); } }
        @media (max-width: 640px) {
          .pcb3-stage { height: 58svh; min-height: 430px; }
          .pcb3-trace { stroke-width: 1.7; }
          .pcb3-logo-line { stroke-width: 6; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pcb3-port-core, .pcb3-trace, .pcb3-junction, .pcb3-logo-line, .pcb3-logo-fill, .pcb3-copy, .pcb3-scroll { animation: none !important; }
          .pcb3-trace, .pcb3-logo-line { stroke-dashoffset: 0; }
          .pcb3-logo-fill, .pcb3-copy, .pcb3-scroll, .pcb3-junction { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center pb-12 text-center">
        <div className="pcb3-stage relative w-full" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 720" preserveAspectRatio="xMidYMid slice">
            {ports.map(([cx, cy], index) => (
              <g key={`${cx}-${cy}`}>
                <circle cx={cx} cy={cy} r="12" className="pcb3-port-ring" />
                <circle cx={cx} cy={cy} r="4.4" className="pcb3-port-core" style={{ animationDelay: `${index * 0.08}s` }} />
              </g>
            ))}

            {feederTraces.map(({ d, delay }, index) => (
              <g key={d}>
                <path d={d} pathLength="1" className="pcb3-trace" style={{ animationDelay: `${delay}s` }} />
                <circle
                  cx={[334,338,350,1270,1265,1260,520,730,990,520,820,1090][index]}
                  cy={[352,445,530,350,445,525,286,276,276,588,588,588][index]}
                  r="4.2"
                  className="pcb3-junction"
                  style={{ animationDelay: `${delay + 1.22}s` }}
                />
              </g>
            ))}

            <g transform={`translate(${LOGO_X} ${LOGO_Y}) scale(${LOGO_SCALE})`}>
              <LogoPathGroup paths={ePaths} delay={1.48} />
              <ellipse cx="112.25" cy="251.67" rx="45.23" ry="48.58" pathLength="1" className="pcb3-logo-line" style={{ animationDelay: "1.55s" }} />

              <LogoPathGroup paths={sPaths} delay={1.62} />
              <LogoPathGroup paths={atPaths} delay={1.74} />
              <LogoPathGroup paths={pPaths} delay={1.88} />
              <ellipse cx="1448.52" cy="539.9" rx="45.23" ry="48.58" pathLength="1" className="pcb3-logo-line" style={{ animationDelay: "1.95s" }} />

              <FilledLogoGeometry />
            </g>
          </svg>
        </div>

        <div className="pcb3-copy -mt-10 flex max-w-3xl flex-col items-center px-5 sm:px-8">
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
          className="pcb3-scroll absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
          aria-label="Scroll to explore Embedded Systems at Purdue"
        >
          Explore
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
