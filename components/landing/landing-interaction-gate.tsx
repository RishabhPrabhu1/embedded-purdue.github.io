"use client"

import { useEffect } from "react"

export function LandingInteractionGate() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-landing-shell]")
    if (!shell) return

    const navigation = shell.querySelector<HTMLElement>("[data-landing-navigation]")
    const content = shell.querySelector<HTMLElement>("#landing-content")

    const sync = () => {
      if (shell.style.getPropertyValue("--landing-nav-opacity").trim() === "1") {
        navigation?.removeAttribute("inert")
      }

      if (shell.style.getPropertyValue("--landing-content-opacity").trim() === "1") {
        content?.removeAttribute("inert")
      }
    }

    sync()

    const observer = new MutationObserver(sync)
    observer.observe(shell, { attributes: true, attributeFilter: ["style"] })

    return () => observer.disconnect()
  }, [])

  return null
}
