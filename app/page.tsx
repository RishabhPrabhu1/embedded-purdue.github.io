import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PcbHero } from "@/components/landing/pcb-hero"
import { BookOpen, Wrench, CircuitBoard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PcbHero />

      <div id="landing-content">
        {/* Stats */}
        <section className="px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="py-6">
                <div className="text-3xl font-bold">Founded 2025</div>
                <div className="text-muted-foreground">Started by Purdue ECE students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="text-3xl font-bold">10+ projects</div>
                <div className="text-muted-foreground">Robotics, IoT, FPGA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-6">
                <div className="text-3xl font-bold">8 planned workshops</div>
                <div className="text-muted-foreground">2025–26 series</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-16 px-4 bg-surface-1">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-colors border-2 hover:border-primary/50">
              <CardHeader>
                <CardTitle>Founded in 2025</CardTitle>
                <CardDescription>Built to grow an integrated HW–SW community.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <Image src="/founders.jpeg" alt="Founders" fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/about">Read more</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-colors border-2 hover:border-primary/50">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>From three builds in Spring 2025 to a broader portfolio.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <Image src="/projects/gest-1.jpg" alt="Projects" fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/projects">See past and future projects</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-colors border-2 hover:border-primary/50">
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>100+ active members and growing.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <Image src="/bb8.jpg" alt="Community" fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="https://discord.gg/MkPv9s9cj3" target="_blank" rel="noopener noreferrer">
                      Join our Discord
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col border-2 transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle>Workshops</CardTitle>
                <CardDescription className="line-clamp-2">
                  MCUs to prep for interviews. See our calendar below.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                  <Image src="/industry_ins.jpg" alt="Workshops" fill className="object-cover" />
                </div>

                {/* spacer + action pinned to bottom */}
                <div className="mt-3" />
                <Button variant="outline" size="sm" className="mt-auto" asChild>
                  <Link href="/workshops">Check out our workshops</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Events */}
        <section className="py-16 px-4 bg-surface-1">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-2xl font-semibold">Events & Workshops</h2>

            <div className="overflow-hidden rounded-xl border bg-black">
              <iframe
                title="Embedded Systems @ Purdue calendar"
                src="https://calendar.google.com/calendar/embed?src=embedded%40purdue.edu&ctz=America%2FIndiana%2FIndianapolis&showCalendars=0"
                style={{
                  border: 0,
                  filter: "invert(0.90) hue-rotate(180deg)", //this kinda works? may be better option to get it into a yellow hue than blue hue
                }}
                width="100%"
                height="600"
                loading="lazy"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a
                  href="https://calendar.google.com/calendar/render?cid=embedded%40purdue.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  + Add to Google Calendar
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://calendar.google.com/calendar/ical/embedded%40purdue.edu/public/basic.ics" rel="noopener noreferrer">
                  Subscribe via iCal (.ics)
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="py-16 px-4">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="mb-2 h-6 w-6" />
                <CardTitle>Start learning</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Join a workshop series to build fundamentals quickly.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Wrench className="mb-2 h-6 w-6" />
                <CardTitle>Build with a team</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Apply for a project team at the start of each semester.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CircuitBoard className="mb-2 h-6 w-6" />
                <CardTitle>Showcase your work</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Ship, demo, and add to your portfolio.
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
