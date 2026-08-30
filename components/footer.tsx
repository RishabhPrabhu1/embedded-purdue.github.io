import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"

const explore = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Workshops", "/workshops"],
  ["Team", "/team"],
  ["Sponsors", "/sponsors"],
]

const connect = [
  ["GitHub", "https://github.com/embedded-purdue"],
  ["LinkedIn", "https://www.linkedin.com/company/embedded-purdue"],
  ["Discord", "https://discord.gg/MkPv9s9cj3"],
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.09] bg-[#0c0c0b] px-5 pb-8 pt-16 text-[#f3efe6] sm:px-8 lg:px-12 lg:pt-20 xl:px-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 pb-16 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Embedded Systems at Purdue home">
              <Image src="/logo.svg" alt="Embedded Systems at Purdue" width={112} height={36} className="h-auto w-28" />
            </Link>
            <p className="mt-7 max-w-sm text-sm leading-6 text-[#858179] sm:text-base sm:leading-7">
              Purdue&apos;s student-run community for embedded hardware, firmware, FPGA, robotics, and systems engineering.
            </p>
          </div>

          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#66635d]">Explore</p>
            <div className="mt-5 flex flex-col gap-3">
              {explore.map(([label, href]) => (
                <Link key={href} href={href} className="w-fit text-sm text-[#b7b2a8] transition-colors hover:text-[#f2c34f]">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#66635d]">Connect</p>
            <div className="mt-5 flex flex-col gap-3">
              {connect.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-2 text-sm text-[#b7b2a8] transition-colors hover:text-[#f2c34f]"
                >
                  {label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#66635d]">Contact</p>
            <Link
              href="mailto:embedded@purdue.edu"
              className="group mt-5 flex w-fit items-center gap-2 text-sm text-[#b7b2a8] transition-colors hover:text-[#f2c34f]"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              embedded@purdue.edu
            </Link>
            <div className="mt-7 flex items-center gap-3 text-[#68655f]">
              <Github className="h-4 w-4" strokeWidth={1.5} />
              <Linkedin className="h-4 w-4" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#5f5c56] sm:flex-row sm:items-center sm:justify-between">
          <span>Embedded Systems @ Purdue</span>
          <span>West Lafayette, Indiana / {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
