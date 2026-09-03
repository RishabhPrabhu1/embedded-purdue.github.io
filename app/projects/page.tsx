import Image from "next/image"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { SiteTelemetry } from "@/components/site/site-telemetry"
import { projects as RAW } from "./_data"
import type { Project } from "./_data"
import ProjectsGridClient from "./_ProjectsGridClient"

export const dynamic = "error"
export const revalidate = false

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

type SafeProject = Omit<Project, "icon">

function sanitizeProjects(): SafeProject[] {
  return RAW.map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    image: project.image,
    status: project.status,
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    pm: project.pm,
    semester: project.semester,
    readmeUrl: project.readmeUrl,
  }))
}

export default function ProjectsPage() {
  const projects = sanitizeProjects()
  const activeCount = projects.filter((project) => project.status === "Active").length
  const technologyCount = new Set(projects.flatMap((project) => project.technologies)).size
  const semesterCount = new Set(projects.map((project) => project.semester).filter(Boolean)).size

  const telemetry = [
    { label: "Projects", value: projects.length, detail: "archive total" },
    { label: "Active", value: activeCount, detail: "building now", accent: true },
    { label: "Technologies", value: technologyCount, detail: "across systems" },
    { label: "Cycles", value: semesterCount, detail: "semesters indexed" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-7 lg:min-h-[420px] lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                      Project archive
                    </div>
                    <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#4f4b45] sm:block">
                      Hardware / firmware / systems
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Build record / student engineering</p>
                    <h1 className="mt-4 text-[clamp(3.7rem,7vw,7.3rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Systems
                      <span className="block text-[#d8aa27]">we build.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#8d887f]">
                      Custom boards, embedded firmware, robotics, FPGA work, controls, sensing, and the systems required to make them operate together.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[330px] overflow-hidden bg-[#080807] lg:col-span-5 lg:min-h-[420px]">
                <Image
                  src="/projects/digital-ops-1.jpg"
                  alt="ES@P embedded systems project work"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover opacity-[0.72] grayscale-[12%] saturate-[0.82]"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),transparent_38%,rgba(0,0,0,.82))]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.24),transparent_40%)]" />
                <div className="absolute left-0 top-0 border-b border-r border-white/[0.09] bg-black/58 px-4 py-3 backdrop-blur-sm">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#8d887f]">Build surface</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 border-t border-white/[0.1] bg-black/66 px-5 py-4 backdrop-blur-sm sm:px-7">
                  <div>
                    <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-[#756f67]">Archive principle</p>
                    <p className="mt-1 text-lg font-medium tracking-[-0.035em] text-[#e0dbd1]">Show the work, not just the result.</p>
                  </div>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-[#8d7328]">P / 01</span>
                </div>
              </div>
            </div>

            <SiteTelemetry items={telemetry} variant="rail" />
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <ProjectsGridClient projects={projects} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
