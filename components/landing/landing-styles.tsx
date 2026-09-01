const landingStyles = `
[data-landing-shell] a:focus-visible,
[data-landing-shell] button:focus-visible {
  outline: 1px solid rgba(244, 198, 77, 0.78);
  outline-offset: 3px;
}

@keyframes landing-vertical-tail-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

[data-landing-shell] > section:first-of-type::before,
[data-landing-shell] > section:first-of-type::after {
  content: "";
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  height: max(0px, calc((100svh - clamp(600px, 78svh, 760px)) / 2 + 3px));
  pointer-events: none;
  opacity: 0.68;
  background-image:
    linear-gradient(to right, transparent calc(20% - 0.7px), rgba(218,160,0,.58) calc(20% - 0.7px), rgba(244,198,77,.88) 20%, rgba(218,160,0,.58) calc(20% + 0.7px), transparent calc(20% + 0.7px)),
    linear-gradient(to right, transparent calc(40% - 0.7px), rgba(218,160,0,.58) calc(40% - 0.7px), rgba(244,198,77,.88) 40%, rgba(218,160,0,.58) calc(40% + 0.7px), transparent calc(40% + 0.7px)),
    linear-gradient(to right, transparent calc(60% - 0.7px), rgba(218,160,0,.58) calc(60% - 0.7px), rgba(244,198,77,.88) 60%, rgba(218,160,0,.58) calc(60% + 0.7px), transparent calc(60% + 0.7px)),
    linear-gradient(to right, transparent calc(80% - 0.7px), rgba(218,160,0,.58) calc(80% - 0.7px), rgba(244,198,77,.88) 80%, rgba(218,160,0,.58) calc(80% + 0.7px), transparent calc(80% + 0.7px));
  filter: drop-shadow(0 0 5px rgba(218,160,0,.42)) drop-shadow(0 0 14px rgba(218,160,0,.12));
  animation: landing-vertical-tail-grow .78s cubic-bezier(.22,1,.36,1) 1.05s both;
  transition: opacity 420ms ease-out;
}

[data-landing-shell] > section:first-of-type::before {
  top: 0;
  transform-origin: bottom;
  -webkit-mask-image: linear-gradient(to top, black 42%, rgba(0,0,0,.72) 72%, transparent 100%);
  mask-image: linear-gradient(to top, black 42%, rgba(0,0,0,.72) 72%, transparent 100%);
}

[data-landing-shell] > section:first-of-type::after {
  bottom: 0;
  transform-origin: top;
  -webkit-mask-image: linear-gradient(to bottom, black 42%, rgba(0,0,0,.72) 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 42%, rgba(0,0,0,.72) 72%, transparent 100%);
}

[data-landing-shell][style*="--landing-content-opacity: 1"] > section:first-of-type::before,
[data-landing-shell][style*="--landing-content-opacity: 1"] > section:first-of-type::after {
  opacity: 0;
}

#hero-intro [data-hero-intro-grid] > div:first-child p {
  display: none;
}

#hero-intro a[href*="discord.gg"] {
  border-radius: 0;
  background: #daa000;
  color: #11110f;
  font-family: var(--font-geist-mono);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

#hero-intro a[href*="discord.gg"]:hover {
  background: #efbd27;
}

[data-landing-shell] a[class*="inline-flex"]:not([href*="discord.gg"]),
[data-landing-shell] nav a[class*="uppercase"]:not([href*="discord.gg"]) {
  position: relative;
}

[data-landing-shell] a[class*="inline-flex"]:not([href*="discord.gg"])::after,
[data-landing-shell] nav a[class*="uppercase"]:not([href*="discord.gg"])::after {
  content: "";
  position: absolute;
  inset: -8px -10px;
  background: transparent;
}

[data-landing-shell] nav a[href*="discord.gg"] {
  border-color: rgba(124, 134, 255, 0.28);
  background: rgba(88, 101, 242, 0.10);
  color: #c5caff;
  box-shadow: none;
}

[data-landing-shell] nav a[href*="discord.gg"]:hover {
  border-color: rgba(139, 150, 255, 0.52);
  background: rgba(88, 101, 242, 0.20);
  color: #f4f5ff;
  box-shadow: 0 6px 18px rgba(88, 101, 242, 0.10);
}

#landing-content a[href*="discord.gg"] {
  border: 1px solid rgba(124, 134, 255, 0.30);
  background: rgba(88, 101, 242, 0.11);
  color: #c7ccff;
  box-shadow: none;
}

#landing-content a[href*="discord.gg"]:hover {
  border-color: rgba(139, 150, 255, 0.56);
  background: rgba(88, 101, 242, 0.22);
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(88, 101, 242, 0.11);
}

[data-landing-shell] a,
[data-landing-shell] button {
  transform-origin: center;
  transition-property: transform, box-shadow, color, background-color, border-color, opacity;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(.22, 1, .36, 1);
}

@media (hover: hover) and (pointer: fine) {
  [data-landing-shell] a:hover,
  [data-landing-shell] button:hover {
    position: relative;
    z-index: 4;
    transform: translateY(-1.5px) scale(1.018);
  }

  [data-landing-shell] [data-landing-lift="card"]:hover {
    z-index: 6;
    transform: translateY(-4px) scale(1.008);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(244, 198, 77, 0.10);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-landing-shell] > section:first-of-type::before,
  [data-landing-shell] > section:first-of-type::after {
    display: none;
  }

  [data-landing-shell] a,
  [data-landing-shell] button,
  [data-landing-shell] [data-landing-lift="card"] {
    transform: none !important;
    transition-duration: 0ms;
  }
}

@media (min-width: 1024px) {
  #hero-intro {
    height: min(276px, calc(100svh - clamp(500px, 66svh, 600px)));
    min-height: 0;
    overflow: hidden;
  }

  #hero-intro [data-hero-intro-grid] {
    height: 100%;
    width: calc(100% - 48px);
    max-width: none;
    grid-template-columns: minmax(0, 1.53fr) minmax(320px, 0.47fr);
    grid-template-rows: minmax(0, 1fr);
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(1) {
    display: none;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(2) {
    grid-column: 1;
    grid-row: 1;
    align-items: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 0;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(2) h1 {
    max-width: 1100px;
    font-size: clamp(3.2rem, 5vw, 5.7rem);
    line-height: 0.88;
    letter-spacing: -0.06em;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(3) {
    grid-column: 2;
    grid-row: 1;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(3) > div {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(3) p {
    max-width: 520px;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  #hero-intro [data-hero-intro-grid] > div:nth-child(3) > div > div {
    margin-top: 0;
  }
}

@media (min-width: 1536px) {
  #hero-intro [data-hero-intro-grid] {
    width: calc(100% - 80px);
  }
}
`

export function LandingStyles() {
  return <style dangerouslySetInnerHTML={{ __html: landingStyles }} />
}
