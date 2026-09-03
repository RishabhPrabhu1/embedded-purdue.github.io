import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  Check,
  CircuitBoard,
  Cpu,
  Handshake,
  Mail,
  Presentation,
  Users,
} from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

type Sponsor = {
  name: string
  logo?: string
  website?: string
  description?: string
  tier: "Platinum" | "Gold" | "Silver" | "Bronze"
}

const sponsors: Sponsor[] = []

const sponsorshipTiers = [
  {
    name: "Platinum",
    amount: "$5,000+",
    code: "P01",
    benefits: [
      "Logo on all club materials and website",
      "Dedicated recruiting events",
      "Access to student resumes",
      "Speaking opportunities at meetings",
      "Priority project collaboration",
    ],
  },
  {
    name: "Gold",
    amount: "$2,500+",
    code: "G02",
    benefits: [
      "Logo on website and select materials",
      "Recruiting table at events",
      "Access to student resumes",
      "Speaking opportunities",
      "Project collaboration opportunities",
    ],
  },
  {
    name: "Silver",
    amount: "$1,000+",
    code: "S03",
    benefits: [
      "Logo on website",
      "Recruiting presence at events",
      "Access to student contact info",
      "Newsletter mentions",
    ],
  },
  {
    name: "Bronze",
    amount: "$500+",
    code: "B04",
    benefits: ["Logo on website", "Newsletter mentions", "Event announcements"],
  },
] as const

