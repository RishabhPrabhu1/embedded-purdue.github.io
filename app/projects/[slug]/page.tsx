import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

import Markdown from "@/components/Markdown"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { SiteTelemetry } from "@/components/site/site-telemetry"
import {
  getAdditionalMarkdown,
  getAllProjectSlugs,
  getProjectMedia,
  getProjectPosts,
  loadMarkdown,
  loadMeta,
  loadPost,
} from "@/lib/projects"
import { projects as DATA } from "../_data"

export const dynamic = "error"
export const dynamicParams = false

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const contentSlugs = await getAllProjectSlugs()
  const dataSlugs = DATA.map((project) => project.slug)
  const unique = Array.from(new Set([...contentSlugs, ...dataSlugs]))
  return unique.map((slug) => ({ slug }))
}

type RouteParams = { slug: string }

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  void searchParams
  const { slug } = await params

  const meta = await loadMeta(slug)
  const fallback = DATA.find((project) => project.slug === slug)
  if (!meta && !fallback) return notFound()

  const title = meta?.title ?? fallback?.title ?? slug
  const summary = (meta?.summary ?? fallback?.description) || undefined
  const content = await loadMarkdown(slug)
  const extraPages = await getAdditionalMarkdown(slug)

  const postsMeta = await getProjectPosts(slug)
  const posts = await Promise.all(
    postsMeta.map(async (postMeta) => {
      const data = await loadPost(slug, postMeta.slug)
      return data
        ? {
            slug: postMeta.slug,
            title:
              (typeof data.meta.title === "string" && data.meta.title.trim()) ||
              postMeta.title ||
              postMeta.slug.replace(/[-_]/g, " "),
            date:
              (typeof data.meta.date === "string" && data.meta.date.trim()) ||
              postMeta.date ||
              undefined,
            content: data.content,
          }
        : null
    })
  )

  const postsClean = posts.filter(Boolean) as Array<{
    slug: string
    title: string
    date?: string
    content: string
  }>

  const media = await getProjectMedia(slug)
  const mediaCount = media.images.length + media.videos.length + media.docs.length + media.files.length
  const telemetry = [
    { label: "State", value: fallback?.status ?? "Documented", detail: fallback?.semester ?? "project record", accent: true },
    { label: "Lead", value: fallback?.pm ?? "TBD", detail: "project manager" },
    { label: "Media", value: mediaCount, detail: "artifacts indexed" },
    { label: "Stack", value: fallback?.technologies.length ?? 0, detail: "technologies" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-8 sm:px-8 lg:col-span-8 lg:min-h-[390px] lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-10">
                  <Link
                    href="/projects"
                    className="inline-flex w-fit items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#888279] transition-colors hover:text-[#f2c34f]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    Project archive
                  </Link>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Project / {slug}</p>
                    <h1 className="mt-4 max-w-5xl text-[clamp(3.4rem,6.7vw,6.9rem)] font-medium leading-[0.84] tracking-[-0.07em] text-[#f2eee5]">
                      {title}
                    </h1>
                    {summary && (
                      <p className="mt-5 max-w-3xl text-[clamp(1rem,1.3vw,1.18rem)] leading-8 text-[#918b82]">{summary}</p>
                    )}
                    {!!fallback?.technologies.length && (
                      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-white/[0.07] pt-4">
                        {fallback.technologies.slice(0, 6).map((technology) => (
                          <span key={technology} className="font-mono text-[0.51rem] uppercase tracking-[0.12em] text-[#716c65]">
                            {technology}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <SiteTelemetry items={telemetry} />
            </div>
          </div>
        </section>

        <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <aside className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:col-span-3 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
                <div className="lg:sticky lg:top-[108px]">
                  <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#796f59]">01 / Project notes</p>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-[#6f6a63]">
                    Design notes, implementation details, build logs, and technical context from the project team.
                  </p>
                </div>
              </aside>

              <div className="px-5 py-9 sm:px-8 lg:col-span-9 lg:px-12 lg:py-11 xl:px-16">
                {content ? (
                  <article data-site-markdown>
                    <Markdown className="prose prose-invert max-w-none break-words" imageBase={`/projects/${slug}`}>
                      {content}
                    </Markdown>
                  </article>
                ) : (
                  <article className="border-y border-white/[0.08] py-6">
                    <p className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#6f6a62]">Documentation pending</p>
                    <p className="mt-2 text-lg text-[#9b958c]">This project page is currently being worked on.</p>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>

        {!!extraPages.length && (
          <section className="border-b border-white/[0.08] bg-black">
            <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
              <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
                <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#796f59]">02 / Additional documentation</p>
              </div>
              <div className="divide-y divide-white/[0.08]">
                {extraPages.map((page, index) => (
                  <article key={`${page.file}-${index}`} className="grid lg:grid-cols-12">
                    <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:col-span-3 lg:border-b-0 lg:border-r lg:px-10">
                      <span className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#625e58]">D-{String(index + 1).padStart(2, "0")}</span>
                      <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-[#e5dfd5]">{page.title}</h2>
                    </div>
                    <div data-site-markdown className="px-5 py-8 sm:px-8 lg:col-span-9 lg:px-12 xl:px-16">
                      <Markdown className="prose prose-invert max-w-none break-words" imageBase={`/projects/${slug}`}>
                        {page.content}
                      </Markdown>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {!!postsClean.length && (
          <section className="border-b border-white/[0.08] bg-[#0c0c0b]">
            <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
              <div className="border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
                <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#796f59]">03 / Build log</p>
              </div>
              <div className="divide-y divide-white/[0.08]">
                {postsClean.map((post, index) => (
                  <article key={post.slug} id={`post-${post.slug}`} className="grid lg:grid-cols-12">
                    <div className="px-5 py-7 sm:px-8 lg:col-span-3 lg:border-r lg:border-white/[0.08] lg:px-10">
                      <span className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#625e58]">L-{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-[#e5dfd5]">{post.title}</h3>
                      {post.date && (
                        <p className="mt-3 font-mono text-[0.52rem] uppercase tracking-[0.13em] text-[#67625b]">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div data-site-markdown className="px-5 py-8 sm:px-8 lg:col-span-9 lg:px-12 xl:px-16">
                      <Markdown className="prose prose-invert max-w-none break-words" imageBase={`/projects/${slug}`}>
                        {post.content}
                      </Markdown>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {mediaCount > 0 && (
          <section className="bg-black">
            <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
              <div className="flex items-end justify-between gap-6 border-b border-white/[0.08] px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
                <div>
                  <p className="font-mono text-[0.57rem] uppercase tracking-[0.17em] text-[#796f59]">04 / Media</p>
                  <h2 className="mt-2 text-[clamp(2.4rem,3.8vw,4rem)] font-medium tracking-[-0.055em] text-[#e8e2d8]">Project artifacts</h2>
                </div>
                <span className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-[#5f5a53]">{mediaCount} items</span>
              </div>

              {!!media.images.length && (
                <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
                  {media.images.map((src) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-site-lift="card"
                      className="group relative block h-56 overflow-hidden bg-black"
                    >
                      <img src={src} alt="Project image" className="h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-[1.018] group-hover:opacity-100" />
                      <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-[#d8d2c7] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#f2c34f]" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}

              {!!media.videos.length && (
                <div className="grid gap-px border-t border-white/[0.08] bg-white/[0.08] lg:grid-cols-2">
                  {media.videos.map((src, index) => {
                    const lower = src.toLowerCase()
                    const isFile = lower.endsWith(".mp4") || lower.endsWith(".webm")
                    return (
                      <div key={`${src}-${index}`} className="bg-black">
                        {isFile ? (
                          <video src={src} controls className="aspect-video w-full bg-black" preload="metadata" />
                        ) : (
                          <iframe
                            src={src}
                            title={`Video ${index + 1}`}
                            className="aspect-video w-full bg-black"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {!!media.docs.length && (
                <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
                  {media.docs.map((src, index) => {
                    const isPdf = src.toLowerCase().endsWith(".pdf")
                    return (
                      <div key={`${src}-${index}`} className="bg-black">
                        {isPdf ? (
                          <iframe src={`${src}#view=FitH`} title={`Document ${index + 1}`} className="h-[680px] w-full" loading="lazy" />
                        ) : (
                          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
                            <span className="truncate text-sm text-[#8d887f]">{src}</span>
                            <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#b18b25] hover:text-[#f2c34f]">
                              Open <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {!!media.files.length && (
                <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
                  {media.files.map((file, index) => {
                    const renderCsv = () => {
                      if (!file.content) return null
                      const rows = file.content
                        .split(/\r?\n/)
                        .slice(0, 20)
                        .map((row) => row.split(","))
                      if (!rows.length) return null
                      const header = rows[0]
                      const body = rows.slice(1)
                      return (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm text-[#9a958c]">
                            <thead className="bg-white/[0.025]">
                              <tr>
                                {header.map((heading, headingIndex) => (
                                  <th key={headingIndex} className="border border-white/[0.08] px-3 py-2 text-left font-medium text-[#d1cbc0]">
                                    {heading}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {body.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="border border-white/[0.08] px-3 py-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    }

                    return (
                      <div key={`${file.url}-${index}`} className="bg-black">
                        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-8 lg:px-12">
                          <div className="truncate font-mono text-[0.56rem] uppercase tracking-[0.13em] text-[#837d74]">{file.name}</div>
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.13em] text-[#b18b25] hover:text-[#f2c34f]">
                            Open <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                          </a>
                        </div>

                        {file.kind === "html" ? (
                          <iframe src={file.url} title={file.name} className="h-[560px] w-full bg-white" loading="lazy" />
                        ) : file.kind === "code" && file.content ? (
                          <pre className="overflow-x-auto bg-[#090908] p-5 text-xs leading-relaxed text-[#aaa49a] sm:p-8">{file.content}</pre>
                        ) : file.kind === "data" && file.ext === ".csv" ? (
                          <div className="p-5 sm:p-8">{renderCsv()}</div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
