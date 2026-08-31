"use client"

import { useEffect, useState } from "react"
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

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === "/"

  useEffect(() => {
    if (!onHome) return

    window.scrollTo(0, 0)
    const frame = window.requestAnimationFrame(() => window.scrollTo(0, 0))

    return () => window.cancelAnimationFrame(frame)
  }, [onHome])

  return (
    <nav
      className={`${
        onHome
          ? "absolute top-0 border-b border-white/[0.09] bg-[#11110f]/92 opacity-[var(--landing-nav-opacity,1)] backdrop-blur-md transition-opacity duration-700 ease-out"
          : "sticky top-0 border-b border-white/[0.08] bg-[#11110f]/90 backdrop-blur-xl"
      } z-50 w-full`}
    >
      <div className="relative mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
        <Link href="/" className="group flex items-center gap-4" aria-label="Embedded Systems @ Purdue home">
          <Image
            src="/logo.svg"
            alt="Embedded Systems @ Purdue"
            width={76}
            height={25}
            className="h-auto w-[76px] object-contain"
            priority
          />
          <div className="hidden border-l border-white/10 pl-4 sm:block">
            <div className="font-mono text-[0.58rem] uppercase tracking-[0.19em] text-[#8d887f]">Embedded Systems @ Purdue</div>
            <div className="mt-0.5 text-[0.72rem] font-medium tracking-[-0.01em] text-[#d9d3c8]">Hardware / Firmware / Systems</div>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex lg:gap-9">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-[#f0ece2]" : "text-[#8d887f] hover:text-[#f0ece2]"
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
            className="group inline-flex h-9 items-center gap-2 border border-[#daa000]/45 px-4 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#e2c267] transition-colors hover:border-[#daa000] hover:bg-[#daa000] hover:text-[#11110f]"
          >
            Join Discord
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center border border-white/10 bg-[#11110f]/45 text-[#d6d1c7] transition-colors hover:border-[#daa000]/50 hover:text-[#f2c34f]"
                aria-label="Open navigation"
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-[360px] border-l border-white/10 bg-[#151512] p-0 text-[#f3efe6]">
              <div className="border-b border-white/10 px-6 py-6">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.17em] text-[#daa000]">Embedded Systems @ Purdue / Navigation</span>
              </div>
              <div className="flex flex-col">
                {navigation.map((item, index) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex min-h-16 items-center justify-between border-b border-white/[0.08] px-6 text-xl font-medium tracking-[-0.03em] transition-colors ${
                        active ? "bg-white/[0.04] text-[#f2c34f]" : "text-[#d4cfc5] hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="font-mono text-[0.58rem] tracking-[0.14em] text-[#69665f]">0{index + 1}</span>
                    </Link>
                  )
                })}
              </div>
              <div className="p-6">
                <Link
                  href="https://discord.gg/MkPv9s9cj3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-between bg-[#daa000] px-4 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#11110f]"
                >
                  Join Discord
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
