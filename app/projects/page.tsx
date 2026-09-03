import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
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
                    Project archive
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Hardware · Firmware · Systems</p>
                    <h1 className="mt-5 text-[clamp(4rem,8vw,8.2rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Systems
                      <span className="block text-[#d8aa27]">we build.</span>
                    </h1>
                    <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                      From custom boards and embedded firmware to robotics, FPGA work, controls, and hardware-in-the-loop systems.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-[250px] grid-cols-2 lg:col-span-4 lg:min-h-[430px] lg:grid-cols-1">
                <div className="flex flex-col justify-between border-r border-white/[0.08] px-5 py-7 sm:px-8 lg:border-b lg:border-r-0 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Total projects</span>
                  <span className="text-[clamp(3rem,6vw,5.5rem)] font-medium tracking-[-0.065em] text-[#e9e4da]">{projects.length}</span>
                </div>
                <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Active now</span>
                  <span className="text-[clamp(3rem,6vw,5.5rem)] font-medium tracking-[-0.065em] text-[#d8aa27]">{activeCount}</span>
                </div>
              </div>
            </div>
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
