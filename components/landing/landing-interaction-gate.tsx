"use client"

import { useEffect } from "react"

const REVEAL_SELECTOR = ":scope > section"
const REACTIVE_SELECTOR = '[data-landing-lift="card"]'

const enhancementStyles = `
#landing-content > section[data-landing-reveal="section"] {
  --landing-reveal-progress: 0;
  --landing-reveal-opacity: 0;
  --landing-reveal-offset: 16px;
  --landing-reveal-line-opacity: 0;
  position: relative;
  opacity: var(--landing-reveal-opacity);
  transform: translate3d(0, var(--landing-reveal-offset), 0);
  will-change: opacity, transform;
}

#landing-content > section[data-landing-reveal="section"]::before {
  content: "";
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: min(460px, 42vw);
  height: 1px;
  pointer-events: none;
  opacity: var(--landing-reveal-line-opacity);
  transform: scaleX(var(--landing-reveal-progress));
  transform-origin: left center;
  background: linear-gradient(90deg, transparent, rgba(218,160,0,.18), rgba(244,198,77,.92), rgba(218,160,0,.16), transparent);
  box-shadow: 0 0 12px rgba(218,160,0,.14);
}

[data-landing-shell] [data-landing-reactive="true"] {
  --landing-pointer-x: 50%;
  --landing-pointer-y: 50%;
  --landing-tilt-x: 0deg;
  --landing-tilt-y: 0deg;
  transform-style: preserve-3d;
  will-change: transform;
}

[data-landing-shell] [data-landing-reactive="true"]::after {
  content: "";
  position: absolute;
  z-index: 10;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(330px circle at var(--landing-pointer-x) var(--landing-pointer-y), rgba(244,198,77,.11), rgba(218,160,0,.035) 32%, transparent 66%);
  box-shadow: inset 0 0 0 1px rgba(244,198,77,.08);
  transition: opacity 260ms ease-out;
}

#landing-content > section:nth-of-type(2) > div > div:not(:first-child) {
  position: relative;
  transition: background-color 320ms ease, transform 320ms cubic-bezier(.22,1,.36,1);
}

#landing-content > section:nth-of-type(2) > div > div:not(:first-child)::before {
  content: "";
  position: absolute;
  top: 18%;
  bottom: 18%;
  left: 0;
  width: 1px;
  pointer-events: none;
  opacity: 0;
  transform: scaleY(.2);
  transform-origin: center;
  background: linear-gradient(to bottom, transparent, rgba(244,198,77,.72), transparent);
  box-shadow: 0 0 12px rgba(218,160,0,.18);
  transition: opacity 260ms ease, transform 360ms cubic-bezier(.22,1,.36,1);
}

#landing-content > section:nth-of-type(2) > div > div:not(:first-child) h3 {
  transition: color 240ms ease, transform 320ms cubic-bezier(.22,1,.36,1);
}

#landing-content > section:nth-of-type(3) a[href^="/workshops/"] {
  transition:
    padding-left 280ms cubic-bezier(.22,1,.36,1),
    background-color 280ms ease,
    color 220ms ease;
}

@media (hover: hover) and (pointer: fine) {
  [data-landing-shell] a:hover,
  [data-landing-shell] button:hover {
    transform: none;
  }

  [data-landing-shell] [data-landing-lift="button"]:hover {
    position: relative;
    z-index: 4;
    transform: translateY(-2px) scale(1.012);
    box-shadow: 0 10px 28px rgba(0, 0, 0, .22);
  }

  [data-landing-shell] [data-landing-reactive="true"]:hover {
    position: relative;
    z-index: 6;
    transform: perspective(1100px) translateY(-4px) rotateX(var(--landing-tilt-y)) rotateY(var(--landing-tilt-x)) scale(1.008);
    box-shadow: 0 20px 52px rgba(0, 0, 0, .34), 0 0 0 1px rgba(244, 198, 77, .07);
  }

  [data-landing-shell] [data-landing-reactive="true"]:hover::after {
    opacity: 1;
  }

  #landing-content > section:nth-of-type(2) > div > div:not(:first-child):hover {
    background-color: rgba(218,160,0,.018);
    transform: translate3d(0, -2px, 0);
  }

  #landing-content > section:nth-of-type(2) > div > div:not(:first-child):hover::before {
    opacity: 1;
    transform: scaleY(1);
  }

  #landing-content > section:nth-of-type(2) > div > div:not(:first-child):hover h3 {
    color: #f3efe6;
    transform: translateX(3px);
  }

  #landing-content > section:nth-of-type(3) a[href^="/workshops/"]:hover {
    padding-left: 8px;
    background-color: rgba(218,160,0,.018);
  }
}

@media (prefers-reduced-motion: reduce) {
  #landing-content > section[data-landing-reveal="section"] {
    opacity: 1 !important;
    transform: none !important;
    will-change: auto;
  }

  #landing-content > section[data-landing-reveal="section"]::before,
  [data-landing-shell] [data-landing-reactive="true"]::after,
  #landing-content > section:nth-of-type(2) > div > div:not(:first-child)::before {
    display: none;
  }

  #landing-content > section:nth-of-type(2) > div > div:not(:first-child),
  #landing-content > section:nth-of-type(3) a[href^="/workshops/"] {
    transform: none !important;
    transition-duration: 0ms !important;
  }
}
`

