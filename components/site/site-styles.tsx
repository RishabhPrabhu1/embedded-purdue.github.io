const siteStyles = `
html:has([data-site-navigation]) {
  scroll-padding-top: 84px;
  scroll-behavior: smooth;
  background: #0c0c0b;
}

body:has([data-site-navigation]) {
  background: #0c0c0b;
}

body:has([data-site-navigation]) ::selection {
  background: rgba(218, 160, 0, 0.32);
  color: #f7f2e8;
}

body:has([data-site-navigation]) a:focus-visible,
body:has([data-site-navigation]) button:focus-visible,
body:has([data-site-navigation]) input:focus-visible,
body:has([data-site-navigation]) [tabindex]:focus-visible {
  outline: 1px solid rgba(244, 198, 77, 0.78);
  outline-offset: 3px;
}

body:has([data-site-navigation]) a,
body:has([data-site-navigation]) button,
body:has([data-site-navigation]) input {
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

body:has([data-site-navigation]) main > section:first-child {
  animation: site-page-enter 480ms cubic-bezier(.22, 1, .36, 1) both;
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
}

@media (prefers-reduced-motion: reduce) {
  html:has([data-site-navigation]) {
    scroll-behavior: auto;
  }

  body:has([data-site-navigation]) main > section:first-child {
    animation: none;
  }

  body:has([data-site-navigation]) a,
  body:has([data-site-navigation]) button,
  body:has([data-site-navigation]) input,
  body:has([data-site-navigation]) [data-site-lift="card"] {
    transform: none !important;
    transition-duration: 0ms;
  }
}
`

export function SiteStyles() {
  return <style dangerouslySetInnerHTML={{ __html: siteStyles }} />
}
