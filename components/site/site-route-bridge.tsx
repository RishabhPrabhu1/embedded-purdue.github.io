"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

type Bridge = {
  eyebrow: string
  title: string
  href: string
  direction?: "forward" | "back"
}

function resolveBridge(pathname: string): Bridge | null {
  if (pathname.startsWith("/api") || pathname.startsWith("/forms")) return null

  if (pathname.startsWith("/projects/")) {
    return { eyebrow: "Return / Project archive", title: "Back to all systems.", href: "/projects", direction: "back" }
  }
  if (pathname.startsWith("/workshops/")) {
    return { eyebrow: "Return / Workshop archive", title: "Back to all sessions.", href: "/workshops", direction: "back" }
  }
  if (pathname === "/about") {
    return { eyebrow: "Next / Projects", title: "See the systems being built.", href: "/projects" }
  }
  if (pathname === "/projects") {
    return { eyebrow: "Next / Workshops", title: "Learn the tools behind the builds.", href: "/workshops" }
  }
  if (pathname === "/workshops") {
    return { eyebrow: "Next / Team", title: "Meet the people behind the work.", href: "/team" }
  }
  if (pathname === "/team") {
    return { eyebrow: "Next / Sponsors", title: "Help put better tools in their hands.", href: "/sponsors" }
  }
  if (pathname === "/sponsors") {
    return { eyebrow: "Loop / About", title: "Return to the ES@P system.", href: "/about" }
  }

  return null
}

export function SiteRouteBridge() {
  const pathname = usePathname()
  const bridge = resolveBridge(pathname)
  if (!bridge) return null

  const BackIcon = bridge.direction === "back" ? ArrowLeft : ArrowRight

  return (
    <div className="border-t border-white/[0.08] bg-black text-[#f3efe6]">
      <Link
        href={bridge.href}
        className="group mx-auto grid w-full grid-cols-[1fr_auto] items-center gap-6 px-5 py-6 no-underline sm:px-8 lg:w-[calc(100%_-_48px)] lg:border-x lg:border-white/[0.05] lg:px-10 lg:py-7 xl:px-12 2xl:w-[calc(100%_-_80px)]"
      >
        <div className="min-w-0">
          <p className="font-mono text-[0.53rem] uppercase tracking-[0.17em] text-[#756f67]">{bridge.eyebrow}</p>
          <p className="mt-2 text-[clamp(1.6rem,2.8vw,2.8rem)] font-medium leading-[0.95] tracking-[-0.05em] text-[#dcd6cc] transition-colors group-hover:text-[#f2c34f]">
            {bridge.title}
          </p>
        </div>
        <span className="grid h-11 w-11 place-items-center border border-white/[0.1] text-[#968f84] transition-all duration-300 group-hover:border-[#daa000]/45 group-hover:text-[#f2c34f]">
          <BackIcon
            className={`h-4 w-4 transition-transform duration-300 ${
              bridge.direction === "back" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
            }`}
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  )
}
