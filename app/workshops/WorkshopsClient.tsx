"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight, CalendarDays, MapPin, X } from "lucide-react"

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

function formatDate(date?: string) {
  const parsed = parseDate(date)
  return parsed
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed)
    : date || "TBA"
}

function filterHref(when: "all" | "upcoming" | "past", tag: string) {
  const params = new URLSearchParams()
  if (when !== "all") params.set("when", when)
  if (tag) params.set("tag", tag)
  const query = params.toString()
  return query ? `/workshops?${query}` : "/workshops"
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

  const tagFiltered = tag ? workshops.filter((workshop) => (workshop.tags ?? []).includes(tag)) : workshops
  const now = Date.now()
  const isUpcoming = (date?: string) => {
    const parsed = parseDate(date)
    return !parsed || parsed.getTime() >= now
  }

  const upcoming = tagFiltered
    .filter((workshop) => isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(a.date)?.getTime() ?? Number.POSITIVE_INFINITY) -
        (parseDate(b.date)?.getTime() ?? Number.POSITIVE_INFINITY)
    )

  const past = tagFiltered
    .filter((workshop) => !isUpcoming(workshop.date))
    .sort(
      (a, b) =>
        (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0)
    )

  const all = [...tagFiltered].sort((a, b) => {
    const aTime = parseDate(a.date)?.getTime()
    const bTime = parseDate(b.date)?.getTime()
    if (aTime == null && bTime == null) return a.title.localeCompare(b.title)
    if (aTime == null) return -1
    if (bTime == null) return 1
    return bTime - aTime
  })

  const list = when === "upcoming" ? upcoming : when === "past" ? past : all
  const hasFilters = when !== "all" || Boolean(tag)

  return (
    <>
      <div className="border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:px-12 lg:py-7 xl:px-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {(
              [
                ["all", "All", tagFiltered.length],
                ["upcoming", "Upcoming", upcoming.length],
                ["past", "Past", past.length],
              ] as const
            ).map(([value, label, count]) => {
              const active = when === value
              return (
                <Link
                  key={value}
                  href={filterHref(value, tag)}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex h-9 items-center border-b font-mono text-[0.57rem] uppercase tracking-[0.14em] transition-colors ${
                    active
                      ? "border-[#daa000] text-[#e3b93e]"
                      : "border-transparent text-[#7f7a72] hover:border-white/[0.16] hover:text-[#d8d2c7]"
                  }`}
                >
                  {label}
                  <span className="ml-2 text-[#5e5a54]">{count}</span>
                </Link>
              )
            })}
          </div>

          {hasFilters && (
            <Link
              href="/workshops"
              className="inline-flex w-fit items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#777169] transition-colors hover:text-[#f2c34f]"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </Link>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-3.5">
            <Link
              href={filterHref(when, "")}
              aria-current={!tag ? "page" : undefined}
              className={`font-mono text-[0.54rem] uppercase tracking-[0.14em] transition-colors ${
                !tag ? "text-[#e2b63a]" : "text-[#69645d] hover:text-[#bdb7ad]"
              }`}
            >
              All topics
            </Link>
            {allTags.map((topic) => (
              <Link
                key={topic}
                href={filterHref(when, topic)}
                aria-current={tag === topic ? "page" : undefined}
                className={`font-mono text-[0.54rem] uppercase tracking-[0.14em] transition-colors ${
                  tag === topic ? "text-[#e2b63a]" : "text-[#69645d] hover:text-[#bdb7ad]"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
        )}
      </div>

      {!list.length ? (
        <div className="px-5 py-14 text-center sm:px-8 lg:px-12">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#666159]">No sessions found</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] text-[#ded8cd]">Nothing matches this view.</h2>
          <Link
            href="/workshops"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#b28c25] transition-colors hover:text-[#f2c34f]"
          >
            Reset workshop archive
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-white/[0.08] md:grid-cols-2">
          {list.map((workshop, index) => {
            const cover = workshop.cover ?? workshop.image
            const upcomingSession = isUpcoming(workshop.date)

            return (
              <Link
                key={workshop.slug}
                href={`/workshops/${workshop.slug}`}
                data-site-lift="card"
                className="group block min-h-[360px] bg-[#0c0c0b] no-underline transition-colors hover:bg-[#11110f]"
              >
                <article className="flex h-full flex-col">
                  <div className="relative h-[180px] overflow-hidden border-b border-white/[0.08] bg-black">
                    {cover ? (
                      <img
                        src={cover}
                        alt={`${workshop.title} cover`}
                        className="h-full w-full object-cover opacity-[0.72] grayscale-[14%] transition duration-700 ease-out group-hover:scale-[1.018] group-hover:opacity-[0.9] group-hover:grayscale-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.028)_1px,transparent_1px)] bg-[size:28px_28px]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/20" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span
                        className={`border px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.14em] backdrop-blur-sm ${
                          upcomingSession
                            ? "border-[#daa000]/40 bg-[#daa000]/[0.1] text-[#e0b43a]"
                            : "border-white/[0.1] bg-black/55 text-[#8b857c]"
                        }`}
                      >
                        {upcomingSession ? "Upcoming" : "Archive"}
                      </span>
                      <span className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-[#777169]">
                        W-{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="absolute bottom-4 right-4 h-5 w-5 text-[#c4bfb5] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-5 py-5 sm:px-7">
                    <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#ebe6dc]">
                      {workshop.title}
                    </h2>
                    {workshop.summary && (
                      <p className="mt-3 max-w-xl text-sm leading-6 text-[#817c74]">{workshop.summary}</p>
                    )}

                    <div className="mt-auto pt-5">
                      <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.53rem] uppercase tracking-[0.13em] text-[#777169]">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                            {formatDate(workshop.date)}
                          </span>
                          {workshop.location && (
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                              {workshop.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {!!workshop.tags?.length && (
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                          {workshop.tags.slice(0, 5).map((topic) => (
                            <span key={topic} className="font-mono text-[0.51rem] uppercase tracking-[0.13em] text-[#625e58]">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
