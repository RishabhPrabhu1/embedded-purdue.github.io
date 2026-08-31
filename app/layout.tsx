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
  var posterKey = "esap-landing-final-poster-v4";
  var seenKey = "esap-landing-animation-seen";
  var scrollKey = "esap-landing-reload-scroll-y";
  var currentShell = null;
  var captureToken = 0;
  var reloadScrollY = null;
  var shouldRestoreReloadScroll = false;

  function readPoster() {
    try { return sessionStorage.getItem(posterKey); } catch (e) { return null; }
  }

  function navigationIsReload() {
    try {
      var entries = performance.getEntriesByType && performance.getEntriesByType("navigation");
      if (entries && entries.length) return entries[0].type === "reload";
      return performance.navigation && performance.navigation.type === 1;
    } catch (e) {
      return false;
    }
  }

  function readReloadScroll() {
    try {
      var raw = sessionStorage.getItem(scrollKey);
      if (raw === null) return null;
      var value = Number(raw);
      return Number.isFinite(value) && value >= 0 ? value : null;
    } catch (e) {
      return null;
    }
  }

  function rememberLandingScroll() {
    try {
      if (!document.querySelector("[data-landing-shell]")) return;
      if (!sessionStorage.getItem(posterKey)) return;
      sessionStorage.setItem(scrollKey, String(Math.max(0, window.scrollY || 0)));
    } catch (e) {}
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
    reloadScrollY = readReloadScroll();
    shouldRestoreReloadScroll = navigationIsReload() && reloadScrollY !== null;

    if (shouldRestoreReloadScroll && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } else {
    // A "seen" flag without the current poster cannot provide a stable first paint.
    // Replay the animation once and create the current poster instead.
    try {
      sessionStorage.removeItem(seenKey);
      sessionStorage.removeItem("esap-landing-final-frame");
      sessionStorage.removeItem("esap-landing-final-frame-v2");
      sessionStorage.removeItem("esap-landing-final-poster-v2");
      sessionStorage.removeItem("esap-landing-final-poster-v3");
      sessionStorage.removeItem(scrollKey);
    } catch (e) {}
  }

  window.addEventListener("pagehide", rememberLandingScroll);

  function restoreReloadScroll(shell) {
    if (!shouldRestoreReloadScroll || reloadScrollY === null || !shell.isConnected) return;

    var target = reloadScrollY;
    shouldRestoreReloadScroll = false;

    function apply() {
      if (shell.isConnected) window.scrollTo(0, target);
    }

    // The cached hero/intro already use their final geometry, so restoration can
    // happen as soon as the landing shell exists. Reapply after layout to guard
    // against Safari's reload timing without introducing any visible animation.
    apply();
    requestAnimationFrame(function () {
      apply();
      requestAnimationFrame(function () {
        apply();
        if ("scrollRestoration" in history) history.scrollRestoration = "auto";
      });
    });
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
        // Capture the real finished canvas once. Return visits keep this exact visual
        // for the whole visit; there is no cached-image -> live-canvas handoff.
        var poster = document.createElement("canvas");
        poster.width = Math.min(1280, canvas.width);
        poster.height = Math.max(1, Math.round(canvas.height * poster.width / canvas.width));
        var context = poster.getContext("2d", { alpha: false });
        if (!context) return;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, poster.width, poster.height);
        context.drawImage(canvas, 0, 0, poster.width, poster.height);

        var frame = poster.toDataURL("image/jpeg", 0.86);
        if (!frame || frame === "data:,") return;

        sessionStorage.setItem(posterKey, frame);
        sessionStorage.setItem(seenKey, "1");
        // First visit remains the live canvas. This image is only for later visits.
      } catch (e) {}
    }

    requestAnimationFrame(check);
  }

  function syncLandingShell() {
    var shell = document.querySelector("[data-landing-shell]");
    if (shell === currentShell) return;

    currentShell = shell;
    captureToken += 1;
    if (!shell) return;

    var token = captureToken;
    var poster = readPoster();
    if (poster) {
      activatePoster(poster);
      restoreReloadScroll(shell);
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
/* Cached returns are a single static final state. No image -> canvas handoff. */
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

html[data-esap-return-poster="1"] #hero-intro {
  border-color: rgba(255,255,255,.08) !important;
  background: #0b0b0a !important;
  transition: none !important;
}

html[data-esap-return-poster="1"] #hero-intro > div:first-child {
  opacity: 1 !important;
  transition: none !important;
}

html[data-esap-return-poster="1"] #hero-intro [data-hero-intro-grid] {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
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
