import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CircuitBoard,
  Cpu,
  Mail,
  Network,
  Radio,
  Trophy,
  Users,
  Wrench,
} from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

const mission = [
  {
    index: "01",
    title: "Hands-on learning",
    detail: "Turn embedded systems concepts into working hardware through technical projects and real debugging.",
    icon: CircuitBoard,
  },
  {
    index: "02",
    title: "Engineering community",
    detail: "Work alongside students who care about hardware, firmware, systems, and the craft of making them work together.",
    icon: Users,
  },
  {
    index: "03",
    title: "Professional growth",
    detail: "Build technical depth while gaining access to industry perspectives, alumni connections, and research opportunities.",
    icon: Cpu,
  },
]

const activities = [
  {
    index: "A01",
    title: "Technical workshops",
    detail: "Microcontrollers, RTOS, debugging, PCB design, and the tools used to bring embedded systems to life.",
    icon: Wrench,
  },
  {
    index: "A02",
    title: "Project teams",
    detail: "Build complete systems spanning robotics, sensing, controls, IoT, firmware, and custom hardware.",
    icon: CircuitBoard,
  },
  {
    index: "A03",
    title: "Speaker events",
    detail: "Learn from engineers and technical leaders working across embedded systems and adjacent industries.",
    icon: Radio,
  },
  {
    index: "A04",
    title: "Competitions",
    detail: "Test systems under real constraints through national events, hackathons, and internal engineering challenges.",
    icon: Trophy,
  },
  {
    index: "A05",
    title: "Mentorship",
    detail: "Get technical advice, project guidance, and career context from experienced members and mentors.",
    icon: Network,
  },
]

const reasons = [
  "Build a portfolio of embedded projects that demonstrates real systems work.",
  "Develop technical skills that transfer directly into engineering teams and research labs.",
  "Find collaborators who care about hardware and low-level software as much as you do.",
  "Access internal opportunities, alumni connections, and a stronger technical network.",
]

function SignalLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
      <span>{children}</span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="flex min-h-[470px] flex-col justify-between border-b border-white/[0.08] px-5 py-10 sm:px-8 sm:py-12 lg:col-span-7 lg:min-h-[610px] lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="flex items-center justify-between gap-4">
                  <SignalLabel>About ES@P</SignalLabel>
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#55524d]">
                    West Lafayette · Indiana
                  </span>
                </div>

                <div className="max-w-4xl py-12 lg:py-16">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.19em] text-[#6f6a62]">Student organization / embedded systems</p>
                  <h1 className="mt-5 text-[clamp(3.8rem,8.1vw,8.4rem)] font-medium leading-[0.82] tracking-[-0.07em] text-[#f3efe6]">
                    Build the
                    <span className="block text-[#d8aa27]">whole system.</span>
                  </h1>
                  <p className="mt-8 max-w-2xl text-[clamp(1rem,1.35vw,1.28rem)] leading-8 text-[#989289]">
                    Embedded Systems @ Purdue is a student organization built around learning by doing—bringing hardware,
                    firmware, controls, and systems engineering together in projects that have to work in the real world.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Join ES@P
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/projects"
                    className="group inline-flex h-11 items-center gap-3 border border-white/[0.12] px-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#c7c0b5] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                  >
                    View projects
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[460px] overflow-hidden lg:col-span-5 lg:min-h-[610px]">
                <Image
                  src="/founders.jpeg"
                  alt="Embedded Systems @ Purdue members"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover opacity-[0.76] grayscale-[18%]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/28" />
                <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 border-t border-white/[0.12] bg-black/74 backdrop-blur-sm">
                  <div className="border-r border-white/[0.1] px-5 py-5 sm:px-7">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.17em] text-[#6f6a62]">Community</p>
                    <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f0ece2]">100+ members</p>
                  </div>
                  <div className="px-5 py-5 sm:px-7">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.17em] text-[#6f6a62]">Focus</p>
                    <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f0ece2]">Build + learn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-5 border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-12 xl:px-16">
              <div>
                <SignalLabel>01 / Mission</SignalLabel>
                <h2 className="mt-3 text-[clamp(2.8rem,5vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  Learn by building.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">
                ES@P exists to make embedded engineering tangible: design it, wire it, flash it, debug it, and understand why it works.
              </p>
            </div>

            <div className="grid gap-px bg-white/[0.08] md:grid-cols-3">
              {mission.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.index} className="group min-h-[290px] bg-[#11110f] px-5 py-7 transition-colors hover:bg-[#151512] sm:px-8 lg:px-9 lg:py-9">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#68645d]">{item.index}</span>
                      <Icon className="h-5 w-5 text-[#9d7b1f] transition-colors group-hover:text-[#e0ad27]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-16 text-2xl font-medium tracking-[-0.045em] text-[#ece7dc]">{item.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-[#827d74]">{item.detail}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#090908]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="lg:sticky lg:top-[108px]">
                  <SignalLabel>02 / What we do</SignalLabel>
                  <h2 className="mt-4 text-[clamp(2.8rem,4.5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                    Engineering is a team sport.
                  </h2>
                  <p className="mt-6 max-w-sm text-sm leading-6 text-[#817c73]">
                    The club is structured around repeated exposure to real technical work: learn a system, build a system, explain a system, then help someone else do the same.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                {activities.map((item) => {
                  const Icon = item.icon
                  return (
                    <article
                      key={item.index}
                      className="group grid min-h-[170px] border-b border-white/[0.08] px-5 py-7 transition-colors last:border-b-0 hover:bg-white/[0.018] sm:grid-cols-[86px_1fr_auto] sm:items-center sm:px-8 lg:px-10"
                    >
                      <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">{item.index}</span>
                      <div className="mt-5 sm:mt-0">
                        <h3 className="text-2xl font-medium tracking-[-0.045em] text-[#e9e4da]">{item.title}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f7a72]">{item.detail}</p>
                      </div>
                      <Icon className="mt-6 h-5 w-5 text-[#766021] transition-colors group-hover:text-[#daa000] sm:mt-0" aria-hidden="true" />
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <SignalLabel>03 / Why join</SignalLabel>
                <h2 className="mt-4 max-w-xl text-[clamp(3rem,5.2vw,5.8rem)] font-medium leading-[0.88] tracking-[-0.065em]">
                  Get better by making things real.
                </h2>
              </div>

              <div className="lg:col-span-7">
                {reasons.map((reason, index) => (
                  <div key={reason} className="grid min-h-[126px] grid-cols-[54px_1fr] border-b border-white/[0.08] px-5 py-7 last:border-b-0 sm:grid-cols-[84px_1fr] sm:px-8 lg:px-10">
                    <span className="font-mono text-[0.56rem] tracking-[0.17em] text-[#5f5b55]">0{index + 1}</span>
                    <p className="max-w-2xl text-lg leading-7 tracking-[-0.025em] text-[#c4beb4]">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-11 sm:px-8 lg:col-span-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <SignalLabel>04 / Get involved</SignalLabel>
                <h2 className="mt-4 max-w-4xl text-[clamp(3.2rem,6vw,6.6rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                  Come build something that has to work.
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                  Project teams typically recruit at the start of each semester. Workshops and events are announced through Discord and the club mailing list.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="https://discord.gg/MkPv9s9cj3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Join Discord
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/projects"
                    className="group inline-flex h-11 items-center gap-3 border border-white/[0.12] px-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#c7c0b5] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                  >
                    Explore projects
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-between px-5 py-11 sm:px-8 lg:col-span-4 lg:px-10 lg:py-14">
                <div>
                  <p className="font-mono text-[0.57rem] uppercase tracking-[0.18em] text-[#5f5b55]">Contact channel</p>
                  <a
                    href="mailto:embedded@purdue.edu"
                    className="group mt-5 flex items-center justify-between border-y border-white/[0.08] py-5 text-lg tracking-[-0.03em] text-[#c9c3b8] transition-colors hover:text-[#f2c34f]"
                  >
                    embedded@purdue.edu
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <Link
                  href="https://www.linkedin.com/company/embedded-purdue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-12 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#77726a] transition-colors hover:text-[#f2c34f]"
                >
                  Follow on LinkedIn
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
