import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail, Shield, Users } from "lucide-react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

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
  tags?: string[]
}

type Section = {
  title: string
  eyebrow: string
  description: string
  members: Member[]
}

const executives: Member[] = [
  { name: "Arman Islam", role: "President", linkedin: "https://www.linkedin.com/in/thomascon/", image: armanImg },
  { name: "Astha Patel", role: "Vice President", linkedin: "https://www.linkedin.com/in/astha-p/", image: asthaImg },
  { name: "Patrick Jordan", role: "Treasurer", image: patrickImg },
  { name: "Gautam Aravindan", role: "Development Engineer", linkedin: "https://www.linkedin.com/in/gautamaravindan/", image: gautamImg },
  { name: "Mahdi El Husseini", role: "Executive Engineer", linkedin: "https://www.linkedin.com/in/mahdi-el-husseini/", image: mahdiImg },
]

const sections: Section[] = [
  {
    title: "Executive Board",
    eyebrow: "Leadership / 2026",
    description: "The people responsible for the organization, technical direction, operations, and continuity of ES@P.",
    members: executives,
  },
  {
    title: "Chairs",
    eyebrow: "Appointments pending",
    description: "Chair appointments for the next operating cycle are still being finalized.",
    members: [],
  },
  {
    title: "Project Managers",
    eyebrow: "Roster incoming",
    description: "Project-manager assignments will be published with the next project cycle.",
    members: [],
  },
]

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function MemberCard({ member, index }: { member: Member; index: number }) {
  const socialLinkClass =
    "grid h-8 w-8 place-items-center border border-white/[0.07] text-[#777169] transition-colors hover:border-[#daa000]/30 hover:bg-[#daa000]/[0.05] hover:text-[#f2c34f]"

  return (
    <article data-site-lift="card" className="group flex h-full flex-col bg-[#11110f] transition-colors hover:bg-[#151512]">
      <div className="relative aspect-[4/5] overflow-hidden border-b border-white/[0.08] bg-[#090908]">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover object-top opacity-[0.8] grayscale-[18%] transition duration-700 ease-out group-hover:scale-[1.015] group-hover:opacity-100 group-hover:grayscale-0"
            placeholder="blur"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-black/18" />
        <span className="absolute left-4 top-4 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-[#777169]">
          E-{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
        <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#8d7328]">{member.role}</p>
        <h3 className="mt-2 text-[1.65rem] font-medium leading-none tracking-[-0.05em] text-[#ebe6dc]">{member.name}</h3>

        <div className="mt-auto flex items-center gap-2 pt-7">
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
        </div>
      </div>
    </article>
  )
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-11 sm:px-8 lg:col-span-8 lg:min-h-[430px] lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-16">
                  <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                    Team directory
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Leadership · Operations · Projects</p>
                    <h1 className="mt-5 text-[clamp(4rem,8vw,8.2rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      The people
                      <span className="block text-[#d8aa27]">behind the systems.</span>
                    </h1>
                    <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                      The students responsible for keeping ES@P organized, technically ambitious, and moving from ideas to working hardware.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-[250px] grid-cols-2 lg:col-span-4 lg:min-h-[430px] lg:grid-cols-1">
                <div className="flex flex-col justify-between border-r border-white/[0.08] px-5 py-7 sm:px-8 lg:border-b lg:border-r-0 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Current executives</span>
                  <span className="text-[clamp(3rem,6vw,5.5rem)] font-medium tracking-[-0.065em] text-[#e9e4da]">{executives.length}</span>
                </div>
                <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Operating model</span>
                  <div>
                    <Shield className="h-8 w-8 text-[#9a7921]" aria-hidden="true" />
                    <p className="mt-3 text-xl font-medium tracking-[-0.04em] text-[#d8d2c7]">Student-led</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {sections.map((section, sectionIndex) => (
          <section key={section.title} className="border-b border-white/[0.08] bg-[#0c0c0b] last:border-b-0">
            <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
              <div className="grid lg:grid-cols-12">
                <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-12 lg:py-12 xl:px-16">
                  <div className="lg:sticky lg:top-[108px]">
                    <div className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#777169]">
                      {sectionIndex === 0 ? <Shield className="h-4 w-4 text-[#8f7325]" /> : <Users className="h-4 w-4 text-[#8f7325]" />}
                      0{sectionIndex + 1} / {section.eyebrow}
                    </div>
                    <h2 className="mt-4 text-[clamp(2.8rem,4.5vw,4.8rem)] font-medium leading-[0.9] tracking-[-0.06em] text-[#ebe6dc]">
                      {section.title}
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-[#817c74]">{section.description}</p>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {section.members.length ? (
                    <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 xl:grid-cols-3">
                      {section.members.map((member, index) => (
                        <MemberCard key={member.name} member={member} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[310px] items-center px-5 py-12 sm:px-8 lg:px-10">
                      <div>
                        <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#625e58]">Directory pending</p>
                        <p className="mt-4 max-w-xl text-2xl leading-8 tracking-[-0.035em] text-[#aaa49a]">
                          This roster will populate when the next appointments are finalized.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-7 px-5 py-11 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-14 xl:px-16">
              <div>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#6b665f]">Build with us</p>
                <h2 className="mt-3 max-w-3xl text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.06em]">
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