function smoothstep(value: number) {
  return value * value * (3 - 2 * value)
}

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

    revealElements.forEach((element) => {
      element.dataset.landingReveal = "section"
    })

    let revealFrame = 0
    let removeRevealListeners: (() => void) | null = null

    const setRevealProgress = (element: HTMLElement, progress: number) => {
      const eased = smoothstep(progress)
      const offset = (1 - eased) * 16
      const lineOpacity = Math.max(0, 1 - Math.abs(eased - 0.52) / 0.52) * 0.62

      element.style.setProperty("--landing-reveal-progress", eased.toFixed(4))
      element.style.setProperty("--landing-reveal-opacity", eased.toFixed(4))
      element.style.setProperty("--landing-reveal-offset", `${offset.toFixed(2)}px`)
      element.style.setProperty("--landing-reveal-line-opacity", lineOpacity.toFixed(4))
    }

    const updateRevealProgress = () => {
      revealFrame = 0
      const viewportHeight = window.innerHeight
      const fadeStart = viewportHeight * 0.96
      const fadeEnd = viewportHeight * 0.72
      const fadeDistance = Math.max(1, fadeStart - fadeEnd)

      revealElements.forEach((element) => {
        const top = element.getBoundingClientRect().top
        const rawProgress = (fadeStart - top) / fadeDistance
        const progress = Math.max(0, Math.min(1, rawProgress))
        setRevealProgress(element, progress)
      })
    }

    const scheduleRevealUpdate = () => {
      if (!revealFrame) revealFrame = requestAnimationFrame(updateRevealProgress)
    }

    if (reducedMotion) {
      revealElements.forEach((element) => setRevealProgress(element, 1))
    } else {
      updateRevealProgress()
      window.addEventListener("scroll", scheduleRevealUpdate, { passive: true })
      window.addEventListener("resize", scheduleRevealUpdate, { passive: true })
      removeRevealListeners = () => {
        window.removeEventListener("scroll", scheduleRevealUpdate)
        window.removeEventListener("resize", scheduleRevealUpdate)
      }
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
      if (revealFrame) cancelAnimationFrame(revealFrame)
      removeRevealListeners?.()
      pointerCleanups.forEach((cleanup) => cleanup())
      revealElements.forEach((element) => {
        delete element.dataset.landingReveal
        element.style.removeProperty("--landing-reveal-progress")
        element.style.removeProperty("--landing-reveal-opacity")
        element.style.removeProperty("--landing-reveal-offset")
        element.style.removeProperty("--landing-reveal-line-opacity")
      })
    }
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: enhancementStyles }} />
}
