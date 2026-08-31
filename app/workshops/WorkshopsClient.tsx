"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

type Workshop = {
  slug: string
  title: string
  date?: string
  location?: string
  summary?: string
  tags?: string[]
  cover?: string
  image?: string
}

function parseDate(date?: string) {
  if (!date) return null
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function fmtDate(date?: string) {
  const parsed = parseDate(date)
  return parsed
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed)
    : "Date TBA"
}

export default function WorkshopsClient({ workshops }: { workshops: Workshop[] }) {
  const searchParams = useSearchParams()
  const allTags = [...new Set(workshops.flatMap((workshop) => workshop.tags ?? []))].sort((a, b) =>
    a.localeCompare(b)
  )

  const tag = (searchParams.get("tag") ?? "").trim()
  const whenParam = searchParams.get("when")
  const when: "all" | "upcoming" | "past" =
    whenParam === "past" ? "past" : whenParam === "upcoming" ? "upcoming" : "all"

  const filtered = tag ? workshops.filter((workshop) => (workshop.tags ?? []).includes(tag)) : workshops
  const now = Date.now()
  const isUpcoming = (date?: string) => {
    const parsed = parseDate(date)
    return !parsed || parsed.getTime() >= now
  }

  const upcoming = filtered
    .filter((workshop) => isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(a.date)?.getTime() ?? Infinity) -
        (parseDate(b.date)?.getTime() ?? Infinity)
    )

  const past = filtered
    .filter((workshop) => !isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0)
    )

  const list = when === "upcoming" ? upcoming : when === "past" ? past : filtered

  const whenHref = (value: "all" | "upcoming" | "past") => {
    const params = new URLSearchParams()
    if (value !== "all") params.set("when", value)
    if (tag) params.set("tag", tag)
    const query = params.toString()
    return `/workshops${query ? `?${query}` : ""}`
  }

  const tagHref = (value?: string) => {
    const params = new URLSearchParams()
    if (when !== "all") params.set("when", when)
    if (value) params.set("tag", value)
    const query = params.toString()
    return `/workshops${query ? `?${query}` : ""}`
  }

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {([
            ["all", `All · ${filtered.length}`],
            ["upcoming", `Upcoming · ${upcoming.length}`],
            ["past", `Past · ${past.length}`],
          ] as const).map(([value, label]) => {
            const active = when === value
            return (
              <Link
                key={value}
                href={whenHref(value)}
                className={`flex items-center gap-2 font-mono text-[0.61rem] uppercase tracking-[0.15em] transition-colors ${
                  active ? "text-[#f2c34f]" : "text-[#77736b] hover:text-[#d9d2c6]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.35)]" : "bg-white/15"}`}
                  aria-hidden="true"
                />
                {label}
              </Link>
            )
          })}
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4">
            <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#56534e]">Topics</span>
            <Link
              href={tagHref()}
              className={`font-mono text-[0.58rem] uppercase tracking-[0.13em] transition-colors ${
                !tag ? "text-[#c8c1b5]" : "text-[#6f6b64] hover:text-[#c8c1b5]"
              }`}
            >
              All
            </Link>
            {allTags.map((topic) => (
              <Link
                key={topic}
                href={tagHref(topic)}
                className={`font-mono text-[0.58rem] uppercase tracking-[0.13em] transition-colors ${
                  tag === topic ? "text-[#f2c34f]" : "text-[#6f6b64] hover:text-[#c8c1b5]"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!list.length ? (
        <div className="px-5 py-16 sm:px-8 lg:px-12 xl:px-16">
          <div className="border-l border-[#daa000]/45 pl-5">
            <p className="text-xl font-medium tracking-[-0.03em] text-[#d9d2c6]">No workshops match this view.</p>
            <Link
              href="/workshops"
              className="mt-3 inline-flex font-mono text-[0.61rem] uppercase tracking-[0.15em] text-[#9c968c] transition-colors hover:text-[#f2c34f]"
            >
              Clear filters
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {list.map((workshop, index) => {
            const cover = workshop.cover ?? workshop.image
            const tags = workshop.tags?.slice(0, 4) ?? []

            return (
              <Link
                key={workshop.slug}
                href={`/workshops/${workshop.slug}`}
                className="group relative block overflow-hidden border-b border-white/[0.08] bg-[#0d0d0b] transition-colors hover:bg-[#11110d]"
              >
                {cover && (
                  <img
                    src={cover}
                    alt=""
                    className="pointer-events-none absolute inset-y-0 right-0 h-full w-[48%] object-cover opacity-[0.13] grayscale transition duration-700 group-hover:scale-[1.015] group-hover:opacity-[0.2] group-hover:grayscale-0"
                    loading="lazy"
                    aria-hidden="true"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0d0b] via-[#0d0d0b]/94 to-[#0d0d0b]/45" />

                <div className="relative grid min-h-[176px] gap-6 px-5 py-7 sm:px-8 md:grid-cols-[160px_1fr_auto] md:items-center lg:px-12 xl:px-16">
                  <div className="font-mono text-[0.57rem] uppercase tracking-[0.14em] text-[#69655e]">
                    <p>{fmtDate(workshop.date)}</p>
                    {workshop.location && <p className="mt-1.5 text-[#8c867d]">{workshop.location}</p>}
                    <p className="mt-4 text-[#4e4b46]">{String(index + 1).padStart(2, "0")}</p>
                  </div>

                  <div className="max-w-3xl">
                    <h2 className="text-[clamp(1.75rem,3.2vw,3rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[#e9e3d9] transition-colors group-hover:text-white">
                      {workshop.title}
                    </h2>
                    {workshop.summary && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#918c83] sm:text-base sm:leading-7">
                        {workshop.summary}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <p className="mt-4 font-mono text-[0.55rem] uppercase tracking-[0.13em] text-[#8d783e]">
                        {tags.join(" · ")}
                      </p>
                    )}
                  </div>

                  <ArrowUpRight
                    className="hidden h-5 w-5 text-[#777169] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#f2c34f] md:block"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
