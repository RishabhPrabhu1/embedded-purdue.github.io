import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { Esp32Visual } from "@/components/landing/esp32-visual"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNavigation } from "@/components/landing/landing-navigation"
import { LandingStyles } from "@/components/landing/landing-styles"
import { PcbHero } from "@/components/landing/pcb-hero"
import { projects } from "@/app/projects/_data"
import { getAllWorkshops } from "@/lib/workshops"

const featuredSlugs = new Set(["harmonicore", "slayterhil", "bb8"])
const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug))
const featuredProjectImages: Record<string, string> = {
  harmonicore: "/projects/harmonicore/harmonicore-1.jpg",
  slayterhil: "/projects/slayterhil/slayterHIL-1.jpg",
  bb8: "/projects/bb8/bb8-1.jpg",
}
const featuredWorkshops = getAllWorkshops().slice(0, 3)

const workAreas = [
  {
    title: "Board design & bring-up",
    detail: "Schematics, KiCad, analog interfaces, sensors, power, and first power-on debugging.",
    stack: "KiCad · PCB · Analog · Power",
    projects: "MicroPiano · BerryWeather · HarmoniCore",
  },
  {
    title: "Real-time firmware",
    detail: "Drivers, peripherals, RTOS work, wireless links, and control code on real microcontrollers.",
    stack: "STM32 · ESP32 · C/C++ · RTOS",
    projects: "slayterHiL · Smart Watch · MicroPiano",
  },
  {
    title: "FPGA & signal processing",
    detail: "HDL, DSP pipelines, audio processing, and hardware acceleration where software is not enough.",
    stack: "FPGA/HDL · DSP · Python · Audio",
    projects: "HarmoniCore",
  },
  {
    title: "Robotics & control",
    detail: "Computer vision, motor control, PID, hardware-in-the-loop, sensing, and system integration.",
    stack: "Vision · PID · HIL · Wireless",
    projects: "BB-8 · EyeCue · slayterHiL",
  },
]

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function SignalLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
      <span>{children}</span>
    </div>
  )
}

function formatWorkshopDate(date?: string) {
  if (!date) return "Workshop"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return "Workshop"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed)
}

function projectDisplayTitle(title: string) {
  return title.split(" (")[0]
}

