import type { ReactNode } from "react"

import { SiteResourceShell } from "@/components/site/site-resource-shell"

export default function FormsLayout({ children }: { children: ReactNode }) {
  return <SiteResourceShell label="Operations / Member intake">{children}</SiteResourceShell>
}
