import type { ReactNode } from "react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteNavigation } from "@/components/site/site-navigation"

const WIDE_RAIL = "mx-auto w-full lg:w-[calc(100%_-_48px)] 2xl:w-[calc(100%_-_80px)]"

const resourceStyles = `
[data-site-resource-shell] main > section {
  background: transparent !important;
  box-shadow: none !important;
}

[data-site-resource-shell] main > section + section {
  margin-top: 0 !important;
  border-top: 0 !important;
}

[data-site-resource-shell] .bg-card,
[data-site-resource-shell] .bg-background,
[data-site-resource-shell] .bg-muted,
[data-site-resource-shell] [class*="bg-muted/"] {
  background: transparent !important;
}

[data-site-resource-shell] button:not([class*="bg-primary"]) {
  background: transparent !important;
  box-shadow: none !important;
}

[data-site-resource-shell] [class*="bg-green-100"] {
  background: rgba(69, 139, 91, .10) !important;
  color: #91c49e !important;
  box-shadow: inset 0 0 0 1px rgba(91, 166, 111, .22) !important;
}

[data-site-resource-shell] [class*="bg-red-100"] {
  background: rgba(177, 72, 66, .10) !important;
  color: #d99a93 !important;
  box-shadow: inset 0 0 0 1px rgba(190, 83, 76, .22) !important;
}

[data-site-resource-shell] [class*="bg-yellow-100"],
[data-site-resource-shell] [class*="bg-yellow-50"] {
  background: rgba(218, 160, 0, .075) !important;
  color: #c9aa56 !important;
  box-shadow: inset 0 0 0 1px rgba(218, 160, 0, .20) !important;
}

[data-site-resource-shell] [class*="text-green-700"] { color: #91c49e !important; }
[data-site-resource-shell] [class*="text-red-700"] { color: #d99a93 !important; }
[data-site-resource-shell] [class*="text-yellow-700"],
[data-site-resource-shell] [class*="text-yellow-900"] { color: #c9aa56 !important; }

[data-site-resource-shell] details[open] {
  border-color: rgba(218, 160, 0, .20) !important;
}

[data-site-resource-shell] summary {
  cursor: pointer;
  color: #928b82;
}
`

export function SiteResourceShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div data-site-resource-shell className="min-h-screen bg-[#0c0c0b] text-[#f3efe6]">
      <SiteNavigation />
      <style dangerouslySetInnerHTML={{ __html: resourceStyles }} />
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
