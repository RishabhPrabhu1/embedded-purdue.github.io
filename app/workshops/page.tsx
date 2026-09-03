import { getAllWorkshops } from "@/lib/workshops"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import WorkshopsClient from "./WorkshopsClient"

export const dynamic = "error"
export const revalidate = false

export const metadata = {
  title: "Workshops • Embedded Systems at Purdue",
  description: "Upcoming and past workshops: microcontrollers, PCB, debugging, and more.",
}

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

function parseDate(date?: string) {
  if (!date) return null
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export default function WorkshopsPage() {
  const workshops = getAllWorkshops()
  const now = Date.now()
  const upcomingCount = workshops.filter((workshop) => {
    const date = parseDate(workshop.date)
    return !date || date.getTime() >= now
  }).length

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-11 sm:px-8 lg:col-span-8 lg:min-h-[430px] lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-16">
                  <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                    Workshop archive
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">
                      Learn · Build · Debug
                    </p>
                    <h1 className="mt-5 text-[clamp(4rem,8vw,8.2rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Learn the
                      <span className="block text-[#d8aa27]">tools by using them.</span>
                    </h1>
                    <p className="mt-7 max-w-2xl text-base leading-7 text-[#8d887f]">
                      Hands-on sessions covering embedded fundamentals, board design, firmware, debugging, and the systems around them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid min-h-[250px] grid-cols-2 lg:col-span-4 lg:min-h-[430px] lg:grid-cols-1">
                <div className="flex flex-col justify-between border-r border-white/[0.08] px-5 py-7 sm:px-8 lg:border-b lg:border-r-0 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Sessions archived</span>
                  <span className="text-[clamp(3rem,6vw,5.5rem)] font-medium tracking-[-0.065em] text-[#e9e4da]">
                    {workshops.length}
                  </span>
                </div>
                <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#5f5b55]">Upcoming / TBA</span>
                  <span className="text-[clamp(3rem,6vw,5.5rem)] font-medium tracking-[-0.065em] text-[#d8aa27]">
                    {upcomingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0c0b]">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <WorkshopsClient workshops={workshops} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
