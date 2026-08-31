// app/workshops/page.tsx
import { getAllWorkshops } from "@/lib/workshops"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import WorkshopsClient from "./WorkshopsClient"

export const dynamic = "error"
export const revalidate = false

export const metadata = {
  title: "Workshops • Embedded Systems @ Purdue",
  description: "Hands-on Embedded Systems @ Purdue workshops covering microcontrollers, embedded AI, debugging, and more.",
}

export default function WorkshopsPage() {
  const workshops = getAllWorkshops()

  return (
    <div className="min-h-screen bg-[#090908] text-[#f3efe6]">
      <Navigation />

      <main className="mx-auto max-w-[1440px] border-x border-white/[0.06] bg-[#0c0c0b]">
        <header className="grid border-b border-white/[0.08] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="px-5 py-10 sm:px-8 sm:py-12 lg:border-r lg:border-white/[0.08] lg:px-12 lg:py-14 xl:px-16">
            <div className="flex items-center gap-3 font-mono text-[0.61rem] uppercase tracking-[0.17em] text-[#aaa398]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.35)]" />
              Workshop archive
            </div>
            <h1 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em]">
              Workshops
            </h1>
          </div>

          <div className="flex items-end px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
            <div className="max-w-xl">
              <p className="text-base leading-7 text-[#99938a] sm:text-lg sm:leading-8">
                Hands-on sessions for learning embedded systems by building, debugging, and measuring real hardware.
              </p>
              <p className="mt-4 font-mono text-[0.57rem] uppercase tracking-[0.15em] text-[#66625c]">
                {workshops.length} published sessions
              </p>
            </div>
          </div>
        </header>

        <WorkshopsClient workshops={workshops} />
      </main>

      <Footer />
    </div>
  )
}
