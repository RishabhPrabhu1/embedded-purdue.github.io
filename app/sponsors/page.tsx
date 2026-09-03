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
import { SiteTelemetry } from "@/components/site/site-telemetry"

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
  const telemetry = [
    { label: "Community", value: "50+", detail: "active members" },
    { label: "Builds", value: "10+", detail: "hardware / software", accent: true },
    { label: "Partner modes", value: partnershipModes.length, detail: "ways to engage" },
    { label: "Entry tier", value: "$500", detail: "bronze starting point" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-7 lg:min-h-[430px] lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                      Industry partnerships
                    </div>
                    <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#4f4b45] sm:block">
                      Students ↔ industry
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Sponsor ES@P / build Purdue engineers</p>
                    <h1 className="mt-4 text-[clamp(3.7rem,7vw,7.3rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Back the
                      <span className="block text-[#d8aa27]">people who build.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#8d887f]">
                      Partners put better tools, harder problems, and stronger technical connections in front of students who are already designing and shipping real systems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[330px] overflow-hidden bg-[#080807] lg:col-span-5 lg:min-h-[430px]">
                <img
                  src="/industry_ins.jpg"
                  alt="ES@P industry engagement"
                  className="h-full w-full object-cover opacity-[0.7] grayscale-[18%] saturate-[0.78]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.2),transparent_34%,rgba(0,0,0,.86))]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.18),transparent_52%)]" />
                <div className="absolute left-0 top-0 border-b border-r border-white/[0.09] bg-black/58 px-4 py-3 backdrop-blur-sm">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#8d887f]">Partner interface</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.1] bg-black/68 px-5 py-4 backdrop-blur-sm sm:px-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-[#756f67]">Partnership principle</p>
                      <p className="mt-1 text-lg font-medium tracking-[-0.035em] text-[#e0dbd1]">Access should create technical value.</p>
                    </div>
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-[#8d7328]">IND / 01</span>
                  </div>
                </div>
              </div>
            </div>

            <SiteTelemetry items={telemetry} variant="rail" />
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="lg:sticky lg:top-[108px]">
                  <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                    <Handshake className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                    01 / Partnership model
                  </div>
                  <h2 className="mt-4 text-[clamp(2.7rem,4.4vw,4.6rem)] font-medium leading-[0.89] tracking-[-0.06em]">
                    More useful than a logo on a page.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-[#817c74]">
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
                      className="group grid min-h-[145px] border-b border-white/[0.08] px-5 py-6 transition-colors last:border-b-0 hover:bg-white/[0.018] sm:grid-cols-[72px_1fr_auto] sm:items-center sm:px-8 lg:px-10"
                    >
                      <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">{mode.index}</span>
                      <div className="mt-4 sm:mt-0">
                        <h3 className="text-2xl font-medium tracking-[-0.045em] text-[#e9e4da]">{mode.title}</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f7a72]">{mode.detail}</p>
                      </div>
                      <Icon className="mt-5 h-5 w-5 text-[#766021] transition-colors group-hover:text-[#daa000] sm:mt-0" aria-hidden="true" />
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 xl:px-16">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">02 / Current partners</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.045em] text-[#d8d2c7]">Partner wall</h2>
              </div>

              <div className="lg:col-span-8">
                {sponsors.length === 0 ? (
                  <div className="grid gap-5 px-5 py-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-8 lg:px-10">
                    <Building2 className="h-6 w-6 text-[#806821]" aria-hidden="true" />
                    <div>
                      <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#8d7328]">Opening partner slot</p>
                      <p className="mt-2 max-w-xl text-lg leading-7 tracking-[-0.025em] text-[#aaa49a]">
                        We are actively seeking inaugural partners who want direct access to Purdue students building embedded systems.
                      </p>
                    </div>
                    <a
                      href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry"
                      className="group inline-flex h-10 w-fit items-center gap-3 border border-[#daa000]/35 px-4 font-mono text-[0.57rem] uppercase tracking-[0.14em] text-[#d3ab3f] transition-colors hover:border-[#daa000]/65 hover:text-[#f2c34f]"
                    >
                      Be first
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 lg:grid-cols-3">
                    {sponsors.map((sponsor) => (
                      <article key={sponsor.name} className="bg-[#0c0c0b] p-7">
                        <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#8c7125]">{sponsor.tier} partner</p>
                        <h3 className="mt-6 text-3xl font-medium tracking-[-0.05em] text-[#ebe6dc]">{sponsor.name}</h3>
                        {sponsor.description && <p className="mt-3 text-sm leading-6 text-[#817c74]">{sponsor.description}</p>}
                        {sponsor.website && (
                          <Link
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#9d958a] transition-colors hover:text-[#f2c34f]"
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
            </div>
          </div>
        </section>

        <section id="tiers" className="border-b border-white/[0.08] bg-[#0c0c0b] scroll-mt-20">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-4 border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-10 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">03 / Sponsorship tiers</p>
                <h2 className="mt-3 text-[clamp(2.6rem,4.6vw,4.9rem)] font-medium leading-[0.9] tracking-[-0.06em]">Choose the level of access.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#817c73]">Four starting points, from visible support to deeper recruiting and project collaboration.</p>
            </div>

            <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 xl:grid-cols-4">
              {sponsorshipTiers.map((tier, index) => (
                <article key={tier.name} data-site-lift="card" className="group flex flex-col bg-[#0c0c0b] p-6 transition-colors hover:bg-[#11110f] sm:p-7">
                  <div className="flex items-center justify-between font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#625e58]">
                    <span>{tier.code}</span>
                    <span>0{index + 1} / 04</span>
                  </div>
                  <h3 className="mt-8 text-3xl font-medium tracking-[-0.05em] text-[#ebe6dc]">{tier.name}</h3>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#d8aa27]">{tier.amount}</p>

                  <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-5">
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
              <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#6b665f]">04 / Contact</p>
                <h2 className="mt-3 max-w-4xl text-[clamp(2.8rem,5.2vw,5.6rem)] font-medium leading-[0.86] tracking-[-0.065em]">
                  Build a partnership around real engineering.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#8d887f]">
                  Tell us what your team cares about—recruiting, technical education, project collaboration, hardware support—and we’ll find the highest-value way to work together.
                </p>
              </div>

              <div className="flex flex-col justify-between px-5 py-8 sm:px-8 lg:col-span-4 lg:px-10 lg:py-10">
                <Mail className="h-6 w-6 text-[#8c7125]" aria-hidden="true" />
                <div className="mt-10">
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-[#5f5b55]">Partnership inbox</p>
                  <a href="mailto:embedded@purdue.edu" className="mt-3 block text-xl tracking-[-0.03em] text-[#d8d2c7] transition-colors hover:text-[#f2c34f]">
                    embedded@purdue.edu
                  </a>
                  <a
                    href="mailto:embedded@purdue.edu?subject=ES@P%20Sponsorship%20Inquiry"
                    className="group mt-6 inline-flex h-11 items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
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
