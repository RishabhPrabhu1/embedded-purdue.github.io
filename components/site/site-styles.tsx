const siteStyles = `
html:has([data-site-navigation]) {
  scroll-padding-top: 84px;
  scroll-behavior: smooth;
  background: #0c0c0b;
}

body:has([data-site-navigation]) {
  background: #0c0c0b;
  color-scheme: dark;
}

body:has([data-site-navigation]) ::selection {
  background: rgba(218, 160, 0, 0.32);
  color: #f7f2e8;
}

body:has([data-site-navigation]) a:focus-visible,
body:has([data-site-navigation]) button:focus-visible,
body:has([data-site-navigation]) input:focus-visible,
body:has([data-site-navigation]) select:focus-visible,
body:has([data-site-navigation]) textarea:focus-visible,
body:has([data-site-navigation]) [tabindex]:focus-visible {
  outline: 1px solid rgba(244, 198, 77, 0.78);
  outline-offset: 3px;
}

body:has([data-site-navigation]) a,
body:has([data-site-navigation]) button,
body:has([data-site-navigation]) input,
body:has([data-site-navigation]) select,
body:has([data-site-navigation]) textarea {
  transition-property: transform, box-shadow, color, background-color, border-color, opacity;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(.22, 1, .36, 1);
}

body:has([data-site-navigation]) [data-site-navigation] a,
body:has([data-site-navigation]) [data-site-navigation] button,
body:has([data-site-navigation]) footer a,
body:has([data-site-navigation]) main a[class*="inline-flex"],
body:has([data-site-navigation]) main button {
  transform-origin: center;
}

body:has([data-site-navigation]) main a[href*="discord.gg"] {
  border: 1px solid rgba(124, 134, 255, 0.30);
  background: rgba(88, 101, 242, 0.11);
  color: #c7ccff;
  box-shadow: none;
}

body:has([data-site-navigation]) main a[href*="discord.gg"]:hover {
  border-color: rgba(139, 150, 255, 0.56);
  background: rgba(88, 101, 242, 0.22);
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(88, 101, 242, 0.11);
}

body:has([data-site-navigation]) [data-site-lift="card"] {
  position: relative;
  transform-origin: center;
  transition-property: transform, box-shadow, background-color, border-color;
  transition-duration: 320ms;
  transition-timing-function: cubic-bezier(.22, 1, .36, 1);
}

body:has([data-site-navigation]) [data-site-lift="card"]::after {
  content: "";
  position: absolute;
  z-index: 8;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(218,160,0,.34) 18%, rgba(244,198,77,.92) 58%, transparent 100%);
  opacity: 0;
  transform: scaleX(.18);
  transform-origin: left center;
  transition: transform 520ms cubic-bezier(.22,1,.36,1), opacity 260ms ease-out;
}

body:has([data-site-navigation]) main > section:first-child {
  position: relative;
  isolation: isolate;
  overflow: clip;
  animation: site-page-enter 480ms cubic-bezier(.22, 1, .36, 1) both;
}

body:has([data-site-navigation]) main > section:first-child::before {
  content: "";
  position: absolute;
  z-index: 0;
  inset: 0;
  pointer-events: none;
  opacity: .18;
  background-image:
    linear-gradient(to right, transparent calc(20% - .5px), rgba(218,160,0,.34) 20%, transparent calc(20% + .5px)),
    linear-gradient(to right, transparent calc(40% - .5px), rgba(218,160,0,.24) 40%, transparent calc(40% + .5px)),
    linear-gradient(to right, transparent calc(60% - .5px), rgba(218,160,0,.24) 60%, transparent calc(60% + .5px)),
    linear-gradient(to right, transparent calc(80% - .5px), rgba(218,160,0,.34) 80%, transparent calc(80% + .5px)),
    linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 42px;
  -webkit-mask-image: linear-gradient(to bottom, black, rgba(0,0,0,.72) 58%, transparent 100%);
  mask-image: linear-gradient(to bottom, black, rgba(0,0,0,.72) 58%, transparent 100%);
}

body:has([data-site-navigation]) main > section:first-child::after {
  content: "";
  position: absolute;
  z-index: 0;
  top: -220px;
  left: 50%;
  width: min(820px, 72vw);
  height: 420px;
  pointer-events: none;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(218,160,0,.08), rgba(218,160,0,.018) 48%, transparent 72%);
  filter: blur(8px);
}

body:has([data-site-navigation]) main > section:first-child > * {
  position: relative;
  z-index: 1;
}

body:has([data-site-navigation]) [data-site-markdown] .prose {
  --tw-prose-body: #9a958c;
  --tw-prose-headings: #ece7dc;
  --tw-prose-lead: #9a958c;
  --tw-prose-links: #d8aa27;
  --tw-prose-bold: #e8e2d8;
  --tw-prose-counters: #7d776f;
  --tw-prose-bullets: #8f7325;
  --tw-prose-hr: rgba(255, 255, 255, 0.10);
  --tw-prose-quotes: #b7b0a6;
  --tw-prose-quote-borders: #daa000;
  --tw-prose-captions: #777169;
  --tw-prose-code: #e0dacf;
  --tw-prose-pre-code: #bdb7ad;
  --tw-prose-pre-bg: #090908;
  --tw-prose-th-borders: rgba(255, 255, 255, 0.12);
  --tw-prose-td-borders: rgba(255, 255, 255, 0.08);
}

body:has([data-site-navigation]) [data-site-markdown] h1,
body:has([data-site-navigation]) [data-site-markdown] h2,
body:has([data-site-navigation]) [data-site-markdown] h3,
body:has([data-site-navigation]) [data-site-markdown] h4 {
  color: #ece7dc !important;
  border-color: rgba(255, 255, 255, 0.09) !important;
  background: none !important;
  -webkit-text-fill-color: currentColor !important;
}

body:has([data-site-navigation]) [data-site-markdown] p,
body:has([data-site-navigation]) [data-site-markdown] li,
body:has([data-site-navigation]) [data-site-markdown] td {
  color: #9a958c;
}

body:has([data-site-navigation]) [data-site-markdown] strong {
  color: #e6e0d5;
}

body:has([data-site-navigation]) [data-site-markdown] a {
  color: #d8aa27 !important;
  text-decoration-color: rgba(216, 170, 39, 0.42) !important;
}

body:has([data-site-navigation]) [data-site-markdown] a:hover {
  color: #f2c34f !important;
  text-decoration-color: rgba(242, 195, 79, 0.75) !important;
}

body:has([data-site-navigation]) [data-site-markdown] img,
body:has([data-site-navigation]) [data-site-markdown] iframe,
body:has([data-site-navigation]) [data-site-markdown] pre,
body:has([data-site-navigation]) [data-site-markdown] table {
  border-radius: 0 !important;
  border-color: rgba(255, 255, 255, 0.10) !important;
}

body:has([data-site-navigation]) [data-site-markdown] blockquote {
  border-radius: 0 !important;
  border-left-color: #daa000 !important;
  background: rgba(218, 160, 0, 0.045) !important;
  color: #aaa49a !important;
  box-shadow: none !important;
}

body:has([data-site-navigation]) [data-site-markdown] code {
  border-color: rgba(255, 255, 255, 0.10) !important;
  background: #11110f !important;
  color: #d7d1c6 !important;
}

body:has([data-site-navigation]) [data-site-markdown] pre {
  background: #090908 !important;
  box-shadow: none !important;
}

[data-site-resource-shell] {
  background: #0c0c0b;
  color: #d9d3c8;
}

[data-site-resource-shell] main {
  width: min(1180px, calc(100% - 32px)) !important;
  max-width: 1180px !important;
  margin-inline: auto !important;
  padding-top: 46px !important;
  padding-bottom: 64px !important;
}

[data-site-resource-shell] main > header {
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

[data-site-resource-shell] main > section {
  border-radius: 0 !important;
  border-color: rgba(255,255,255,.09) !important;
  background: #11110f !important;
  box-shadow: none !important;
}

[data-site-resource-shell] main > section:first-of-type::before,
[data-site-resource-shell] main > section:first-of-type::after {
  display: none !important;
}

[data-site-resource-shell] .text-muted-foreground {
  color: #817c74 !important;
}

[data-site-resource-shell] .text-foreground {
  color: #e9e4da !important;
}

[data-site-resource-shell] .text-primary {
  color: #d8aa27 !important;
}

[data-site-resource-shell] .text-primary-foreground {
  color: #11110f !important;
}

[data-site-resource-shell] .bg-primary {
  background: #daa000 !important;
}

[data-site-resource-shell] .bg-card,
[data-site-resource-shell] .bg-background,
[data-site-resource-shell] .bg-muted,
[data-site-resource-shell] .bg-muted\/10,
[data-site-resource-shell] .bg-muted\/20,
[data-site-resource-shell] .bg-muted\/30,
[data-site-resource-shell] .bg-muted\/50 {
  background: #11110f !important;
}

[data-site-resource-shell] .border-border,
[data-site-resource-shell] [class*="border-border"] {
  border-color: rgba(255,255,255,.10) !important;
}

[data-site-resource-shell] input,
[data-site-resource-shell] select,
[data-site-resource-shell] textarea {
  border-radius: 0 !important;
  border-color: rgba(255,255,255,.11) !important;
  background: #0b0b0a !important;
  color: #e2ddd3 !important;
  box-shadow: none !important;
}

[data-site-resource-shell] input::placeholder,
[data-site-resource-shell] textarea::placeholder {
  color: #5f5a53 !important;
}

[data-site-resource-shell] input[type="file"]::file-selector-button {
  margin-right: 12px;
  border: 0;
  border-right: 1px solid rgba(255,255,255,.09);
  background: #151512;
  color: #bcb6ac;
  font-family: var(--font-geist-mono);
  font-size: .66rem;
  text-transform: uppercase;
  letter-spacing: .08em;
}

[data-site-resource-shell] button,
[data-site-resource-shell] [class*="rounded"] {
  border-radius: 0 !important;
}

[data-site-resource-shell] button:not([class*="bg-primary"]) {
  border-color: rgba(255,255,255,.10) !important;
}

[data-site-resource-shell] details,
[data-site-resource-shell] pre,
[data-site-resource-shell] table {
  border-radius: 0 !important;
  border-color: rgba(255,255,255,.09) !important;
}

[data-site-resource-shell] pre {
  background: #090908 !important;
  color: #b9b3a9 !important;
}

[data-site-resource-shell] table {
  color: #aaa49a;
}

[data-site-resource-shell] th {
  background: #0d0d0b;
  color: #d7d1c6;
}

[data-site-resource-shell] th,
[data-site-resource-shell] td {
  border-color: rgba(255,255,255,.08) !important;
}

[data-site-resource-shell] a:not([href*="discord.gg"]):hover {
  color: #f2c34f;
}

@keyframes site-page-enter {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes site-section-reveal {
  from {
    opacity: .76;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@supports (animation-timeline: view()) {
  body:has([data-site-navigation]) main > section:not(:first-child) > div {
    animation-name: site-section-reveal;
    animation-duration: 1ms;
    animation-fill-mode: both;
    animation-timing-function: linear;
    animation-timeline: view();
    animation-range: entry 0% entry 24%;
  }

  [data-site-resource-shell] main > section > div {
    animation: none !important;
  }
}

@media (hover: hover) and (pointer: fine) {
  body:has([data-site-navigation]) [data-site-navigation] a:hover,
  body:has([data-site-navigation]) [data-site-navigation] button:hover,
  body:has([data-site-navigation]) footer a:hover,
  body:has([data-site-navigation]) main a[class*="inline-flex"]:hover,
  body:has([data-site-navigation]) main button:hover {
    transform: translateY(-1px);
  }

  body:has([data-site-navigation]) [data-site-lift="card"]:hover {
    z-index: 5;
    transform: translateY(-4px) scale(1.006);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(244, 198, 77, 0.08);
  }

  body:has([data-site-navigation]) [data-site-lift="card"]:hover::after {
    opacity: 1;
    transform: scaleX(1);
  }
}

@media (max-width: 767px) {
  [data-site-resource-shell] main {
    width: calc(100% - 24px) !important;
    padding-top: 32px !important;
    padding-bottom: 48px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  html:has([data-site-navigation]) {
    scroll-behavior: auto;
  }

  body:has([data-site-navigation]) main > section:first-child,
  body:has([data-site-navigation]) main > section:not(:first-child) > div {
    animation: none !important;
  }

  body:has([data-site-navigation]) a,
  body:has([data-site-navigation]) button,
  body:has([data-site-navigation]) input,
  body:has([data-site-navigation]) select,
  body:has([data-site-navigation]) textarea,
  body:has([data-site-navigation]) [data-site-lift="card"],
  body:has([data-site-navigation]) [data-site-lift="card"]::after {
    transform: none !important;
    transition-duration: 0ms !important;
  }
}
`

export function SiteStyles() {
  return <style dangerouslySetInnerHTML={{ __html: siteStyles }} />
}
