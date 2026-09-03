"use client"

import type { ChangeEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react"

import { allStatuses, collectSemesters, collectTechs } from "./_data"
import type { Project as DataProject } from "./_data"

type Project = Omit<DataProject, "description" | "image" | "icon"> & {
  description?: string
  image?: string
}

const STATUS_ORDER: Record<string, number> = { Active: 0, Planned: 1, Completed: 2 }

const TRIGGER_CLS =
  "flex h-11 w-full items-center gap-2 border border-white/[0.1] bg-[#10100e] px-3.5 font-mono text-[0.61rem] uppercase tracking-[0.11em] text-[#aaa49a] outline-none transition-colors hover:border-[#daa000]/35 hover:text-[#e6e0d5] focus-visible:border-[#daa000]/60 sm:w-44"
const TRIGGER_LABEL_CLS = "min-w-0 flex-1 truncate text-left"
const MENU_CLS =
  "absolute left-0 top-full z-50 mt-1 min-w-full border border-white/[0.1] bg-[#10100e] text-[#c7c1b7] shadow-[0_20px_50px_rgba(0,0,0,.38)]"
const MENU_ITEM_CLS =
  "w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-[#daa000]/[0.09] hover:text-[#f2c34f]"

function resolveProjectImage(project: Project) {
  const raw = project.image || ""
  if (!raw) return "/projects/logo.png"
  if (/^https?:\/\//i.test(raw)) return raw

  let path = raw.replace(/^\/+/, "")
  if (path.startsWith("projects/")) path = path.slice("projects/".length)
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

function statusClass(status: string) {
  if (status === "Active") return "border-[#daa000]/40 bg-[#daa000]/[0.11] text-[#e1b947]"
  if (status === "Planned") return "border-[#7b87a3]/35 bg-[#7b87a3]/[0.08] text-[#aab3c7]"
  return "border-white/[0.1] bg-black/30 text-[#817c74]"
}

function TechCheckboxDropdown({
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
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggle(tech: string) {
    onChange(
      selectedTechs.includes(tech)
        ? selectedTechs.filter((selected) => selected !== tech)
        : [...selectedTechs, tech]
    )
  }

  const label =
    selectedTechs.length === 0
      ? "All technologies"
      : selectedTechs.length === 1
        ? selectedTechs[0]
        : `${selectedTechs.length} technologies`

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className={TRIGGER_CLS} aria-expanded={open}>
        <span className={TRIGGER_LABEL_CLS}>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className={`${MENU_CLS} w-64`}>
          {selectedTechs.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex w-full items-center gap-2 border-b border-white/[0.08] px-3.5 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-[#777169] transition-colors hover:text-[#f2c34f]"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear selection
            </button>
          )}
          <ul className="max-h-72 overflow-y-auto py-1.5">
            {allTechs.map((tech) => (
              <li key={tech}>
                <label className="flex cursor-pointer items-center gap-3 px-3.5 py-2 text-sm transition-colors hover:bg-[#daa000]/[0.08] hover:text-[#f2c34f]">
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech)}
                    onChange={() => toggle(tech)}
                    className="h-3.5 w-3.5 accent-[#daa000]"
                  />
                  {tech}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SelectDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string
  options: string[]
  placeholder: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const label = value === "all" ? placeholder : value

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((state) => !state)} className={TRIGGER_CLS} aria-expanded={open}>
        <span className={TRIGGER_LABEL_CLS}>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div className={MENU_CLS}>
          <ul className="py-1.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange("all")
                  setOpen(false)
                }}
                className={`${MENU_ITEM_CLS} ${value === "all" ? "text-[#f2c34f]" : ""}`}
              >
                {placeholder}
              </button>
            </li>
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={`${MENU_ITEM_CLS} ${value === option ? "text-[#f2c34f]" : ""}`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
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

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase()
    const results = projects.filter((project) => {
      const statusMatches = selectedStatus === "all" || project.status === selectedStatus
      const techMatches =
        selectedTechs.length === 0 || selectedTechs.every((tech) => project.technologies.includes(tech))
      const semesterMatches = selectedSemester === "all" || project.semester === selectedSemester
      const queryMatches =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.description?.toLowerCase().includes(normalizedQuery) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(normalizedQuery))

      return statusMatches && techMatches && semesterMatches && queryMatches
    })

    const noFilters =
      selectedStatus === "all" &&
      selectedTechs.length === 0 &&
      selectedSemester === "all" &&
      !normalizedQuery

    return results.sort((a, b) => {
      if (noFilters) {
        const statusDifference = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99)
        if (statusDifference !== 0) return statusDifference
      }
      return a.title.localeCompare(b.title)
    })
  }, [projects, query, selectedSemester, selectedStatus, selectedTechs])

  const hrefWith = useCallback(
    (status: string, techs: string[], semester: string, search: string) => {
      const params = new URLSearchParams()
      if (status !== "all") params.set("status", status)
      if (techs.length) params.set("techs", encodeTechs(techs))
      if (semester !== "all") params.set("semester", semester)
      if (search) params.set("q", search)
      const serialized = params.toString()
      return serialized ? `${pathname}?${serialized}` : pathname
    },
    [pathname]
  )

  const navigate = useCallback(
    (status: string, techs: string[], semester: string, search: string) => {
      router.push(hrefWith(status, techs, semester, search), { scroll: false })
    },
    [hrefWith, router]
  )

  function handleSelect(param: "status" | "semester", value: string) {
    if (param === "status") navigate(value, selectedTechs, selectedSemester, query)
    else navigate(selectedStatus, selectedTechs, value, query)
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    navigate(selectedStatus, selectedTechs, selectedSemester, event.target.value)
  }

  const hasFilters =
    selectedStatus !== "all" || selectedTechs.length > 0 || selectedSemester !== "all" || Boolean(query)

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:px-12 lg:py-8 xl:px-16">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e6961]" aria-hidden="true" />
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Search projects, systems, technologies…"
              className="h-11 w-full border border-white/[0.1] bg-[#10100e] py-2 pl-10 pr-4 text-sm text-[#e5dfd4] outline-none transition-colors placeholder:text-[#5f5a53] focus:border-[#daa000]/55"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:flex">
            <SelectDropdown
              value={selectedStatus}
              options={[...allStatuses]}
              placeholder="All statuses"
              onChange={(value) => handleSelect("status", value)}
            />
            <TechCheckboxDropdown
              allTechs={allTechs}
              selectedTechs={selectedTechs}
              onChange={(techs) => navigate(selectedStatus, techs, selectedSemester, query)}
            />
            <SelectDropdown
              value={selectedSemester}
              options={allSemesters}
              placeholder="All semesters"
              onChange={(value) => handleSelect("semester", value)}
            />
          </div>
        </div>

        <div className="mt-4 flex min-h-6 flex-wrap items-center justify-between gap-3 font-mono text-[0.57rem] uppercase tracking-[0.15em]">
          <span className="text-[#69645d]">
            {filtered.length} project{filtered.length === 1 ? "" : "s"}{hasFilters ? " matching filters" : " in archive"}
          </span>
          {hasFilters && (
            <Link href="/projects" className="inline-flex items-center gap-2 text-[#9b958b] transition-colors hover:text-[#f2c34f]">
              <X className="h-3 w-3" aria-hidden="true" />
              Clear all
            </Link>
          )}
        </div>
      </div>

      {!filtered.length ? (
        <div className="px-5 py-20 text-center sm:px-8 lg:px-12">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#666159]">No matching systems</p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-[#ded8cd]">Nothing fits those filters.</h2>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm text-[#b28c25] transition-colors hover:text-[#f2c34f]">
            Reset project archive
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const image = resolveProjectImage(project)
            const { href, external } = resolveProjectHref(project)

            const inner = (
              <article className="group flex h-full min-h-[470px] flex-col bg-[#11110f] transition-colors hover:bg-[#151512]">
                <div className="relative h-[225px] overflow-hidden border-b border-white/[0.08] bg-black">
                  <img
                    src={image}
                    alt={`${project.title} cover`}
                    className="h-full w-full object-cover opacity-[0.7] grayscale-[18%] transition duration-700 ease-out group-hover:scale-[1.018] group-hover:opacity-[0.86] group-hover:grayscale-0"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = "/projects/logo.png"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/18" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
                    <span className={`border px-2.5 py-1 font-mono text-[0.53rem] uppercase tracking-[0.14em] backdrop-blur-sm ${statusClass(project.status)}`}>
                      {project.status}
                    </span>
                    {project.semester && (
                      <span className="bg-black/64 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.13em] text-[#989289] backdrop-blur-sm">
                        {project.semester}
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-[#c4bfb5] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]" aria-hidden="true" />
                </div>

                <div className="flex flex-1 flex-col px-5 py-6 sm:px-6">
                  <p className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#5e5a54]">Project / {project.slug}</p>
                  <h2 className="mt-3 text-[1.7rem] font-medium leading-[1.02] tracking-[-0.05em] text-[#e9e4da]">{project.title}</h2>
                  {project.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#817c74]">{project.description}</p>
                  )}

                  <div className="mt-auto pt-7">
                    {!!project.technologies.length && (
                      <div className="flex flex-wrap gap-x-3 gap-y-2 border-t border-white/[0.07] pt-4">
                        {project.technologies.slice(0, 5).map((technology) => (
                          <span key={`${project.slug}-${technology}`} className="font-mono text-[0.53rem] uppercase tracking-[0.13em] text-[#77726a]">
                            {technology}
                          </span>
                        ))}
                        {project.technologies.length > 5 && (
                          <span className="font-mono text-[0.53rem] uppercase tracking-[0.13em] text-[#5c5852]">+{project.technologies.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )

            return external ? (
              <a key={project.slug} href={href} target="_blank" rel="noopener noreferrer" className="block h-full no-underline">
                {inner}
              </a>
            ) : (
              <Link key={project.slug} href={href} className="block h-full no-underline">
                {inner}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
