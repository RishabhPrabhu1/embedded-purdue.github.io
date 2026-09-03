import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, MapPin, Tags } from "lucide-react"

import Markdown from "@/components/Markdown"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { getAllWorkshops, getWorkshopBySlug } from "@/lib/workshops"

type RouteParams = { slug: string }

type Meta = {
  title: string
  summary?: string
  cover?: string
  image?: string
  date?: string
  location?: string
  tags?: string[]
  slug: string
}

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function normalizeMeta(loose: unknown): Meta | null {
  const meta = (loose as Record<string, unknown>) || {}
  const slug = typeof meta.slug === "string" ? meta.slug : ""
  if (!slug) return null

  const title = typeof meta.title === "string" && meta.title.trim().length > 0 ? meta.title : slug

  return {
    slug,
    title,
    summary: typeof meta.summary === "string" ? meta.summary : undefined,
    cover: typeof meta.cover === "string" ? meta.cover : undefined,
    image: typeof meta.image === "string" ? meta.image : undefined,
    date: typeof meta.date === "string" ? meta.date : undefined,
    location: typeof meta.location === "string" ? meta.location : undefined,
    tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : undefined,
  }
}

function formatDate(date?: string) {
  if (!date) return "TBA"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed)
}

export const dynamic = "error"
export const dynamicParams = false

export function generateStaticParams(): RouteParams[] {
  return getAllWorkshops().map((workshop) => ({ slug: workshop.slug }))
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params
  const entry = getWorkshopBySlug(slug)
  if (!entry) return {}

  const meta = normalizeMeta(entry.meta)
  if (!meta) return {}

  const images = meta.cover ? [meta.cover] : meta.image ? [meta.image] : []

  return {
    title: `${meta.title} • Embedded Systems at Purdue`,
    description: meta.summary ?? "",
    openGraph: {
      title: meta.title,
      description: meta.summary ?? "",
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: meta.title,
      description: meta.summary ?? "",
      images,
    },
  }
}

export default async function WorkshopDetailPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params

  const entry = getWorkshopBySlug(slug)
  if (!entry) return notFound()

  const meta = normalizeMeta(entry.meta)
  if (!meta) return notFound()

  const cover = meta.cover ?? meta.image ?? null

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className={`grid ${cover ? "lg:grid-cols-12" : ""}`}>
              <div className={`${cover ? "lg:col-span-7 lg:border-r" : ""} border-white/[0.08] px-5 py-8 sm:px-8 lg:min-h-[440px] lg:px-12 lg:py-10 xl:px-16`}>
                <div className="flex h-full flex-col justify-between gap-10">
                  <Link
                    href="/workshops"
                    className="inline-flex w-fit items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#888279] transition-colors hover:text-[#f2c34f]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Workshop archive
                  </Link>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Workshop / {slug}</p>
                    <h1 className="mt-4 max-w-5xl text-[clamp(3.4rem,6.5vw,6.5rem)] font-medium leading-[0.84] tracking-[-0.07em] text-[#f2eee5]">
                      {meta.title}
                    </h1>
                    {meta.summary && (
                      <p className="mt-5 max-w-3xl text-[clamp(1rem,1.3vw,1.18rem)] leading-8 text-[#918b82]">{meta.summary}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.08] pt-4 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-[#7d776f]">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                      {formatDate(meta.date)}
                    </span>
                    {meta.location && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                        {meta.location}
                      </span>
                    )}
                    {!!meta.tags?.length && (
                      <span className="inline-flex items-center gap-2">
                        <Tags className="h-3.5 w-3.5 text-[#8d7328]" aria-hidden="true" />
                        {meta.tags.slice(0, 4).join(" · ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {cover && (
                <div className="relative min-h-[320px] overflow-hidden lg:col-span-5 lg:min-h-[440px]">
                  <img src={cover} alt={`${meta.title} cover`} className="h-full w-full object-cover opacity-[0.8] grayscale-[10%]" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-transparent to-black/16" />
                  <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.1] bg-black/72 px-5 py-3.5 backdrop-blur-sm sm:px-7">
                    <p className="font-mono text-[0.53rem] uppercase tracking-[0.15em] text-[#777169]">Session material</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <aside className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:col-span-3 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
                <div className="lg:sticky lg:top-[108px]">
                  <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#796f59]">Workshop notes</p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[#6f6a63]">
                    Session context, setup instructions, examples, references, and follow-up material.
                  </p>
                </div>
              </aside>

              <article data-site-markdown className="px-5 py-9 sm:px-8 lg:col-span-9 lg:px-12 lg:py-11 xl:px-16">
                <Markdown className="prose prose-invert max-w-none break-words">{entry.content}</Markdown>
              </article>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
