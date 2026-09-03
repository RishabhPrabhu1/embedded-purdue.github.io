import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail, Shield, Users } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { SiteTelemetry } from "@/components/site/site-telemetry"

import armanImg from "../../public/team/arman.jpg"
import asthaImg from "../../public/team/astha.jpg"
import patrickImg from "../../public/team/patrick.jpg"
import gautamImg from "../../public/team/gautam.jpg"
import mahdiImg from "../../public/team/mahdi.jpg"

type Member = {
  name: string
  role: string
  email?: string
  linkedin?: string
  github?: string
  image?: StaticImageData
}

const executives: Member[] = [
  { name: "Arman Islam", role: "President", linkedin: "https://www.linkedin.com/in/thomascon/", image: armanImg },
  { name: "Astha Patel", role: "Vice President", linkedin: "https://www.linkedin.com/in/astha-p/", image: asthaImg },
  { name: "Patrick Jordan", role: "Treasurer", image: patrickImg },
  { name: "Gautam Aravindan", role: "Development Engineer", linkedin: "https://www.linkedin.com/in/gautamaravindan/", image: gautamImg },
  { name: "Mahdi El Husseini", role: "Executive Engineer", linkedin: "https://www.linkedin.com/in/mahdi-el-husseini/", image: mahdiImg },
]

const pendingRoles = [
  {
    code: "02",
    title: "Chairs",
    status: "Appointments pending",
    detail: "Chair assignments will publish when the next operating cycle is finalized.",
  },
  {
    code: "03",
    title: "Project Managers",
    status: "Roster incoming",
    detail: "Project-manager assignments will publish alongside the next project cycle.",
  },
] as const

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function HeroPortrait({ member, className }: { member: Member; className?: string }) {
  return (
    <div className={`group relative min-h-0 overflow-hidden bg-[#090908] ${className ?? ""}`}>
      {member.image && (
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 1024px) 50vw, 22vw"
          className="object-cover object-top opacity-[0.78] grayscale-[22%] transition duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-[0.94] group-hover:grayscale-0"
          placeholder="blur"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/86 via-transparent to-black/20" />
      <div className="absolute inset-x-0 bottom-0 px-3 py-3 sm:px-4">
        <p className="font-mono text-[0.46rem] uppercase tracking-[0.14em] text-[#8d7328]">{member.role}</p>
        <p className="mt-1 text-sm font-medium tracking-[-0.03em] text-[#e4ded4]">{member.name}</p>
      </div>
    </div>
  )
}

function MemberDirectoryRow({ member, index }: { member: Member; index: number }) {
  const socialLinkClass =
    "grid h-8 w-8 place-items-center border border-white/[0.08] text-[#777169] transition-colors hover:border-[#daa000]/35 hover:text-[#f2c34f]"
  const hasLinks = Boolean(member.email || member.linkedin || member.github)

  return (
    <article
      data-site-lift="card"
      className="group grid min-h-[96px] gap-4 border-b border-white/[0.08] px-5 py-5 transition-colors last:border-b-0 hover:bg-white/[0.018] sm:grid-cols-[56px_1.15fr_1fr_auto] sm:items-center sm:px-8 lg:px-10"
    >
      <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#5f5b55]">
        E-{String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-xl font-medium tracking-[-0.04em] text-[#e5dfd5]">{member.name}</h3>
        <p className="mt-1 font-mono text-[0.49rem] uppercase tracking-[0.13em] text-[#5f5a53]">Executive board</p>
      </div>
      <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#9b7a24]">{member.role}</p>
      <div className="flex min-w-[72px] items-center justify-start gap-2 sm:justify-end">
        {member.email && (
          <a href={member.email} aria-label={`Email ${member.name}`} className={socialLinkClass}>
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className={socialLinkClass}
          >
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on GitHub`}
            className={socialLinkClass}
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {!hasLinks && <span className="font-mono text-[0.47rem] uppercase tracking-[0.12em] text-[#4f4b45]">Record</span>}
      </div>
    </article>
  )
}

export default function TeamPage() {
  const telemetry = [
    { label: "Executives", value: executives.length, detail: "current board", accent: true },
    { label: "Cycle", value: "2026", detail: "leadership year" },
    { label: "Operating", value: "Student-led", detail: "club structure" },
    { label: "Next", value: "Chairs + PMs", detail: "appointments pending" },
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
                      Team directory
                    </div>
                    <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#4f4b45] sm:block">
                      Leadership / operations / projects
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">People / technical ownership</p>
                    <h1 className="mt-4 text-[clamp(3.7rem,7vw,7.3rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      The people
                      <span className="block text-[#d8aa27]">behind the systems.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#8d887f]">
                      Students responsible for keeping ES@P organized, technically ambitious, and moving from ideas to working hardware.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-[400px] grid-cols-2 grid-rows-3 gap-px bg-white/[0.08] lg:col-span-5 lg:min-h-[430px]">
                <HeroPortrait member={executives[0]} className="row-span-2" />
                <HeroPortrait member={executives[1]} />
                <HeroPortrait member={executives[2]} />
                <HeroPortrait member={executives[3]} />
                <HeroPortrait member={executives[4]} />
              </div>
            </div>

            <SiteTelemetry items={telemetry} variant="rail" />
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-16">
                <div className="lg:sticky lg:top-[108px]">
                  <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                    <Shield className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                    01 / Leadership / 2026
                  </div>
                  <h2 className="mt-4 text-[clamp(2.65rem,4.2vw,4.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[#ebe6dc]">
                    Executive Board
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-[#817c74]">
                    Leadership roles, responsibilities, and public contact channels for the current operating cycle.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                {executives.map((member, index) => (
                  <MemberDirectoryRow key={member.name} member={member} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 xl:px-16">
                <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                  <Users className="h-4 w-4 text-[#8f7325]" aria-hidden="true" />
                  Structure in progress
                </div>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.045em] text-[#d8d2c7]">Next appointments</h2>
              </div>

              <div className="lg:col-span-8">
                {pendingRoles.map((role, index) => (
                  <div
                    key={role.title}
                    className={`grid gap-3 px-5 py-6 sm:grid-cols-[64px_180px_1fr] sm:items-center sm:px-8 lg:px-10 ${
                      index === 0 ? "border-b border-white/[0.08]" : ""
                    }`}
                  >
                    <span className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#5f5b55]">{role.code}</span>
                    <div>
                      <p className="text-lg font-medium tracking-[-0.035em] text-[#d9d3c8]">{role.title}</p>
                      <p className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.13em] text-[#8d7328]">{role.status}</p>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-[#777169]">{role.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-6 px-5 py-9 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-11 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#6b665f]">Build with us</p>
                <h2 className="mt-3 max-w-3xl text-[clamp(2.6rem,4.5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                  The next name on this page could be yours.
                </h2>
              </div>
              <Link
                href="https://discord.gg/MkPv9s9cj3"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 w-fit items-center gap-3 bg-[#daa000] px-5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#11110f] transition-colors hover:bg-[#f0bd31]"
              >
                Join ES@P
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
