import type { CSSProperties, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { PcbHero } from "@/components/landing/pcb-hero"
import { projects } from "@/app/projects/_data"

const featuredSlugs = new Set(["harmonicore", "slayterhil", "bb8"])
const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug))

const disciplines = [
  {
    title: "Hardware",
    description: "Schematics, PCB layout, sensors, power, board bring-up, and the physical constraints every system inherits.",
  },
  {
    title: "Firmware",
    description: "Microcontrollers, peripherals, RTOS work, controls, and low-level code written against real hardware.",
  },
  {
    title: "Systems",
    description: "FPGA, wireless, robotics, DSP, tooling, and the integration work that makes the whole system behave.",
  },
]

function SignalLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_10px_rgba(244,198,77,0.42)]" />
      <span>{children}</span>
    </div>
  )
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
        <section className="border-b border-white/[0.08]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
            <div className="grid gap-8 border-b border-white/[0.08] pb-10 lg:grid-cols-[1fr_0.78fr] lg:items-end lg:pb-12">
              <div>
                <SignalLabel>Projects</SignalLabel>
                <h2 className="mt-5 text-[clamp(2.7rem,5.4vw,5.6rem)] font-medium leading-[0.91] tracking-[-0.055em]">
                  Selected work
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <p className="max-w-xl text-sm leading-6 text-[#99938a] sm:text-base sm:leading-7">
                  Member teams design, build, debug, and document complete embedded systems.
                </p>
                <Link
                  href="/projects"
                  className="group mt-5 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#c8c1b5] transition-colors hover:text-[#f2c34f]"
                >
                  All projects
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-px bg-white/[0.08] md:grid-cols-12">
              {featuredProjects.map((project, index) => {
                const position = index === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"

                return (
                  <Link
                    key={project.slug}
                    href={project.readmeUrl || `/projects/${project.slug}`}
                    className={`group relative isolate overflow-hidden bg-[#141411] ${position} ${
                      index === 0 ? "min-h-[430px] md:min-h-[650px]" : "min-h-[320px] md:min-h-[324px]"
                    }`}
                  >
                    <Image
                      src={project.image || "/projects/logo.png"}
                      alt={project.title}
                      fill
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                      className="object-cover opacity-[0.66] grayscale-[22%] transition duration-700 ease-out group-hover:scale-[1.018] group-hover:opacity-[0.82] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/12 to-black/20" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/55">
                        {project.status}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 text-white/55 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className={`${index === 0 ? "text-4xl sm:text-5xl" : "text-3xl"} font-medium tracking-[-0.045em]`}>
                        {project.title}
                      </h3>
                      <p className="mt-2 max-w-lg font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#d6b65d]">
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
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
              <div className="py-14 lg:border-r lg:border-white/[0.08] lg:py-[4.5rem] lg:pr-12">
                <SignalLabel>Capabilities</SignalLabel>
                <h2 className="mt-5 max-w-md text-4xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                  Across the stack.
                </h2>
              </div>

              <div className="border-t border-white/[0.08] lg:border-t-0">
                {disciplines.map(({ title, description }, index) => (
                  <div
                    key={title}
                    className={`grid gap-3 py-7 lg:grid-cols-[0.42fr_1fr] lg:items-start lg:px-10 lg:py-8 xl:px-12 ${
                      index < disciplines.length - 1 ? "border-b border-white/[0.08]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-px w-5 bg-[#daa000]/70" />
                      <h3 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{title}</h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-[#918c83] sm:text-base sm:leading-7">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[420px] overflow-hidden border-b border-white/[0.08] lg:min-h-[560px] lg:border-b-0 lg:border-r">
              <Image
                src="/industry_ins.jpg"
                alt="Embedded Systems @ Purdue workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover opacity-[0.78] grayscale-[12%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
            </div>

            <div className="flex items-center px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-16 xl:px-16">
              <div className="max-w-xl">
                <SignalLabel>Workshops</SignalLabel>
                <h2 className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                  Learn by building.
                </h2>
                <p className="mt-6 text-base leading-7 text-[#99938a]">
                  Technical sessions cover the fundamentals. Project teams turn them into design decisions, integration work, and working hardware.
                </p>
                <Link
                  href="/workshops"
                  className="group mt-7 inline-flex items-center gap-2 border-b border-[#daa000]/45 pb-1.5 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#d0c9bd] transition-colors hover:border-[#daa000] hover:text-[#f2c34f]"
                >
                  Workshop archive
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-b border-white/[0.08]">
          <div className="relative min-h-[520px] overflow-hidden">
            <Image
              src="/founders.jpeg"
              alt="Embedded Systems @ Purdue community"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-[0.52] grayscale-[10%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0b] via-[#0c0c0b]/72 to-[#0c0c0b]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0b]/90 via-transparent to-[#0c0c0b]/24" />

            <div className="relative mx-auto flex min-h-[520px] max-w-[1440px] items-end px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
              <div className="max-w-3xl">
                <SignalLabel>Community</SignalLabel>
                <h2 className="mt-5 text-balance text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Build with people who care how it works.
                </h2>
                <Link
                  href="/team"
                  className="group mt-7 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[#d3ccc0] transition-colors hover:text-[#f2c34f]"
                >
                  Meet the team
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
            <div className="border-b border-white/[0.08] px-5 py-14 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r lg:px-12 xl:px-16">
              <SignalLabel>Schedule</SignalLabel>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">What&apos;s next</h2>

              <div className="mt-8 border-t border-white/[0.08]">
                <a
                  href="https://calendar.google.com/calendar/render?cid=embedded%40purdue.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-6 border-b border-white/[0.08] py-5"
                >
                  <div>
                    <p className="text-base font-medium">Events and meetings</p>
                    <p className="mt-1 text-sm text-[#77736b]">Google Calendar</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#a9a397] transition-colors group-hover:text-[#f2c34f]" aria-hidden="true" />
                </a>
                <a
                  href="https://calendar.google.com/calendar/ical/embedded%40purdue.edu/public/basic.ics"
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <div>
                    <p className="text-base font-medium">Subscribe</p>
                    <p className="mt-1 text-sm text-[#77736b]">iCal feed</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#a9a397] transition-colors group-hover:text-[#f2c34f]" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="flex items-center px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
              <div className="max-w-xl">
                <SignalLabel>Join</SignalLabel>
                <h2 className="mt-5 text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Build with us.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-[#99938a]">
                  Join a project, come to a workshop, or bring something you want to build.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
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