export default function HomePage() {
  return (
    <div
      data-landing-shell
      className="min-h-screen overflow-hidden bg-black text-[#f3efe6]"
      style={
        {
          "--landing-nav-opacity": "0",
          "--landing-content-opacity": "0",
        } as CSSProperties
      }
    >
      <LandingStyles />
      <LandingNavigation />
      <PcbHero />

      <main
        id="landing-content"
        className="bg-[#0c0c0b] opacity-[var(--landing-content-opacity)] transition-opacity duration-[1100ms] ease-out"
      >
        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-5 px-5 py-9 sm:px-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-12 xl:px-16">
              <div>
                <SignalLabel>Selected work</SignalLabel>
                <h2 className="mt-3 text-[clamp(2.7rem,4.8vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                  Projects
                </h2>
              </div>

              <Link
                href="/projects"
                className="group inline-flex w-fit items-center gap-3 border border-[#daa000]/35 bg-[#daa000]/[0.08] px-4 py-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#ddc16e] shadow-[0_8px_24px_rgba(0,0,0,.16)] transition-colors hover:border-[#daa000] hover:bg-[#daa000] hover:text-[#11110f]"
              >
                All projects
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-px border-t border-white/[0.08] bg-white/[0.08] md:grid-cols-12">
              {featuredProjects.map((project, index) => {
                const position = index === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"

                return (
                  <Link
                    key={project.slug}
                    href={project.readmeUrl || `/projects/${project.slug}`}
                    data-landing-lift="card"
                    className={`group relative isolate overflow-hidden bg-[#121210] ${position} ${
                      index === 0 ? "min-h-[410px] md:min-h-[560px]" : "min-h-[280px] md:min-h-[279px]"
                    }`}
                  >
                    <Image
                      src={featuredProjectImages[project.slug] || project.image || "/projects/logo.png"}
                      alt={project.title}
                      fill
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                      className="object-cover opacity-[0.7] grayscale-[16%] transition duration-700 ease-out group-hover:scale-[1.016] group-hover:opacity-[0.86] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/10 to-black/16 transition-colors duration-500 group-hover:from-black/86" />

                    <ArrowUpRight
                      className="absolute right-5 top-5 h-4 w-4 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f] sm:right-6 sm:top-6"
                      aria-hidden="true"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className={`${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"} font-medium tracking-[-0.045em]`}>
                        {projectDisplayTitle(project.title)}
                      </h3>
                      <p className="mt-2 max-w-lg font-mono text-[0.57rem] uppercase tracking-[0.14em] text-[#d6b65d]">
                        {project.technologies.slice(0, 3).join(" · ")}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#10100e]">
          <div className={`${WIDE_RAIL} grid lg:grid-cols-[0.62fr_1fr_1fr] lg:grid-rows-2 lg:border-x lg:border-white/[0.06]`}>
            <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:row-span-2 lg:border-b-0 lg:border-r lg:px-10 lg:py-10 xl:px-12">
              <SignalLabel>Work areas</SignalLabel>
              <h2 className="mt-4 max-w-sm text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.05em]">
                From board bring-up to full systems.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#827e76]">
                These are the recurring technical problems represented across current and recent projects.
              </p>
            </div>

            {workAreas.map((area, index) => (
              <div
                key={area.title}
                className={`px-5 py-7 sm:px-8 lg:px-8 lg:py-8 xl:px-10 ${
                  index < 2 ? "border-b border-white/[0.08]" : ""
                } ${index % 2 === 0 ? "lg:border-r" : ""}`}
              >
                <div className="flex items-start justify-between gap-5">
                  <h3 className="text-xl font-medium tracking-[-0.035em] sm:text-2xl">{area.title}</h3>
                  <span className="pt-1 font-mono text-[0.5rem] tracking-[0.14em] text-[#5f5a51]">0{index + 1}</span>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#928d84]">{area.detail}</p>
                <p className="mt-4 font-mono text-[0.54rem] uppercase tracking-[0.13em] text-[#c7a84d]">{area.stack}</p>
                <p className="mt-2 text-xs leading-5 text-[#625f59]">Seen in: {area.projects}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className="grid w-full lg:grid-cols-[1.12fr_0.88fr]">
            <div className="overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r">
              <Esp32Visual />
            </div>

            <div className="flex items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-10 xl:px-12 2xl:px-16">
              <div className="w-full max-w-2xl">
                <SignalLabel>Workshops</SignalLabel>
                <h2 className="mt-4 max-w-lg text-[clamp(2.45rem,4vw,4.15rem)] font-medium leading-[0.93] tracking-[-0.05em]">
                  Learn on real hardware.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#969188] sm:text-base sm:leading-7">
                  Technical sessions move from fundamentals to working systems.
                </p>

                <div className="mt-6 border-t border-white/[0.08]">
                  {featuredWorkshops.map((workshop, index) => (
                    <Link
                      key={workshop.slug}
                      href={`/workshops/${workshop.slug}`}
                      className={`group grid grid-cols-[1fr_auto] items-center gap-5 py-4 ${
                        index < featuredWorkshops.length - 1 ? "border-b border-white/[0.08]" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium tracking-[-0.01em] text-[#ded8cd] transition-colors group-hover:text-[#f3efe6] sm:text-base">
                          {workshop.title}
                        </p>
                        <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#6f6b64]">
                          {formatWorkshopDate(workshop.date)}
                          {workshop.location ? ` · ${workshop.location}` : ""}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </div>

                <Link
                  href="/workshops"
                  className="group mt-5 inline-flex items-center gap-2 font-mono text-[0.63rem] uppercase tracking-[0.16em] text-[#bdb6aa] transition-colors hover:text-[#f2c34f]"
                >
                  All workshops
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-white/[0.08] bg-[#0a0a09]">
          <Link
            href="/team"
            data-landing-lift="card"
            className="group relative block min-h-[370px] w-full overflow-hidden"
            aria-label="Meet the Embedded Systems @ Purdue team"
          >
            <Image
              src="/founders.jpeg"
              alt="Embedded Systems @ Purdue community"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-[0.52] grayscale-[10%] transition duration-700 group-hover:scale-[1.012] group-hover:opacity-[0.64] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a09] via-[#0a0a09]/68 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09]/82 via-transparent to-[#0a0a09]/14" />
            <ArrowUpRight className="absolute right-6 top-6 z-10 h-5 w-5 text-white/45 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f] sm:right-8 sm:top-8" aria-hidden="true" />

            <div className="relative flex min-h-[370px] items-end px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-2xl">
                <SignalLabel>Community</SignalLabel>
                <h2 className="mt-4 text-balance text-[clamp(2.65rem,4.8vw,4.7rem)] font-medium leading-[0.91] tracking-[-0.055em]">
                  Meet the people building it.
                </h2>
              </div>
            </div>
          </Link>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} grid lg:grid-cols-[0.92fr_1.08fr]`}>
            <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:border-b-0 lg:border-r lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-2xl">
                <SignalLabel>Schedule</SignalLabel>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Events</h2>

                <div className="mt-6 border-t border-white/[0.08]">
                  <a
                    href="https://calendar.google.com/calendar/render?cid=embedded%40purdue.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-6 border-b border-white/[0.08] py-4"
                  >
                    <div>
                      <p className="text-base font-medium">Calendar</p>
                      <p className="mt-1 text-sm text-[#77726a]">Stay current with meetings, workshops, and club activity.</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]" aria-hidden="true" />
                  </a>

                  <a
                    href="mailto:embedded@purdue.edu"
                    className="group flex items-center justify-between gap-6 py-4"
                  >
                    <div>
                      <p className="text-base font-medium">embedded@purdue.edu</p>
                      <p className="mt-1 text-sm text-[#77726a]">Questions, collaboration, or general contact.</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
              <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:42px_42px]" />
              <div className="relative max-w-2xl">
                <SignalLabel>Join</SignalLabel>
                <h2 className="mt-4 text-[clamp(2.6rem,4.4vw,4.4rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                  Build something real.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#918c84] sm:text-base sm:leading-7">
                  Join the Discord for project discussion, workshop updates, and the fastest path into current work.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="https://discord.gg/E9XYmSptnN"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-landing-lift="button"
                    className="group inline-flex items-center gap-3 bg-[#daa000] px-5 py-3.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#12110d] transition-colors hover:bg-[#efbd2f]"
                  >
                    Join Discord
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                  <Link
                    href="/projects"
                    data-landing-lift="button"
                    className="inline-flex items-center gap-3 border border-white/[0.12] px-5 py-3.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[#c9c3b8] transition-colors hover:border-white/[0.24] hover:text-white"
                  >
                    Browse projects
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
