import type { ReactNode } from "react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

export function SiteResourceShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div data-site-resource-shell className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />
      <div className="border-b border-white/[0.08] bg-black">
        <div className={`${WIDE_RAIL} flex min-h-12 items-center justify-between gap-4 px-5 sm:px-8 lg:border-x lg:border-white/[0.06] lg:px-12 xl:px-16`}>
          <div className="flex items-center gap-3 font-mono text-[0.56rem] uppercase tracking-[0.17em] text-[#8f887f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#daa000] shadow-[0_0_8px_rgba(218,160,0,.3)]" />
            {label}
          </div>
          <span className="hidden font-mono text-[0.52rem] uppercase tracking-[0.15em] text-[#55514b] sm:block">
            Internal ES@P tooling
          </span>
        </div>
      </div>
      {children}
      <SiteFooter />
    </div>
  )
}
