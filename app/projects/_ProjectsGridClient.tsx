// app/projects/_ProjectsGridClient.tsx
"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react"

import { allStatuses, collectSemesters, collectTechs } from "./_data"
import type { Project as DataProject } from "./_data"

type Project = Omit<DataProject, "description" | "image" | "icon"> & {
  description?: string
  image?: string
}

const STATUS_ORDER: Record<string, number> = { Active: 0, Planned: 1, Completed: 2 }

function resolveProjectImage(project: Project) {
  const raw = project.image?.trim() ?? ""
  if (!raw) return "/projects/logo.png"
  if (/^https?:\/\//i.test(raw)) return raw
  if (raw.startsWith("/")) return raw

  const path = raw.replace(/^\/+/, "")
  if (path.startsWith("projects/")) return `/${path}`
  if (path.startsWith(`${project.slug}/`)) return `/projects/${path}`
  return `/projects/${project.slug}/${path}`
}

function resolveProjectHref(project: Project): { href: string; external: boolean } {
  const url = project.readmeUrl?.trim()
  if (url && /^https?:\/\//i.test(url)) return { href: url, external: true }
  if (url && url.startsWith("/content/")) return { href: `/projects/${project.slug}`, external: false }
  if (url && url.startsWith("/projects/")) return { href: url, external: false }
  return { href: `/projects/${project.slug}`, external: false }
}

function encodeTechs(techs: string[]) {
  return techs.join(",")
}

function decodeTechs(raw: string) {
  return raw ? raw.split(",").filter(Boolean) : []
}

function TechDropdown({
  allTechs,
  selectedTechs,
  onChange,
}: {
  allTechs: string[]
  selectedTechs: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  const toggle = (tech: string) => {
    onChange(
      selectedTechs.includes(tech)
        ? selectedTechs.filter((selected) => selected !== tech)
        : [...selectedTechs, tech]
    )
  }

  const label =
    selectedTechs.length === 0
      ? "Technology"
      : selectedTechs.length === 1
        ? selectedTechs[0]
        : `${selectedTechs.length} selected`

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 min-w-[150px] items-center justify-between gap-3 border border-white/[0.09] bg-[#0d0d0b] px-3 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#9c968c] transition-colors hover:border-[#daa000]/45 hover:text-[#d8d1c5]"
      >
        <span className="max-w-[150px] truncate">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-px w-64 border border-white/[0.09] bg-[#0d0d0b] shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
          {selectedTechs.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full items-center gap-2 border-b border-white/[0.08] px-3 py-3 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-[#777169] transition-colors hover:text-[#f2c34f]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear technology
            </button>
          )}

          <div className="max-h-72 overflow-y-auto py-1">
            {allTechs.map((tech) => (
              <label
                key={tech}
                className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-[#aaa49a] transition-colors hover:bg-white/[0.025] hover:text-[#e4ded3]"
              >
                <input
                  type="checkbox"
                  checked={selectedTechs.includes(tech)}
                  onChange={() => toggle(tech)}
                  className="h-3.5 w-3.5 accent-[#daa000]"
                />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsGridClient({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedStatus = searchParams.get("status") ?? "all"
  const selectedTechs = useMemo(() => decodeTechs(searchParams.get("techs") ?? ""), [searchParams])
  const selectedSemester = searchParams.get("semester") ?? "all"
  const query = searchParams.get("q") ?? ""

  const allTechs = useMemo(() => collectTechs(projects), [projects])
  const allSemesters = useMemo(() => collectSemesters(projects), [projects])

  const hrefWith = useCallback(
    (status: string, techs: string[], semester: string, q: string) => {
      const params = new URLSearchParams()
      if (status !== "all") params.set("status", status)
      if (techs.length) params.set("techs", encodeTechs(techs))
      if (semester !== "all") params.set("semester", semester)
      if (q) params.set("q", q)
      const queryString = params.toString()
      return queryString ? `${pathname}?${queryString}` : pathname
    },
    [pathname]
  )

  const navigate = useCallback(
    (status: string, techs: string[], semester: string, q: string) => {
      router.push(hrefWith(status, techs, semester, q), { scroll: false })
    },
    [hrefWith, router]
  )

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const noFilters =
      selectedStatus === "all" && selectedTechs.length === 0 && selectedSemester === "all" && !q

    return projects
      .filter((project) => {
        const statusMatch = selectedStatus === "all" || project.status === selectedStatus
        const techMatch =
          selectedTechs.length === 0 || selectedTechs.every((tech) => project.technologies.includes(tech))
        const semesterMatch = selectedSemester === "all" || project.semester === selectedSemester
        const queryMatch =
          !q ||
          project.title.toLowerCase().includes(q) ||
          project.description?.toLowerCase().includes(q) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(q))

        return statusMatch && techMatch && semesterMatch && queryMatch
      })
      .sort((a, b) => {
        if (noFilters) {
          const statusDiff = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
          if (statusDiff !== 0) return statusDiff
        }
        return a.title.localeCompare(b.title)
      })
  }, [projects, query, selectedSemester, selectedStatus, selectedTechs])

  const hasFilters =
    selectedStatus !== "all" || selectedTechs.length > 0 || selectedSemester !== "all" || Boolean(query)

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    navigate(selectedStatus, selectedTechs, selectedSemester, event.target.value)
  }

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f5b55]"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={handleSearch}
              placeholder="Search projects"
              className="h-10 w-full border border-white/[0.09] bg-[#0d0d0b] pl-10 pr-4 text-sm text-[#d8d1c5] outline-none transition-colors placeholder:text-[#55514c] focus:border-[#daa000]/55"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TechDropdown
              allTechs={allTechs}
              selectedTechs={selectedTechs}
              onChange={(next) => navigate(selectedStatus, next, selectedSemester, query)}
            />

            <select
              value={selectedSemester}
              onChange={(event) => navigate(selectedStatus, selectedTechs, event.target.value, query)}
              className="h-10 min-w-[150px] border border-white/[0.09] bg-[#0d0d0b] px-3 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#9c968c] outline-none transition-colors focus:border-[#daa000]/55"
              aria-label="Filter by semester"
            >
              <option value="all">Semester</option>
              {allSemesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] pt-4">
          <span className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#55514c]">Status</span>
          {(["all", ...allStatuses] as const).map((status) => {
            const active = selectedStatus === status
            return (
              <button
                key={status}
                type="button"
                onClick={() => navigate(status, selectedTechs, selectedSemester, query)}
                className={`flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] transition-colors ${
                  active ? "text-[#f2c34f]" : "text-[#6f6b64] hover:text-[#c8c1b5]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#f4c64d]" : "bg-white/15"}`} aria-hidden="true" />
                {status === "all" ? "All" : status}
              </button>
            )
          })}

          <span className="ml-auto font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#5f5b55]">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}
          </span>

          {hasFilters && (
            <Link
              href="/projects"
              className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#8d783e] transition-colors hover:text-[#f2c34f]"
            >
              Clear
            </Link>
          )}
        </div>
      </div>

      {!filtered.length ? (
        <div className="px-5 py-16 sm:px-8 lg:px-12 xl:px-16">
          <div className="border-l border-[#daa000]/45 pl-5">
            <p className="text-xl font-medium tracking-[-0.03em] text-[#d9d2c6]">No projects match this view.</p>
            <Link
              href="/projects"
              className="mt-3 inline-flex font-mono text-[0.61rem] uppercase tracking-[0.15em] text-[#9c968c] transition-colors hover:text-[#f2c34f]"
            >
              Clear filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => {
            const image = resolveProjectImage(project)
            const { href, external } = resolveProjectHref(project)

            return (
              <Link
                key={project.slug}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group relative isolate min-h-[340px] overflow-hidden bg-[#11110e] sm:min-h-[360px]"
              >
                <img
                  src={image}
                  alt={`${project.title} cover`}
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.65] grayscale-[18%] transition duration-700 ease-out group-hover:scale-[1.018] group-hover:opacity-[0.84] group-hover:grayscale-0"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = "/projects/logo.png"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/16 to-black/28" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-5 sm:p-6">
                  <div className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-white/60">
                    <span className={`h-1.5 w-1.5 rounded-full ${project.status === "Active" ? "bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.35)]" : "bg-white/35"}`} />
                    {project.status}
                    {project.semester ? ` · ${project.semester}` : ""}
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-white/55 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f]"
                    aria-hidden="true"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h2 className="max-w-xl text-3xl font-medium leading-[0.98] tracking-[-0.045em] text-[#f0eadf]">
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className="mt-3 line-clamp-2 max-w-lg text-sm leading-6 text-white/62">
                      {project.description}
                    </p>
                  )}
                  <p className="mt-4 font-mono text-[0.55rem] uppercase tracking-[0.13em] text-[#d5b55c]">
                    {project.technologies.slice(0, 4).join(" · ")}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
