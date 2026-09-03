import { getAllWorkshops } from "@/lib/workshops"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"
import { SiteTelemetry } from "@/components/site/site-telemetry"
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
  const pastCount = Math.max(0, workshops.length - upcomingCount)
  const topicCount = new Set(workshops.flatMap((workshop) => workshop.tags ?? [])).size

  const telemetry = [
    { label: "Sessions", value: workshops.length, detail: "archive total" },
    { label: "Upcoming", value: upcomingCount, detail: "scheduled / TBA", accent: true },
    { label: "Topics", value: topicCount, detail: "technical tracks" },
    { label: "Past", value: pastCount, detail: "sessions indexed" },
  ] as const

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />

      <main>
        <section className="border-b border-white/[0.08] bg-black">
          <div className={`${WIDE_RAIL} lg:border-x lg:border-white/[0.06]`}>
            <div className="grid lg:grid-cols-12">
              <div className="border-b border-white/[0.08] px-5 py-9 sm:px-8 lg:col-span-7 lg:min-h-[420px] lg:border-b-0 lg:border-r lg:px-12 lg:py-11 xl:px-16">
                <div className="flex h-full flex-col justify-between gap-10">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#aaa398]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.38)]" />
                      Workshop archive
                    </div>
                    <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#4f4b45] sm:block">
                      Learn / build / debug
                    </span>
                  </div>

                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#625e57]">Technical sessions / hands-on systems</p>
                    <h1 className="mt-4 text-[clamp(3.55rem,6.7vw,7rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                      Learn the tools
                      <span className="block text-[#d8aa27]">by using them.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-[#8d887f]">
                      Embedded fundamentals, board design, firmware, debugging, and the practical workflows that turn theory into working hardware.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[330px] overflow-hidden bg-[#080807] lg:col-span-5 lg:min-h-[420px]">
                <img
                  src="/workshops/microcontroller-breadboard.jpg"
                  alt="Microcontroller workshop hardware"
                  className="h-full w-full object-cover opacity-[0.76] grayscale-[10%] saturate-[0.78]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),transparent_34%,rgba(0,0,0,.84))]" />
                <div className="absolute left-0 top-0 border-b border-r border-white/[0.09] bg-black/58 px-4 py-3 backdrop-blur-sm">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-[#8d887f]">Bench / hands-on</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.1] bg-black/66 px-5 py-4 backdrop-blur-sm sm:px-7">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-[#756f67]">Workshop principle</p>
                      <p className="mt-1 text-lg font-medium tracking-[-0.035em] text-[#e0dbd1]">Touch the hardware. Read the signals.</p>
                    </div>
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-[#8d7328]">LAB / 01</span>
                  </div>
                </div>
              </div>
            </div>

            <SiteTelemetry items={telemetry} variant="rail" />
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
