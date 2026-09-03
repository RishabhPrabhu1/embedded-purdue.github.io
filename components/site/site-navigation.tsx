"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Workshops", href: "/workshops" },
  { name: "Team", href: "/team" },
  { name: "Sponsors", href: "/sponsors" },
]

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090908]/92 text-[#f3efe6] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[68px] w-full items-center justify-between px-5 sm:px-8 lg:w-[calc(100%_-_48px)] lg:border-x lg:border-white/[0.05] lg:px-8 xl:px-10 2xl:w-[calc(100%_-_80px)] 2xl:px-12">
        <Link href="/" className="flex items-center gap-4" aria-label="Embedded Systems @ Purdue home">
          <Image
            src="/logo.svg"
            alt="Embedded Systems @ Purdue"
            width={72}
            height={23}
            className="h-auto w-[72px] object-contain"
            priority
          />
          <span className="hidden border-l border-white/[0.09] pl-4 font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#9b968d] sm:block">
            Embedded Systems @ Purdue
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {navigation.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] transition-colors ${
                  active ? "text-[#f0ece2]" : "text-[#89857d] hover:text-[#f0ece2]"
                }`}
              >
                {item.name}
                {active && <span className="absolute inset-x-0 -bottom-[17px] h-px bg-[#daa000]" />}
              </Link>
            )
          })}

          <Link
            href="https://discord.gg/MkPv9s9cj3"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-9 items-center gap-2 border border-[#7289ff]/35 bg-[#5865F2] px-4 font-mono text-[0.61rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_6px_20px_rgba(88,101,242,.16)] transition-colors hover:border-[#8b96ff] hover:bg-[#6875f5]"
          >
            Discord
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center border border-white/[0.09] bg-black/30 text-[#d6d1c7] transition-colors hover:border-[#daa000]/45 hover:text-[#f2c34f]"
                aria-label={isOpen ? "Close navigation" : "Open navigation"}
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-[360px] border-l border-white/[0.08] bg-[#0d0d0b] p-0 text-[#f3efe6]">
              <div className="border-b border-white/[0.08] px-6 py-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#a8a197]">
                Embedded Systems @ Purdue
              </div>
              <div className="flex flex-col">
                {navigation.map((item) => {
                  const active = isActivePath(pathname, item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex min-h-16 items-center border-b border-white/[0.07] px-6 text-xl font-medium tracking-[-0.03em] transition-colors ${
                        active ? "text-[#f2c34f]" : "text-[#d4cfc5] hover:bg-white/[0.025] hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <div className="p-6">
                <Link
                  href="https://discord.gg/MkPv9s9cj3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-between bg-[#5865F2] px-4 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#6875f5]"
                >
                  Discord
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
