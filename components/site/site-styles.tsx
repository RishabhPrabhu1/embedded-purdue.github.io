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

body:has([data-site-navigation]) [data-site-lift="card"] {
  position: relative;
  transform-origin: center;
  transition-property: transform, box-shadow, background-color, border-color;
  transition-duration: 320ms;
  transition-timing-function: cubic-bezier(.22, 1, .36, 1);
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
