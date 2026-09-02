"use client"

import { useEffect } from "react"

const REVEAL_SELECTOR = ":scope > section"
const REACTIVE_SELECTOR = '[data-landing-lift="card"]'

export function LandingInteractionGate() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>("[data-landing-shell]")
    if (!shell) return

    const navigation = shell.querySelector<HTMLElement>("[data-landing-navigation]")
    const content = shell.querySelector<HTMLElement>("#landing-content")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const sync = () => {
      if (shell.style.getPropertyValue("--landing-nav-opacity").trim() === "1") {
        navigation?.removeAttribute("inert")
      }

      if (shell.style.getPropertyValue("--landing-content-opacity").trim() === "1") {
        content?.removeAttribute("inert")
      }
    }

    sync()

    const shellObserver = new MutationObserver(sync)
    shellObserver.observe(shell, { attributes: true, attributeFilter: ["style"] })

    const revealElements = content
      ? Array.from(content.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
      : []

    revealElements.forEach((element, index) => {
      element.dataset.landingReveal = "section"
      element.style.setProperty("--landing-reveal-delay", `${Math.min(index, 3) * 35}ms`)
    })

    let revealObserver: IntersectionObserver | null = null

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.dataset.landingVisible = "true"
      })
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const element = entry.target as HTMLElement
            element.dataset.landingVisible = "true"
            revealObserver?.unobserve(element)
          })
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -8% 0px",
        }
      )

      revealElements.forEach((element) => revealObserver?.observe(element))
    }

    const reactiveElements = Array.from(
      shell.querySelectorAll<HTMLElement>(REACTIVE_SELECTOR)
    )
    const pointerCleanups: Array<() => void> = []

    if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      reactiveElements.forEach((element) => {
        element.dataset.landingReactive = "true"

        let pointerFrame = 0
        let pendingX = 0
        let pendingY = 0

        const applyPointer = () => {
          pointerFrame = 0
          const rect = element.getBoundingClientRect()
          if (!rect.width || !rect.height) return

          const x = Math.max(0, Math.min(1, (pendingX - rect.left) / rect.width))
          const y = Math.max(0, Math.min(1, (pendingY - rect.top) / rect.height))
          const tiltX = (x - 0.5) * 1.4
          const tiltY = (0.5 - y) * 1.15

          element.style.setProperty("--landing-pointer-x", `${(x * 100).toFixed(2)}%`)
          element.style.setProperty("--landing-pointer-y", `${(y * 100).toFixed(2)}%`)
          element.style.setProperty("--landing-tilt-x", `${tiltX.toFixed(3)}deg`)
          element.style.setProperty("--landing-tilt-y", `${tiltY.toFixed(3)}deg`)
        }

        const onPointerMove = (event: PointerEvent) => {
          pendingX = event.clientX
          pendingY = event.clientY
          if (!pointerFrame) pointerFrame = requestAnimationFrame(applyPointer)
        }

        const onPointerLeave = () => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame)
          pointerFrame = 0
          element.style.setProperty("--landing-pointer-x", "50%")
          element.style.setProperty("--landing-pointer-y", "50%")
          element.style.setProperty("--landing-tilt-x", "0deg")
          element.style.setProperty("--landing-tilt-y", "0deg")
        }

        element.addEventListener("pointermove", onPointerMove, { passive: true })
        element.addEventListener("pointerleave", onPointerLeave, { passive: true })

        pointerCleanups.push(() => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame)
          element.removeEventListener("pointermove", onPointerMove)
          element.removeEventListener("pointerleave", onPointerLeave)
          delete element.dataset.landingReactive
          element.style.removeProperty("--landing-pointer-x")
          element.style.removeProperty("--landing-pointer-y")
          element.style.removeProperty("--landing-tilt-x")
          element.style.removeProperty("--landing-tilt-y")
        })
      })
    }

    return () => {
      shellObserver.disconnect()
      revealObserver?.disconnect()
      pointerCleanups.forEach((cleanup) => cleanup())
      revealElements.forEach((element) => {
        delete element.dataset.landingReveal
        delete element.dataset.landingVisible
        element.style.removeProperty("--landing-reveal-delay")
      })
    }
  }, [])

  return null
}
