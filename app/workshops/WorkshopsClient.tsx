"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Workshop = {
  slug: string;
  title: string;
  date?: string;
  location?: string;
  summary?: string;
  tags?: string[];
  cover?: string;
  image?: string;
};

function parseDate(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function fmtDate(d?: string) {
  const dt = parseDate(d);
  return dt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(dt)
    : d || "TBA";
}

export default function WorkshopsClient({ workshops }: { workshops: Workshop[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allTags = [...new Set(workshops.flatMap((w) => w.tags ?? []))].sort((a, b) =>
    a.localeCompare(b)
  );

  const tag = (searchParams.get("tag") ?? "").trim();
  const whenParam = searchParams.get("when");
  const when: "all" | "upcoming" | "past" =
    whenParam === "past" ? "past" : whenParam === "upcoming" ? "upcoming" : "all";

  // Filter by tag
  const filtered = tag ? workshops.filter((w) => (w.tags ?? []).includes(tag)) : workshops;

  // Separate upcoming and past
  const now = Date.now();
  const isUpcoming = (d?: string) => {
    const dt = parseDate(d);
    return !dt || dt.getTime() >= now;
  };

  const upcoming = filtered
    .filter((w) => isUpcoming(w.date))
    .sort(
      (a, b) =>
        (parseDate(a.date)?.getTime() ?? Infinity) -
        (parseDate(b.date)?.getTime() ?? Infinity)
    );

  const past = filtered
    .filter((w) => !isUpcoming(w.date))
    .sort(
      (a, b) =>
        (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0)
    );

  const list = when === "upcoming" ? upcoming : when === "past" ? past : filtered;

  return (
    <>
      {/* Filter tabs */}
      <div className="mt-3 flex gap-2">
        <Link
          href={`/workshops${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`}
          className={`rounded-lg border px-3 py-1.5 text-sm ${
            when === "all"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({filtered.length})
        </Link>
        <Link
          href={`/workshops?when=upcoming${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
          className={`rounded-lg border px-3 py-1.5 text-sm ${
            when === "upcoming"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Upcoming ({upcoming.length})
        </Link>
        <Link
          href={`/workshops?when=past${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
          className={`rounded-lg border px-3 py-1.5 text-sm ${
            when === "past"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Past ({past.length})
        </Link>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/workshops${when === "past" ? "?when=past" : when === "upcoming" ? "?when=upcoming" : ""}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              !tag
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All tags
          </Link>
          {allTags.map((t) => {
            const qs = new URLSearchParams();
            if (when !== "all") qs.set("when", when);
            qs.set("tag", t);
            const active = tag === t;
            return (
              <Link
                key={t}
                href={`/workshops?${qs.toString()}`}
                className={`rounded-full border px-3 py-1 text-sm ${
                  active
                    ? "border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </Link>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!list.length && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No workshops found</CardTitle>
            <CardDescription>
              {tag ? (
                <>
                  No workshops match tag <code>{tag}</code>.{" "}
                  <Link href="/workshops" className="underline">
                    Clear filters
                  </Link>
                  .
                </>
              ) : when === "past" ? (
                "No past workshops yet."
              ) : (
                <>
                  Add markdown files under <code>content/workshops/</code> to publish
                  the first one.
                </>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Workshop grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((w) => {
          const cover = w.cover ?? w.image;
          return (
            <Link
              key={w.slug}
              href={`/workshops/${w.slug}`}
              className="no-underline"
            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                {cover && (
                  <img
                    src={cover}
                    alt={`${w.title} cover`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  <CardTitle className="leading-tight">{w.title}</CardTitle>
                  {w.summary && <CardDescription>{w.summary}</CardDescription>}
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    {fmtDate(w.date)}
                    {w.location ? ` • ${w.location}` : ""}
                  </div>
                  {!!w.tags?.length && (
                    <div className="flex flex-wrap gap-2">
                      {w.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}