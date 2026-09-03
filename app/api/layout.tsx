import type { ReactNode } from "react"

import { SiteResourceShell } from "@/components/site/site-resource-shell"

export default function ApiLayout({ children }: { children: ReactNode }) {
  return <SiteResourceShell label="Operations / Admin console">{children}</SiteResourceShell>
}
