import Image, { type StaticImageData } from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

import armanImg from "../../public/team/arman.jpg"
import asthaImg from "../../public/team/astha.jpg"
import patrickImg from "../../public/team/patrick.jpg"
import gautamImg from "../../public/team/gautam.jpg"
import mahdiImg from "../../public/team/mahdi.jpg"

type Member = {
  name: string
  role: string
  image: StaticImageData
  linkedin?: string
}

const executives: Member[] = [
  { name: "Arman Islam", role: "President", image: armanImg },
  { name: "Astha Patel", role: "Vice President", linkedin: "https://www.linkedin.com/in/astha-p/", image: asthaImg },
  { name: "Patrick Jordan", role: "Treasurer", image: patrickImg },
  { name: "Gautam Aravindan", role: "Development Engineer", linkedin: "https://www.linkedin.com/in/gautamaravindan/", image: gautamImg },
  { name: "Mahdi El Husseini", role: "Executive Engineer", linkedin: "https://www.linkedin.com/in/mahdi-el-husseini/", image: mahdiImg },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#090908] text-[#f3efe6]">
      <Navigation />

      <main className="mx-auto max-w-[1440px] border-x border-white/[0.06] bg-[#0c0c0b]">
        <header className="grid border-b border-white/[0.08] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="px-5 py-10 sm:px-8 sm:py-12 lg:border-r lg:border-white/[0.08] lg:px-12 lg:py-14 xl:px-16">
            <div className="flex items-center gap-3 font-mono text-[0.61rem] uppercase tracking-[0.17em] text-[#aaa398]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f4c64d] shadow-[0_0_8px_rgba(244,198,77,0.35)]" />
              Team
            </div>
            <h1 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.06em]">
              Executive board
            </h1>
          </div>

          <div className="flex items-end px-5 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
            <div className="max-w-xl">
              <p className="text-base leading-7 text-[#99938a] sm:text-lg sm:leading-8">
                The students responsible for running Embedded Systems @ Purdue and keeping projects, workshops, and operations moving.
              </p>
              <p className="mt-4 font-mono text-[0.57rem] uppercase tracking-[0.15em] text-[#66625c]">
                {executives.length} current executives
              </p>
            </div>
          </div>
        </header>

        <section className="grid border-t-0 border-white/[0.08] sm:grid-cols-2 lg:grid-cols-5">
          {executives.map((member, index) => (
            <article
              key={member.name}
              className={`group border-b border-white/[0.08] bg-[#0e0e0c] ${
                index % 2 === 0 ? "sm:border-r" : ""
              } lg:border-r lg:last:border-r-0`}
            >
              <div className="relative aspect-[4/5] overflow-hidden border-b border-white/[0.08] bg-[#11110e]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover object-top grayscale-[12%] transition duration-700 ease-out group-hover:scale-[1.012] group-hover:grayscale-0"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/32 via-transparent to-transparent" />
              </div>

              <div className="min-h-[132px] px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-medium tracking-[-0.035em] text-[#e7e1d7]">{member.name}</h2>
                    <p className="mt-1.5 font-mono text-[0.57rem] uppercase tracking-[0.14em] text-[#8d783e]">
                      {member.role}
                    </p>
                  </div>

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="mt-0.5 text-[#6f6a62] transition-colors hover:text-[#f2c34f]"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
