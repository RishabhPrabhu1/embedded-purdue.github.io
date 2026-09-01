// app/projects/page.tsx
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { projects as RAW } from "./_data";
import type { Project } from "./_data";
import ProjectsGridClient from "./_ProjectsGridClient";

// Force static; do NOT read searchParams on the server
export const dynamic = "error";
export const revalidate = false;

type SafeProject = Omit<Project, "icon">;

// Strip out non-serializable fields like icon components
function sanitizeProjects(): SafeProject[] {
  return RAW.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.image,
    status: p.status,
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    pm: p.pm,
    semester: p.semester,
    readmeUrl: p.readmeUrl,
  }));
}

export default function ProjectsPage() {
  const projects = sanitizeProjects();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold">Projects</h1>

        {/* All filtering and search param handling is done on the client */}
        <ProjectsGridClient projects={projects} />
      </main>
      <Footer />
    </div>
  );
}