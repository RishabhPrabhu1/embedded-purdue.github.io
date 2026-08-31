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
  var frameKey = "esap-landing-final-frame";
  var seenKey = "esap-landing-animation-seen";

  function activateFrame(frame) {
    if (!frame) return;
    root.style.setProperty("--esap-return-frame", 'url("' + frame + '")');
    root.setAttribute("data-esap-return-frame", "1");
    try { sessionStorage.setItem(seenKey, "1"); } catch (e) {}
  }

  var bootFrame = null;
  try { bootFrame = sessionStorage.getItem(frameKey); } catch (e) {}

  if (bootFrame) {
    activateFrame(bootFrame);
    return;
  }

  try {
    if (sessionStorage.getItem(seenKey) === "1") sessionStorage.removeItem(seenKey);
  } catch (e) {}

  function beginCapture() {
    var shell = document.querySelector("[data-landing-shell]");
    if (!shell) return;

    function captureWhenSettled() {
      var hero = shell.querySelector("section:first-of-type");
      var canvas = hero && hero.querySelector("canvas");
      var settled = hero && hero.className.indexOf("h-[min(66svh,600px)]") !== -1;

      if (!hero || !canvas || !settled || canvas.width < 2 || canvas.height < 2) {
        requestAnimationFrame(captureWhenSettled);
        return;
      }

      try {
        var frame = canvas.toDataURL("image/webp", 0.92);
        if (!frame || frame === "data:,") return;

        sessionStorage.setItem(frameKey, frame);
        sessionStorage.setItem(seenKey, "1");

        // The first visit keeps the live canvas. Once its normal settle transition is over,
        // switching to the identical cached bitmap is visually inert and primes client-side returns.
        window.setTimeout(function () { activateFrame(frame); }, 760);
      } catch (e) {}
    }

    requestAnimationFrame(captureWhenSettled);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", beginCapture, { once: true });
  } else {
    beginCapture();
  }
})();
`;

const landingFrameStyle = `
html[data-esap-return-frame="1"] [data-landing-shell] > section:first-of-type {
  height: min(66svh, 600px) !important;
  min-height: 500px !important;
  transition: none !important;
}

html[data-esap-return-frame="1"] [data-landing-shell] > section:first-of-type canvas {
  visibility: hidden !important;
}

html[data-esap-return-frame="1"] [data-landing-shell] > section:first-of-type::before {
  display: none !important;
}

html[data-esap-return-frame="1"] [data-landing-shell] > section:first-of-type::after {
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
  background-image: var(--esap-return-frame) !important;
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
