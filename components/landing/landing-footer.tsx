import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const explore = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Workshops", "/workshops"],
  ["Team", "/team"],
  ["Sponsors", "/sponsors"],
]

const connect = [
  ["Discord", "https://discord.gg/MkPv9s9cj3"],
  ["GitHub", "https://github.com/embedded-purdue"],
  ["LinkedIn", "https://www.linkedin.com/company/embedded-purdue"],
  ["Email", "mailto:embedded@purdue.edu"],
]

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090908] py-11 text-[#f3efe6] lg:py-12">
      <div className="mx-auto w-full px-5 sm:px-8 lg:w-[calc(100%_-_48px)] lg:border-x lg:border-white/[0.05] lg:px-8 xl:px-10 2xl:w-[calc(100%_-_80px)] 2xl:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Link href="/" className="inline-flex items-center gap-4" aria-label="Embedded Systems @ Purdue home">
              <Image src="/logo.svg" alt="Embedded Systems @ Purdue" width={96} height={31} className="h-auto w-24" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#817d75]">
              Hardware, firmware, and systems built by students.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#5f5c56]">Explore</p>
              <div className="mt-4 flex flex-col gap-2.5">
                {explore.map(([label, href]) => (
                  <Link key={href} href={href} className="w-fit text-sm text-[#aaa59c] transition-colors hover:text-[#f2c34f]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#5f5c56]">Connect</p>
              <div className="mt-4 flex flex-col gap-2.5">
                {connect.map(([label, href]) => {
                  const external = href.startsWith("http")
                  return (
                    <Link
                      key={href}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group flex w-fit items-center gap-2 text-sm text-[#aaa59c] transition-colors hover:text-[#f2c34f]"
                    >
                      {label}
                      {external && (
                        <ArrowUpRight
                          className="h-3 w-3 opacity-45 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] pt-5 font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#55524d] sm:flex-row sm:items-center sm:justify-between">
          <span>Embedded Systems @ Purdue</span>
          <span>West Lafayette, Indiana · {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
