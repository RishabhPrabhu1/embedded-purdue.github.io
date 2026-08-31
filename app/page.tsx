import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { PcbHero } from "@/components/landing/pcb-hero"
import { projects } from "@/app/projects/_data"
import { getAllWorkshops } from "@/lib/workshops"

const featuredSlugs = new Set(["harmonicore", "slayterhil", "bb8"])
const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug))
const featuredWorkshops = getAllWorkshops().slice(0, 3)

const disciplines = [
  {
    title: "Hardware",
    description: "Schematics, PCB layout, sensors, power, and board bring-up.",
  },
  {
    title: "Firmware",
    description: "Microcontrollers, peripherals, RTOS work, controls, and low-level code.",
  },
  {
    title: "Systems",
    description: "FPGA, wireless, robotics, DSP, tooling, and system integration.",
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
      <Navigation />
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
                className="group inline-flex w-fit items-center gap-2 font-mono text-[0.63rem] uppercase tracking-[0.16em] text-[#aaa398] transition-colors hover:text-[#f2c34f]"
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
                    className={`group relative isolate overflow-hidden bg-[#121210] ${position} ${
                      index === 0 ? "min-h-[410px] md:min-h-[560px]" : "min-h-[280px] md:min-h-[279px]"
                    }`}
                  >
                    <Image
                      src={project.image || "/projects/logo.png"}
                      alt={project.title}
                      fill
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                      className="object-cover opacity-[0.7] grayscale-[16%] transition duration-700 ease-out group-hover:scale-[1.016] group-hover:opacity-[0.86] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/10 to-black/16" />

                    <ArrowUpRight
                      className="absolute right-5 top-5 h-4 w-4 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f] sm:right-6 sm:top-6"
                      aria-hidden="true"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className={`${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"} font-medium tracking-[-0.045em]`}>
                        {project.title}
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

        <section className="border-b border-white/[0.08] bg-[#11100d]">
          <div className={`${WIDE_RAIL} lg:grid lg:grid-cols-[0.5fr_repeat(3,1fr)] lg:border-x lg:border-white/[0.06]`}>
            <div className="flex items-center border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 xl:px-12">
              <SignalLabel>Capabilities</SignalLabel>
            </div>

            {disciplines.map(({ title, description }, index) => (
              <div
                key={title}
                className={`px-5 py-6 sm:px-8 lg:px-8 lg:py-7 xl:px-10 ${
                  index < disciplines.length - 1 ? "border-b border-white/[0.08] lg:border-b-0 lg:border-r" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-px w-5 bg-[#daa000]/65" aria-hidden="true" />
                  <h3 className="text-xl font-medium tracking-[-0.03em] sm:text-2xl">{title}</h3>
                </div>
                <p className="mt-2.5 max-w-sm text-sm leading-6 text-[#8f8a81]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} grid lg:grid-cols-[1.12fr_0.88fr] lg:border-x lg:border-white/[0.06]`}>
            <div className="relative min-h-[390px] overflow-hidden border-b border-white/[0.08] lg:min-h-[500px] lg:border-b-0 lg:border-r">
              <Image
                src="/industry_ins.jpg"
                alt="Embedded Systems @ Purdue workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover opacity-[0.82] grayscale-[8%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/14" />
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
                        <p className="truncate text-sm font-medium tracking-[-0.01em] text-[#ded8cd] sm:text-base">
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
          <div className={`${WIDE_RAIL} relative min-h-[370px] overflow-hidden lg:border-x lg:border-white/[0.06]`}>
            <Image
              src="/founders.jpeg"
              alt="Embedded Systems @ Purdue community"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-[0.52] grayscale-[10%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a09] via-[#0a0a09]/68 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09]/82 via-transparent to-[#0a0a09]/14" />

            <div className="relative flex min-h-[370px] items-end px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-2xl">
                <SignalLabel>Community</SignalLabel>
                <h2 className="mt-4 text-balance text-[clamp(2.65rem,4.8vw,4.7rem)] font-medium leading-[0.91] tracking-[-0.055em]">
                  Meet the people building it.
                </h2>
                <Link
                  href="/team"
                  className="group mt-6 inline-flex items-center gap-2 font-mono text-[0.63rem] uppercase tracking-[0.16em] text-[#c3bcb0] transition-colors hover:text-[#f2c34f]"
                >
                  Team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} grid lg:grid-cols-[0.92fr_1.08fr] lg:border-x lg:border-white/[0.06]`}>
            <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:border-b-0 lg:border-r lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-2xl">
                <SignalLabel>Schedule</SignalLabel>
                <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">What&apos;s next</h2>

                <div className="mt-6 border-t border-white/[0.08]">
                  <a
                    href="https://calendar.google.com/calendar/render?cid=embedded%40purdue.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-6 border-b border-white/[0.08] py-4"
                  >
                    <div>
                      <p className="text-base font-medium">Events and meetings</p>
                      <p className="mt-1 text-sm text-[#77736b]">Google Calendar</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#a9a397] transition-colors group-hover:text-[#f2c34f]" aria-hidden="true" />
                  </a>
                  <a
                    href="https://calendar.google.com/calendar/ical/embedded%40purdue.edu/public/basic.ics"
                    className="group flex items-center justify-between gap-6 py-4"
                  >
                    <div>
                      <p className="text-base font-medium">Subscribe</p>
                      <p className="mt-1 text-sm text-[#77736b]">iCal feed</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#a9a397] transition-colors group-hover:text-[#f2c34f]" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
              <div className="max-w-2xl">
                <SignalLabel>Join</SignalLabel>
                <h2 className="mt-4 text-[clamp(2.85rem,5vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Build with us.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-7 text-[#969188]">
                  Join a project, come to a workshop, or bring something you want to build.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 bg-[#daa000] px-5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-[#11110f] transition-colors hover:bg-[#efbd27]"
                  >
                    Join Discord
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/sponsors"
                    className="group inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#aaa398] transition-colors hover:text-[#f2c34f]"
                  >
                    Industry & sponsors
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="bg-[#0c0c0b] opacity-[var(--landing-content-opacity)] transition-opacity duration-[1100ms] ease-out">
        <Footer />
      </div>
    </div>
  )
}
