import type React from "react";
import type { Metadata } from "next/types"; // Updated import path
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://embedded-purdue.github.io"
  ),
  title: {
    default: "Embedded Systems @ Purdue",
    template: "%s • Embedded Systems @ Purdue",
  },
  description:
    "Join Embedded Systems @ Purdue to learn microcontroller programming, FPGA design, and build innovative hardware projects with fellow students.",
  openGraph: {
    title: "Embedded Systems @ Purdue",
    description:
      "Embedded Systems @ Purdue is a community for embedded systems, hardware, and software innovation.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://embedded-purdue.github.io",
    siteName: "Embedded Systems @ Purdue",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Embedded Systems @ Purdue",
    description:
      "Join Embedded Systems @ Purdue to learn, build, and innovate.",
    creator: "@embedded_purdue",
  },
  generator: "esap-web",
};

const landingFrameScript = `
(function () {
  var root = document.documentElement;
  var posterKey = "esap-landing-final-poster-v3";
  var seenKey = "esap-landing-animation-seen";
  var currentShell = null;
  var captureToken = 0;

  function readPoster() {
    try { return sessionStorage.getItem(posterKey); } catch (e) { return null; }
  }

  function activatePoster(poster) {
    if (!poster) return false;
    root.style.setProperty("--esap-return-poster", 'url("' + poster + '")');
    root.setAttribute("data-esap-return-poster", "1");
    try { sessionStorage.setItem(seenKey, "1"); } catch (e) {}
    return true;
  }

  var bootPoster = readPoster();
  if (bootPoster) {
    activatePoster(bootPoster);
  } else {
    // A "seen" flag without a poster cannot provide a stable first paint.
    // Replay the animation once and create the poster instead.
    try {
      sessionStorage.removeItem(seenKey);
      sessionStorage.removeItem("esap-landing-final-frame");
      sessionStorage.removeItem("esap-landing-final-frame-v2");
      sessionStorage.removeItem("esap-landing-final-poster-v2");
    } catch (e) {}
  }

  function waitForFinalCanvas(shell, token) {
    function check() {
      if (token !== captureToken || !shell.isConnected) return;

      var hero = shell.querySelector("section:first-of-type");
      var canvas = hero && hero.querySelector("canvas");
      if (!hero || !canvas) {
        requestAnimationFrame(check);
        return;
      }

      var dpr = Math.min(window.devicePixelRatio || 1, 1.1);
      var expectedWidth = Math.round(Math.max(1, hero.getBoundingClientRect().width) * dpr);
      var expectedHeight = Math.round(Math.max(1, window.innerHeight) * dpr);
      var settled = hero.className.indexOf("h-[min(66svh,600px)]") !== -1;
      var sized = Math.abs(canvas.width - expectedWidth) <= 2 && Math.abs(canvas.height - expectedHeight) <= 2;

      if (!settled || !sized) {
        requestAnimationFrame(check);
        return;
      }

      // resize() and draw(animationEnd) run synchronously in the hero. Waiting one
      // more frame guarantees the finished canvas is painted before the poster leaves.
      requestAnimationFrame(function () {
        if (token === captureToken && shell.isConnected) {
          root.setAttribute("data-esap-return-canvas-ready", "1");
        }
      });
    }

    requestAnimationFrame(check);
  }

  function capturePoster(shell, token) {
    function check() {
      if (token !== captureToken || !shell.isConnected) return;

      var hero = shell.querySelector("section:first-of-type");
      var canvas = hero && hero.querySelector("canvas");
      var settled = hero && hero.className.indexOf("h-[min(66svh,600px)]") !== -1;

      if (!hero || !canvas || !settled || canvas.width < 2 || canvas.height < 2) {
        requestAnimationFrame(check);
        return;
      }

      try {
        // Cache only a tiny version of the real finished canvas. It is small enough
        // for Safari to decode immediately and exists solely to bridge hydration.
        var poster = document.createElement("canvas");
        poster.width = Math.min(192, canvas.width);
        poster.height = Math.max(1, Math.round(canvas.height * poster.width / canvas.width));
        var context = poster.getContext("2d", { alpha: false });
        if (!context) return;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, poster.width, poster.height);
        context.drawImage(canvas, 0, 0, poster.width, poster.height);

        var frame = poster.toDataURL("image/jpeg", 0.58);
        if (!frame || frame === "data:,") return;

        sessionStorage.setItem(posterKey, frame);
        sessionStorage.setItem(seenKey, "1");
        // Do not activate it on this visit. The live canvas remains untouched.
      } catch (e) {}
    }

    requestAnimationFrame(check);
  }

  function syncLandingShell() {
    var shell = document.querySelector("[data-landing-shell]");
    if (shell === currentShell) return;

    currentShell = shell;
    captureToken += 1;
    root.removeAttribute("data-esap-return-canvas-ready");

    if (!shell) return;

    var token = captureToken;
    var poster = readPoster();
    if (poster) {
      activatePoster(poster);
      waitForFinalCanvas(shell, token);
    } else {
      root.removeAttribute("data-esap-return-poster");
      root.style.removeProperty("--esap-return-poster");
      capturePoster(shell, token);
    }
  }

  function start() {
    syncLandingShell();
    var observer = new MutationObserver(syncLandingShell);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
`;

const landingFrameStyle = `
/* Cached returns only override visibility/paint state; normal landing layout CSS stays intact. */
html[data-esap-return-poster="1"] [data-landing-shell] {
  --landing-nav-opacity: 1 !important;
  --landing-content-opacity: 1 !important;
}

html[data-esap-return-poster="1"] [data-landing-shell] > section:first-of-type {
  height: min(66svh, 600px) !important;
  min-height: 500px !important;
  transition: none !important;
}

html[data-esap-return-poster="1"] [data-landing-shell] > section:first-of-type canvas {
  visibility: hidden !important;
}

html[data-esap-return-poster="1"][data-esap-return-canvas-ready="1"] [data-landing-shell] > section:first-of-type canvas {
  visibility: visible !important;
}

html[data-esap-return-poster="1"] [data-landing-shell] > section:first-of-type::before {
  display: none !important;
}

html[data-esap-return-poster="1"] [data-landing-shell] > section:first-of-type::after {
  content: "" !important;
  display: block !important;
  position: absolute !important;
  z-index: 3 !important;
  left: 0 !important;
  right: auto !important;
  top: calc(50% + 34px) !important;
  bottom: auto !important;
  width: 100% !important;
  height: 100svh !important;
  transform: translateY(-50%) !important;
  transform-origin: center !important;
  background-color: #000 !important;
  background-image: var(--esap-return-poster) !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: 100% 100% !important;
  filter: none !important;
  animation: none !important;
  -webkit-mask-image: none !important;
  mask-image: none !important;
  opacity: 1 !important;
  pointer-events: none !important;
}

html[data-esap-return-poster="1"][data-esap-return-canvas-ready="1"] [data-landing-shell] > section:first-of-type::after {
  display: none !important;
}

html[data-esap-return-poster="1"] #hero-intro {
  border-color: rgba(255,255,255,.08) !important;
  background: #0b0b0a !important;
  transition: none !important;
}

/* Preserve the normal intro dimensions. Remove only the return-visit movement. */
html[data-esap-return-poster="1"] #hero-intro > div:first-child,
html[data-esap-return-poster="1"] #hero-intro [data-hero-intro-grid] {
  transition: none !important;
}

html[data-esap-return-poster="1"] #hero-intro [data-hero-intro-grid] {
  transform: none !important;
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: landingFrameStyle }} />
        <script dangerouslySetInnerHTML={{ __html: landingFrameScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
