import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import Markdown from "@/components/Markdown"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { SiteTelemetry } from "@/components/site/site-telemetry"
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
  const telemetry = [
    { label: "Date", value: formatDate(meta.date), detail: "session date", accent: true },
    { label: "Location", value: meta.location ?? "TBA", detail: "meeting point" },
    { label: "Topics", value: meta.tags?.length ?? 0, detail: "technical tags" },
    { label: "Format", value: "Hands-on", detail: "session material" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:col-span-7 lg:min-h-[430px] lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="flex items-center justify-between gap-5">
                    <Link
                      href="/workshops"
                      className="inline-flex w-fit items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#888279] transition-colors hover:text-[#f2c34f]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      Workshop archive
                    </Link>
                    <span className="hidden font-mono text-[0.5rem] uppercase tracking-[0.15em] text-[#4f4b45] sm:block">
                      Session record / {slug}
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Workshop / {slug}</p>
                    <h1 className="mt-4 max-w-5xl text-[clamp(3.35rem,6.3vw,6.5rem)] font-medium leading-[0.84] tracking-[-0.07em] text-[#f2eee5]">
                      {meta.title}
                    </h1>
                    {meta.summary && (
                      <p className="mt-5 max-w-3xl text-[clamp(1rem,1.3vw,1.18rem)] leading-8 text-[#918b82]">{meta.summary}</p>
                    )}
                    {!!meta.tags?.length && (
                      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-white/[0.07] pt-4">
                        {meta.tags.slice(0, 7).map((tag) => (
                          <span key={tag} className="font-mono text-[0.51rem] uppercase tracking-[0.12em] text-[#716c65]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden bg-[#080807] lg:col-span-5 lg:min-h-[430px]">
                {cover ? (
                  cover.startsWith("/") ? (
                    <Image
                      src={cover}
                      alt={`${meta.title} workshop`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover opacity-[0.8] grayscale-[9%] saturate-[0.86]"
                      priority
                    />
                  ) : (
                    <img src={cover} alt={`${meta.title} workshop`} className="h-full w-full object-cover opacity-[0.8] grayscale-[9%]" />
                  )
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(218,160,0,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(218,160,0,.045)_1px,transparent_1px)] bg-[size:34px_34px]">
                    <div className="absolute left-[16%] top-[28%] h-px w-[62%] bg-[#8b6a13]/50" />
                    <div className="absolute left-[40%] top-[28%] h-[38%] w-px bg-[#8b6a13]/40" />
                    <div className="absolute bottom-[34%] left-[40%] h-px w-[42%] bg-[#8b6a13]/45" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-black/18" />
                <div className="absolute left-0 top-0 border-b border-r border-white/[0.09] bg-black/60 px-4 py-3 backdrop-blur-sm">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#8d887f]">Session material</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.1] bg-black/70 px-5 py-4 backdrop-blur-sm sm:px-7">
                  <p className="font-mono text-[0.49rem] uppercase tracking-[0.15em] text-[#756f67]">Workshop principle</p>
                  <p className="mt-1 text-lg font-medium tracking-[-0.035em] text-[#dfd9cf]">Build it during the session. Understand it after.</p>
                </div>
              </div>
            </div>

            <SiteTelemetry items={telemetry} variant="rail" />
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="flex flex-col gap-3 border-b border-white/[0.08] px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 xl:px-16">
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#796f59]">Workshop notes</p>
                <p className="mt-1 text-sm text-[#777169]">Setup, examples, references, and follow-up material.</p>
              </div>
              <span className="font-mono text-[0.49rem] uppercase tracking-[0.14em] text-[#55514b]">Material / {slug}</span>
            </div>

            <article data-site-markdown className="mx-auto max-w-[980px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
              <Markdown className="prose prose-invert max-w-none break-words">{entry.content}</Markdown>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
