"use client"

import { useEffect } from "react"

const REVEAL_SELECTOR = ":scope > section"
const REACTIVE_SELECTOR = '[data-landing-lift="card"]'

const enhancementStyles = `
@keyframes landing-section-signal-sweep {
  0% { opacity: 0; transform: translate3d(-125%, 0, 0); }
  18% { opacity: .78; }
  72% { opacity: .38; }
  100% { opacity: 0; transform: translate3d(290%, 0, 0); }
}

#landing-content > section[data-landing-reveal="section"] {
  position: relative;
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition:
    opacity 540ms cubic-bezier(.2, .65, .25, 1) var(--landing-reveal-delay, 0ms),
    transform 620ms cubic-bezier(.22, 1, .36, 1) var(--landing-reveal-delay, 0ms);
}

#landing-content > section[data-landing-reveal="section"][data-landing-visible="true"] {
  opacity: 1;
  transform: translate3d(0, 0, 0);
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
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(218,160,0,.18), rgba(244,198,77,.92), rgba(218,160,0,.16), transparent);
  box-shadow: 0 0 12px rgba(218,160,0,.14);
}

#landing-content > section[data-landing-reveal="section"][data-landing-visible="true"]::before {
  animation: landing-section-signal-sweep 800ms cubic-bezier(.22,1,.36,1) calc(var(--landing-reveal-delay, 0ms) + 40ms) both;
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
    opacity: 1;
    transform: none !important;
    transition-duration: 0ms !important;
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
      element.style.setProperty("--landing-reveal-delay", `${Math.min(index, 2) * 10}ms`)
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
          threshold: 0.01,
          rootMargin: "0px 0px 4% 0px",
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

  return <style dangerouslySetInnerHTML={{ __html: enhancementStyles }} />
}
