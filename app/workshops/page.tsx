// app/workshops/page.tsx
import { getAllWorkshops } from "@/lib/workshops";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import WorkshopsClient from "./WorkshopsClient";

export const dynamic = "error";
export const revalidate = false;

export const metadata = {
  title: "Workshops • Embedded Systems at Purdue",
  description: "Upcoming and past workshops: microcontrollers, PCB, debugging, and more.",
};

export default function WorkshopsPage() {
  const workshops = getAllWorkshops();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Workshops</h1>
            <p className="mt-2 text-muted-foreground">
              Learn embedded fundamentals through hands-on sessions. Click a workshop to view full details.
            </p>
          </div>
        </div>

        {/* Client component handles all filtering and URL params */}
        <WorkshopsClient workshops={workshops} />
      </div>
      <Footer />
    </div>
  );
}