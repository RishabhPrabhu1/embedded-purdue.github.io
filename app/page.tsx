import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircuitBoard,
  Cpu,
  Radio,
  Wrench,
} from "lucide-react"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { PcbHero } from "@/components/landing/pcb-hero"
import { projects } from "@/app/projects/_data"

const featuredSlugs = new Set(["harmonicore", "slayterhil", "bb8"])
const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug))
const activeProjects = projects.filter((project) => project.status === "Active")

const disciplines = [
  {
    index: "01",
    title: "Hardware",
    description: "Schematic capture, PCB layout, sensors, power, board bring-up, and the physical constraints software eventually meets.",
    icon: CircuitBoard,
  },
  {
    index: "02",
    title: "Firmware",
    description: "Microcontrollers, RTOS work, peripherals, control loops, and low-level code written for real hardware.",
    icon: Cpu,
  },
  {
    index: "03",
    title: "Systems",
    description: "FPGA, wireless, robotics, DSP, tooling, and the integration work that turns subsystems into something shippable.",
    icon: Radio,
  },
]

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[#b9b3a8]">
      <span className="text-[#daa000]">{index}</span>
      <span className="h-px w-8 bg-[#daa000]/45" />
      <span>{label}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#11110f] text-[#f3efe6]">
      <Navigation />
      <PcbHero />

      <main id="landing-content">
        <section className="border-b border-white/[0.09]">
          <div className="mx-auto grid max-w-[1440px] px-5 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-12 xl:px-16">
            <div className="border-white/[0.09] py-20 lg:border-r lg:py-28 lg:pr-16">
              <SectionLabel index="01" label="About" />
              <h2 className="mt-8 max-w-5xl text-balance text-[clamp(2.65rem,6vw,6.4rem)] font-medium leading-[0.93] tracking-[-0.055em]">
                A student-run lab for people who want to build closer to the metal.
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-7 text-[#aaa59b] sm:text-lg sm:leading-8">
                Embedded Systems @ Purdue brings hardware and software into the same room. Members learn by designing,
                debugging, integrating, and shipping systems that have to work outside a simulator.
              </p>
            </div>

            <div className="grid grid-cols-3 border-t border-white/[0.09] lg:grid-cols-1 lg:border-t-0">
              {[
                ["Founded", "2025"],
                ["Documented builds", String(projects.length)],
                ["Active projects", String(activeProjects.length)],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`flex min-h-32 flex-col justify-between py-5 lg:min-h-0 lg:flex-1 lg:px-8 lg:py-8 ${
                    index < 2 ? "border-r border-white/[0.09] lg:border-b lg:border-r-0" : ""
                  }`}
                >
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#77736b] sm:text-[0.65rem]">
                    {label}
                  </span>
                  <span className="mt-5 text-3xl font-medium tracking-[-0.04em] text-[#e6b625] sm:text-4xl lg:text-5xl">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.09] py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid items-end gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <SectionLabel index="02" label="Selected work" />
                <h2 className="mt-8 max-w-3xl text-balance text-[clamp(3rem,6.5vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Real systems.<br />Real constraints.
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="max-w-xl text-base leading-7 text-[#aaa59b] sm:text-lg sm:leading-8">
                  Project teams work across boards, firmware, signal processing, controls, wireless, and mechanical integration.
                  The point is not a polished tutorial. It is learning how a complete system fails—and how to make it work.
                </p>
                <Link
                  href="/projects"
                  className="group mt-7 inline-flex items-center gap-3 border-b border-[#daa000]/50 pb-2 font-mono text-xs uppercase tracking-[0.18em] text-[#e3d8c3] transition-colors hover:border-[#daa000] hover:text-[#f2c34f]"
                >
                  View all projects
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-16 grid gap-px bg-white/[0.09] md:grid-cols-12">
              {featuredProjects.map((project, index) => {
                const position =
                  index === 0
                    ? "md:col-span-7 md:row-span-2"
                    : index === 1
                      ? "md:col-span-5"
                      : "md:col-span-5"

                return (
                  <Link
                    key={project.slug}
                    href={project.readmeUrl || `/projects/${project.slug}`}
                    className={`group relative isolate min-h-[360px] overflow-hidden bg-[#171713] ${position} ${
                      index === 0 ? "md:min-h-[720px]" : "md:min-h-[359px]"
                    }`}
                  >
                    <Image
                      src={project.image || "/projects/logo.png"}
                      alt={project.title}
                      fill
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                      className="object-cover opacity-72 grayscale-[15%] transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-90 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/10" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/65">
                        {project.status} / {project.semester}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/65 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <h3 className={`${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"} font-medium tracking-[-0.045em]`}>
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/67 sm:text-base">
                        {project.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#e5c66d]">
                        {project.technologies.slice(0, 4).map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.09] bg-[#151512]">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
              <div className="py-20 lg:border-r lg:border-white/[0.09] lg:py-28 lg:pr-14">
                <SectionLabel index="03" label="What we work on" />
                <h2 className="mt-8 text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                  Hardware is the beginning, not the boundary.
                </h2>
              </div>

              <div className="border-t border-white/[0.09] lg:border-t-0">
                {disciplines.map(({ index, title, description, icon: Icon }, row) => (
                  <div
                    key={title}
                    className={`group grid gap-7 py-9 lg:grid-cols-[90px_1fr_1.3fr] lg:items-center lg:px-12 ${
                      row < disciplines.length - 1 ? "border-b border-white/[0.09]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-[#77736b]">{index}</span>
                      <Icon className="h-5 w-5 text-[#daa000]" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{title}</h3>
                    <p className="max-w-xl text-sm leading-6 text-[#99958c] sm:text-base sm:leading-7">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.09] py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
            <SectionLabel index="04" label="Learn / build / repeat" />

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <div className="relative aspect-[5/4] overflow-hidden bg-[#1b1a16]">
                  <Image
                    src="/industry_ins.jpg"
                    alt="Embedded Systems @ Purdue workshop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/75 sm:bottom-7 sm:left-7">
                    Workshops / technical sessions / member-led learning
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 lg:pl-8">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#daa000]">Workshops</span>
                <h2 className="mt-5 text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-6xl">
                  Learn enough to start. Build enough to understand.
                </h2>
                <p className="mt-7 max-w-lg text-base leading-7 text-[#aaa59b]">
                  Workshops lower the barrier to embedded work, then project teams take over. Members move from fundamentals to
                  design decisions, integration problems, and hardware that has to survive contact with reality.
                </p>
                <Link
                  href="/workshops"
                  className="group mt-9 inline-flex h-12 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#12110e] transition-colors hover:bg-[#efbd27]"
                >
                  Explore workshops
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-white/[0.09]">
          <div className="relative min-h-[620px] overflow-hidden">
            <Image
              src="/founders.jpeg"
              alt="Embedded Systems @ Purdue community"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#11110f] via-[#11110f]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11110f] via-transparent to-[#11110f]/25" />

            <div className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-end px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:px-12 xl:px-16">
              <div className="max-w-3xl">
                <SectionLabel index="05" label="Community" />
                <h2 className="mt-8 text-balance text-[clamp(3.4rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                  Built by students who like making things work.
                </h2>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-3 bg-[#f2eee4] px-5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-white"
                  >
                    Join Discord
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/team"
                    className="inline-flex h-12 items-center gap-3 border border-white/20 bg-black/20 px-5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white transition-colors hover:border-[#daa000]/60 hover:text-[#f2c34f]"
                  >
                    Meet the team
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.09] bg-[#daa000] text-[#11110f]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1fr]">
            <div className="px-5 py-20 sm:px-8 sm:py-24 lg:border-r lg:border-black/15 lg:px-12 xl:px-16">
              <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-black/55">
                <span>06</span>
                <span className="h-px w-8 bg-black/30" />
                <span>Calendar</span>
              </div>
              <h2 className="mt-8 max-w-3xl text-[clamp(3rem,6vw,6.4rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                See what&apos;s happening next.
              </h2>
            </div>

            <div className="border-t border-black/15 lg:border-t-0">
              <a
                href="https://calendar.google.com/calendar/render?cid=embedded%40purdue.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-36 items-center justify-between gap-6 border-b border-black/15 px-5 py-8 transition-colors hover:bg-black/[0.06] sm:px-8 lg:px-12"
              >
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-black/50">Google Calendar</span>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.035em]">Events, workshops, and meetings</p>
                </div>
                <CalendarDays className="h-7 w-7 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
              <a
                href="https://calendar.google.com/calendar/ical/embedded%40purdue.edu/public/basic.ics"
                className="group flex min-h-36 items-center justify-between gap-6 border-b border-black/15 px-5 py-8 transition-colors hover:bg-black/[0.06] sm:px-8 lg:px-12"
              >
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-black/50">iCal</span>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.035em]">Subscribe on your own calendar</p>
                </div>
                <ArrowUpRight className="h-7 w-7 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.5} />
              </a>
              <Link
                href="/workshops"
                className="group flex min-h-36 items-center justify-between gap-6 px-5 py-8 transition-colors hover:bg-black/[0.06] sm:px-8 lg:px-12"
              >
                <div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-black/50">Archive</span>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.035em]">Browse workshop material</p>
                </div>
                <ArrowRight className="h-7 w-7 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-28 sm:px-8 sm:py-36 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <SectionLabel index="07" label="Join" />
                <h2 className="mt-8 max-w-5xl text-balance text-[clamp(4rem,9vw,9.5rem)] font-medium leading-[0.82] tracking-[-0.075em]">
                  Build<br />with us.
                </h2>
              </div>
              <div className="pb-2 lg:justify-self-end">
                <p className="max-w-lg text-base leading-7 text-[#aaa59b] sm:text-lg sm:leading-8">
                  Start with a workshop, join a project team, or just show up with a problem you want to solve.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center gap-3 bg-[#daa000] px-6 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.17em] text-[#11110f] transition-colors hover:bg-[#efbd27]"
                  >
                    Join ES@P
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/sponsors"
                    className="inline-flex h-13 items-center gap-3 border border-white/15 px-6 font-mono text-[0.7rem] uppercase tracking-[0.17em] text-[#d2cdc3] transition-colors hover:border-[#daa000]/55 hover:text-[#f2c34f]"
                  >
                    Industry & sponsors
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-24 grid gap-px bg-white/[0.09] sm:grid-cols-3">
              {[
                [Wrench, "Learn", "Workshops establish the fundamentals."],
                [CircuitBoard, "Build", "Project teams turn them into hardware."],
                [ArrowUpRight, "Ship", "Demo, document, and move the system forward."],
              ].map(([Icon, title, description]) => {
                const Component = Icon as typeof Wrench
                return (
                  <div key={String(title)} className="bg-[#11110f] p-7 sm:min-h-48 sm:p-8">
                    <Component className="h-5 w-5 text-[#daa000]" strokeWidth={1.5} />
                    <h3 className="mt-10 text-2xl font-medium tracking-[-0.035em]">{String(title)}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#88847c]">{String(description)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
