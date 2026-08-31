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
  var frameKey = "esap-landing-final-frame-v2";
  var posterKey = "esap-landing-final-poster-v2";
  var seenKey = "esap-landing-animation-seen";

  function activateFrame(frame, poster) {
    if (!frame || !poster) return;
    root.style.setProperty("--esap-return-frame", 'url("' + frame + '")');
    root.style.setProperty("--esap-return-poster", 'url("' + poster + '")');
    root.setAttribute("data-esap-return-frame", "1");
    try { sessionStorage.setItem(seenKey, "1"); } catch (e) {}
  }

  var bootFrame = null;
  var bootPoster = null;
  try {
    bootFrame = sessionStorage.getItem(frameKey);
    bootPoster = sessionStorage.getItem(posterKey);
  } catch (e) {}

  if (bootFrame && bootPoster) {
    activateFrame(bootFrame, bootPoster);
    return;
  }

  // Any older return-frame cache is intentionally ignored so the animation can
  // run once and create the new fast poster + full-frame pair.
  try {
    sessionStorage.removeItem(seenKey);
    sessionStorage.removeItem("esap-landing-final-frame");
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
        // Bake the hero's real black background into the captured frame so the
        // cached image is the complete final visual, not a transparent canvas layer.
        var capture = document.createElement("canvas");
        capture.width = canvas.width;
        capture.height = canvas.height;
        var captureContext = capture.getContext("2d", { alpha: false });
        if (!captureContext) return;
        captureContext.fillStyle = "#000000";
        captureContext.fillRect(0, 0, capture.width, capture.height);
        captureContext.drawImage(canvas, 0, 0);

        var frame = capture.toDataURL("image/jpeg", 0.92);
        if (!frame || frame === "data:,") return;

        // A small copy of the same actual final frame gives Safari something it
        // can decode on the first paint while the full-resolution image decodes.
        var poster = document.createElement("canvas");
        poster.width = Math.min(480, capture.width);
        poster.height = Math.max(1, Math.round(capture.height * poster.width / capture.width));
        var posterContext = poster.getContext("2d", { alpha: false });
        if (!posterContext) return;
        posterContext.fillStyle = "#000000";
        posterContext.fillRect(0, 0, poster.width, poster.height);
        posterContext.drawImage(capture, 0, 0, poster.width, poster.height);

        var posterFrame = poster.toDataURL("image/jpeg", 0.72);
        if (!posterFrame || posterFrame === "data:,") return;

        sessionStorage.setItem(frameKey, frame);
        sessionStorage.setItem(posterKey, posterFrame);
        sessionStorage.setItem(seenKey, "1");

        // Leave the first visit's live canvas untouched through its normal settle.
        // After that transition, swapping to the same captured visual is inert and
        // primes client-side navigation back to the landing page.
        window.setTimeout(function () { activateFrame(frame, posterFrame); }, 760);
      } catch (e) {
        try {
          sessionStorage.removeItem(frameKey);
          sessionStorage.removeItem(posterKey);
        } catch (storageError) {}
      }
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
  background-color: #000 !important;
  background-image: var(--esap-return-frame), var(--esap-return-poster) !important;
  background-position: center, center !important;
  background-repeat: no-repeat, no-repeat !important;
  background-size: 100% 100%, 100% 100% !important;
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
