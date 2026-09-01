// app/projects/_ProjectsGridClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronDown, X } from "lucide-react";
import { allStatuses, collectTechs, collectSemesters } from "./_data";
import type { Project as DataProject } from "./_data";

// Locally we allow description/image to be optional since sanitizeProjects()
// in page.tsx strips non-serializable fields; intersect with Omit to relax those.
type Project = Omit<DataProject, "description" | "image" | "icon"> & {
  description?: string;  // may be absent after sanitization
  image?: string;        // may be filename or absolute
};

/** Normalize project image to a public URL under `/projects/<slug>/...` */
function resolveProjectImage(p: Project) {
  const raw = p.image || "";
  if (!raw) return "/projects/logo.png";
  if (/^https?:\/\//i.test(raw)) return raw;

  // normalize to /projects/<slug>/<file>
  let path = raw.replace(/^\/+/, "");
  if (path.startsWith("projects/")) path = path.slice("projects/".length);
  if (path.startsWith(`${p.slug}/`)) return `/projects/${path}`;
  return `/projects/${p.slug}/${path}`;
}

// Status priority: Active first, then Planned, then Completed
const STATUS_ORDER: Record<string, number> = { Active: 0, Planned: 1, Completed: 2 };

/** Decide where the card should link */
function resolveProjectHref(p: Project): { href: string; external: boolean } {
  const url = p.readmeUrl?.trim();

  // External link
  if (url && /^https?:\/\//i.test(url)) {
    return { href: url, external: true };
  }

  // Bad internal file path (not served by Next)
  if (url && url.startsWith("/content/")) {
    return { href: `/projects/${p.slug}`, external: false };
  }

  // Valid internal route under /projects/*
  if (url && url.startsWith("/projects/")) {
    return { href: url, external: false };
  }

  // Fallback: route to the rendered project page
  return { href: `/projects/${p.slug}`, external: false };
}

/** Encode a string[] as a comma-separated URL param value */
function encodeTechs(techs: string[]): string {
  return techs.join(",");
}

/** Decode a comma-separated URL param value back into a string[] */
function decodeTechs(raw: string): string[] {
  return raw ? raw.split(",").filter(Boolean) : [];
}

/** Dropdown that renders a list of checkboxes — closes on outside click */
function TechCheckboxDropdown({
  allTechs,
  selectedTechs,
  onChange,
}: {
  allTechs: string[];
  selectedTechs: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle(tech: string) {
    const next = selectedTechs.includes(tech)
      ? selectedTechs.filter((t) => t !== tech)
      : [...selectedTechs, tech];
    onChange(next);
  }

  const label =
    selectedTechs.length === 0
      ? "All technologies"
      : selectedTechs.length === 1
      ? selectedTechs[0]
      : `${selectedTechs.length} technologies`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={TRIGGER_CLS}
      >
        <span className={TRIGGER_LABEL_CLS}>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border bg-popover shadow-md">
          {/* Clear selection */}
          {selectedTechs.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="flex w-full items-center gap-2 border-b px-3 py-2 text-xs text-muted-foreground hover:bg-primary/15 hover:text-foreground"
            >
              <X className="h-3 w-3" /> Clear selection
            </button>
          )}
          <ul className="max-h-64 overflow-y-auto py-1">
            {allTechs.map((tech) => (
              <li key={tech}>
                <label className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-primary/15">
                  <input
                    type="checkbox"
                    checked={selectedTechs.includes(tech)}
                    onChange={() => toggle(tech)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {tech}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Shared classes for all dropdown trigger buttons — keeps status, tech, and semester visually identical
const TRIGGER_CLS =
  "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-40";

// Shared label span inside every trigger — truncates long values with ellipsis
const TRIGGER_LABEL_CLS = "flex-1 text-left truncate overflow-hidden";

/** Generic single-select dropdown that mirrors the look of TechCheckboxDropdown */
function SelectDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside the dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = value === "all" ? placeholder : value;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className={TRIGGER_CLS}>
        <span className={TRIGGER_LABEL_CLS}>{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-full rounded-md border bg-popover shadow-md">
          <ul className="py-1">
            <li>
              <button
                onClick={() => { onChange("all"); setOpen(false); }}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-primary/15 ${value === "all" ? "font-medium" : ""}`}
              >
                {placeholder}
              </button>
            </li>
            {options.map((opt) => (
              <li key={opt}>
                <button
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-primary/15 ${value === opt ? "font-medium" : ""}`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProjectsGridClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const selectedStatus = sp.get("status") ?? "all";
  // techs is now a string[] decoded from a comma-separated URL param
  const selectedTechs = useMemo(() => decodeTechs(sp.get("techs") ?? ""), [sp]);
  const selectedSemester = sp.get("semester") ?? "all";
  const query = sp.get("q") ?? "";

  // Pull tech and semester options from _data helpers rather than deriving them here
  const allTechs = useMemo(() => collectTechs(projects), [projects]);
  const allSemesters = useMemo(() => collectSemesters(projects), [projects]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const results = projects.filter((p) => {
      const sOK = selectedStatus === "all" || p.status === selectedStatus;
      // Project must include ALL of the selected techs (AND logic)
      const tOK =
        selectedTechs.length === 0 ||
        selectedTechs.every((t) => p.technologies.includes(t));
      const semOK = selectedSemester === "all" || p.semester === selectedSemester;
      const qOK =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return sOK && tOK && semOK && qOK;
    });

    // When no filters are active, sort Active first, then Planned, then Completed,
    // with alphabetical ordering within each group.
    // When filters are active, just sort alphabetically.
    const noFilters =
      selectedStatus === "all" && selectedTechs.length === 0 && selectedSemester === "all" && !q;
    return results.sort((a, b) => {
      if (noFilters) {
        const statusDiff =
          (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
        if (statusDiff !== 0) return statusDiff;
      }
      return a.title.localeCompare(b.title);
    });
  }, [projects, selectedStatus, selectedTechs, selectedSemester, query]);

  /** Build a URL with updated params, leaving others intact */
  const hrefWith = useCallback(
    (s: string, techs: string[], sem: string, q: string) => {
      const qs = new URLSearchParams();
      if (s !== "all") qs.set("status", s);
      if (techs.length > 0) qs.set("techs", encodeTechs(techs));
      if (sem !== "all") qs.set("semester", sem);
      if (q) qs.set("q", q);
      const str = qs.toString();
      return str ? `${pathname}?${str}` : pathname;
    },
    [pathname]
  );

  /** Soft-navigate: update URL params without a full page reload */
  const navigate = useCallback(
    (s: string, techs: string[], sem: string, q: string) => {
      router.push(hrefWith(s, techs, sem, q), { scroll: false });
    },
    [router, hrefWith]
  );

  // For dropdowns — soft-navigate on change via router.push
  function handleSelect(param: "status" | "semester", value: string) {
    const next = { status: selectedStatus, semester: selectedSemester };
    next[param] = value;
    navigate(next.status, selectedTechs, next.semester, query);
  }

  // Tech checkboxes — toggle individual techs in the URL param
  function handleTechChange(next: string[]) {
    navigate(selectedStatus, next, selectedSemester, query);
  }

  // Live search — update URL (and therefore results) on every keystroke
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    navigate(selectedStatus, selectedTechs, selectedSemester, e.target.value);
  }

  // Derived outside filtered so the UI (results count, Clear all) can use it too
  const hasFilters =
    selectedStatus !== "all" || selectedTechs.length > 0 || selectedSemester !== "all" || !!query;

  return (
    <>
      {/* Search + Filters */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {/* Search — controlled by URL param, updates on every keystroke */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search projects…"
            className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm shadow-sm outline-none ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground"
          />
        </div>

        {/* Status */}
        <SelectDropdown
          value={selectedStatus}
          options={[...allStatuses]}
          placeholder="All statuses"
          onChange={(v) => handleSelect("status", v)}
        />

        {/* Tech — checkbox dropdown for multi-select */}
        <TechCheckboxDropdown
          allTechs={allTechs}
          selectedTechs={selectedTechs}
          onChange={handleTechChange}
        />

        {/* Semester */}
        <SelectDropdown
          value={selectedSemester}
          options={allSemesters}
          placeholder="All semesters"
          onChange={(v) => handleSelect("semester", v)}
        />

        {/* Clear */}
        {hasFilters && (
          <Link
            href="/projects"
            className="whitespace-nowrap text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        {hasFilters ? " match your filters" : ""}
      </p>

      {/* Grid */}
      <section>
        {!filtered.length && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>No projects match</CardTitle>
              <CardDescription>
                Try different filters or{" "}
                <Link href="/projects" className="underline">clear all filters</Link>.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const img = resolveProjectImage(p);
            const { href, external } = resolveProjectHref(p);

            const CardInner = (
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <img
                  src={img || "/images/fallback.jpg"}
                  alt={`${p.title} cover`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // prevents infinite loop
                    e.currentTarget.src = "/projects/logo.png";
                  }}
                />
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant={p.status === "Active" ? "default" : p.status === "Completed" ? "secondary" : "outline"}>
                      {p.status}
                    </Badge>
                    {p.semester && <span className="rounded-full border px-2 py-0.5 text-xs">{p.semester}</span>}
                  </div>
                  <CardTitle className="leading-tight">{p.title}</CardTitle>
                  {p.description && (
                    <CardDescription className="text-base">{p.description}</CardDescription>
                  )}
                </CardHeader>
                {!!p.technologies.length && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {p.technologies.map((t) => (
                        <Badge key={`${p.slug}-${t}`} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );

            return external ? (
              <a key={p.slug} href={href} className="no-underline" target="_blank" rel="noopener noreferrer">
                {CardInner}
              </a>
            ) : (
              <Link key={p.slug} href={href} className="no-underline">
                {CardInner}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}