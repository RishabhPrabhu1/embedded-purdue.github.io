// src/lib/workshops.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type WorkshopMeta = {
  title: string
  slug: string
  date?: string
  location?: string
  summary?: string
  tags?: string[]
}
type Meta = {
  title: string;
  summary?: string;
  cover?: string;
  image?: string;
  slug: string;
};

type WorkshopEntry = {
  meta: Meta;
  content: string;
};
const WORKSHOPS_DIR = path.join(process.cwd(), "content", "workshops")

export function getAllWorkshops(): WorkshopMeta[] {
  if (!fs.existsSync(WORKSHOPS_DIR)) return []
  const files = fs.readdirSync(WORKSHOPS_DIR).filter(f => f.endsWith(".md") || f.endsWith(".mdx"))
  const list = files.map((file) => {
    const full = path.join(WORKSHOPS_DIR, file)
    const src = fs.readFileSync(full, "utf8")
    const { data } = matter(src)
    const slug = (data.slug as string) ?? file.replace(/\.(md|mdx)$/, "")
    return {
      title: (data.title as string) ?? slug,
      slug,
      date: (data.date as string) ?? undefined,
      location: (data.location as string) ?? undefined,
      summary: (data.summary as string) ?? "",
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    }
  })
  return list.sort((a, b) => (a.date && b.date ? (a.date < b.date ? 1 : -1) : 0))
}

export function getWorkshopBySlug(slug: string) {
  const mdPath = path.join(WORKSHOPS_DIR, `${slug}.md`)
  const mdxPath = path.join(WORKSHOPS_DIR, `${slug}.mdx`)
  const full = fs.existsSync(mdPath) ? mdPath : mdxPath
  if (!full || !fs.existsSync(full)) return null
  const src = fs.readFileSync(full, "utf8")
  const { data, content } = matter(src)
  return { meta: { ...data, slug }, content }
}