const partnershipModes = [
  {
    index: "01",
    title: "Fund the build",
    detail: "Support components, dev boards, fabrication, travel, and workshop supplies that turn project plans into working systems.",
    icon: CircuitBoard,
  },
  {
    index: "02",
    title: "Put tools in students' hands",
    detail: "Donate MCUs, FPGAs, instruments, dev kits, or other equipment members can learn on and ship projects with.",
    icon: Cpu,
  },
  {
    index: "03",
    title: "Teach with us",
    detail: "Co-host a workshop, technical talk, design review, or challenge around the engineering your team does every day.",
    icon: Presentation,
  },
  {
    index: "04",
    title: "Meet builders early",
    detail: "Share internships, co-ops, and technical roles with students already building hardware and low-level software together.",
    icon: Users,
  },
]

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-11 sm:px-8 lg:col-span-8 lg:min-h-[500px] lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-16">
                  <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                    Industry partnerships
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Sponsor ES@P / Build Purdue engineers</p>
                    <h1 className="mt-5 text-[clamp(4rem,8vw,8.2rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Back the
                      <span className="block text-[#d8aa27]">people who build.</span>
                    </h1>
                    <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                      ES@P gives students room to design, break, debug, and ship real embedded systems. Partners help us put better tools, harder problems, and stronger industry connections in front of them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-[300px] grid-cols-2 lg:col-span-4 lg:min-h-[500px] lg:grid-cols-1">
                <div className="flex flex-col justify-between border-r border-white/[0.08] px-5 py-7 sm:px-8 lg:border-b lg:border-r-0 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Active community</span>
                  <div>
                    <Users className="h-7 w-7 text-[#967723]" aria-hidden="true" />
                    <span className="mt-3 block text-[clamp(2.8rem,6vw,5rem)] font-medium tracking-[-0.065em] text-[#e9e4da]">50+</span>
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-[#6d6861]">members</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Project surface</span>
                  <div>
                    <CircuitBoard className="h-7 w-7 text-[#967723]" aria-hidden="true" />
                    <span className="mt-3 block text-[clamp(2.8rem,6vw,5rem)] font-medium tracking-[-0.065em] text-[#d8aa27]">10+</span>
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-[#6d6861]">hardware / software builds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-10 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="lg:sticky lg:top-[108px]">
                  <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                    <Handshake className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                    01 / Partnership model
                  </div>
                  <h2 className="mt-4 text-[clamp(2.9rem,4.7vw,5rem)] font-medium leading-[0.89] tracking-[-0.06em]">
                    More useful than a logo on a page.
                  </h2>
                  <p className="mt-6 max-w-sm text-sm leading-6 text-[#817c74]">
                    The strongest partnerships give students resources, technical exposure, and direct contact with people building real products.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                {partnershipModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <article
                      key={mode.index}
                      className="group grid min-h-[180px] border-b border-white/[0.08] px-5 py-7 transition-colors last:border-b-0 hover:bg-white/[0.018] sm:grid-cols-[76px_1fr_auto] sm:items-center sm:px-8 lg:px-10"
                    >
                      <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">{mode.index}</span>
                      <div className="mt-5 sm:mt-0">
                        <h3 className="text-2xl font-medium tracking-[-0.045em] text-[#e9e4da]">{mode.title}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f7a72]">{mode.detail}</p>
                      </div>
                      <Icon className="mt-6 h-5 w-5 text-[#766021] transition-colors group-hover:text-[#daa000] sm:mt-0" aria-hidden="true" />
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#090908]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-5 border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-12 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">02 / Current partners</p>
                <h2 className="mt-3 text-[clamp(2.8rem,5vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.06em]">Partner wall.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">Companies that support the students, systems, and technical programming behind ES@P.</p>
            </div>

            {sponsors.length === 0 ? (
              <div className="grid min-h-[320px] place-items-center px-5 py-12 text-center sm:px-8 lg:px-12">
                <div className="max-w-2xl">
                  <Building2 className="mx-auto h-7 w-7 text-[#806821]" aria-hidden="true" />
                  <p className="mt-5 font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#625e58]">Opening partner slot</p>
                  <h3 className="mt-4 text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[0.95] tracking-[-0.055em] text-[#ded8cd]">
                    Be the first company on the wall.
                  </h3>
                  <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#817c74]">
                    ES@P is actively seeking inaugural partners who want meaningful visibility and a direct relationship with Purdue students building embedded systems.
                  </p>
                  <a
                    href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry"
                    className="group mt-7 inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Start a conversation
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 lg:grid-cols-3">
                {sponsors.map((sponsor) => (
                  <article key={sponsor.name} className="min-h-[260px] bg-[#11110f] p-7">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#8c7125]">{sponsor.tier} partner</p>
                    <h3 className="mt-8 text-3xl font-medium tracking-[-0.05em] text-[#ebe6dc]">{sponsor.name}</h3>
                    {sponsor.description && <p className="mt-3 text-sm leading-6 text-[#817c74]">{sponsor.description}</p>}
                    {sponsor.website && (
                      <Link
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#9d958a] transition-colors hover:text-[#f2c34f]"
                      >
                        Visit partner
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="tiers" className="border-b border-white/[0.08] bg-[#0c0c0b] scroll-mt-20">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-5 border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-12 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">03 / Sponsorship tiers</p>
                <h2 className="mt-3 text-[clamp(2.8rem,5vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.06em]">Choose the level of access.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">Four starting points, from visible support to deeper recruiting and project collaboration.</p>
            </div>

            <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 xl:grid-cols-4">
              {sponsorshipTiers.map((tier, index) => (
                <article key={tier.name} className="group flex min-h-[430px] flex-col bg-[#11110f] p-6 transition-colors hover:bg-[#151512] sm:p-7">
                  <div className="flex items-center justify-between font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#625e58]">
                    <span>{tier.code}</span>
                    <span>0{index + 1} / 04</span>
                  </div>
                  <h3 className="mt-12 text-3xl font-medium tracking-[-0.05em] text-[#ebe6dc]">{tier.name}</h3>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#d8aa27]">{tier.amount}</p>

                  <ul className="mt-8 space-y-3 border-t border-white/[0.07] pt-5">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-sm leading-5 text-[#817c74]">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9c7b21]" aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-11 sm:px-8 lg:col-span-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#6b665f]">04 / Contact</p>
                <h2 className="mt-3 max-w-4xl text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                  Build a partnership around real engineering.
                </h2>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                  Tell us what your team cares about—recruiting, technical education, project collaboration, hardware support—and we’ll find the highest-value way to work together.
                </p>
              </div>

              <div className="flex flex-col justify-between px-5 py-9 sm:px-8 lg:col-span-4 lg:px-10 lg:py-12">
                <Mail className="h-6 w-6 text-[#8c7125]" aria-hidden="true" />
                <div className="mt-16">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#5f5b55]">Partnership inbox</p>
                  <a href="mailto:embedded@purdue.edu" className="mt-3 block text-xl tracking-[-0.03em] text-[#d8d2c7] transition-colors hover:text-[#f2c34f]">
                    embedded@purdue.edu
                  </a>
                  <a
                    href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry"
                    className="group mt-7 inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
                  >
                    Contact ES@P
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
