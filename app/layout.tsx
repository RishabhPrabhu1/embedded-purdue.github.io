import type React from "react";
import type { Metadata } from "next/types"; // Updated import path
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import "./landing-return.css";

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

const returningLandingScript = `
(function () {
  var root = document.documentElement;
  var frameKey = "esap-landing-final-frame";
  var seenKey = "esap-landing-animation-seen";
  var currentShell = null;
  var settleObserver = null;

  function readFrame() {
    try {
      return sessionStorage.getItem(frameKey);
    } catch (e) {
      return null;
    }
  }

  function clearInvalidSeenState() {
    try {
      if (sessionStorage.getItem(seenKey) === "1" && !sessionStorage.getItem(frameKey)) {
        sessionStorage.removeItem(seenKey);
      }
    } catch (e) {}
  }

  function activateFrame(frame) {
    if (!frame) return false;
    root.style.setProperty("--esap-landing-final-frame", 'url("' + frame + '")');
    root.setAttribute("data-esap-landing-seen", "1");
    return true;
  }

  function stopSettleObserver() {
    if (settleObserver) settleObserver.disconnect();
    settleObserver = null;
  }

  function cacheSettledCanvas(shell) {
    stopSettleObserver();

    var hero = shell.querySelector("section:first-of-type");
    if (!hero) return;

    function captureIfSettled() {
      if (!hero.isConnected) {
        stopSettleObserver();
        return;
      }

      var canvas = hero.querySelector("canvas");
      var isSettled = hero.className.indexOf("h-[min(66svh,600px)]") !== -1;
      if (!canvas || !isSettled || canvas.width < 2 || canvas.height < 2) return;

      try {
        var frame = canvas.toDataURL("image/webp", 0.92);
        if (!frame || frame === "data:,") return;

        sessionStorage.setItem(frameKey, frame);
        sessionStorage.setItem(seenKey, "1");
        stopSettleObserver();
      } catch (e) {
        try {
          sessionStorage.removeItem(seenKey);
          sessionStorage.removeItem(frameKey);
        } catch (storageError) {}
      }
    }

    captureIfSettled();
    settleObserver = new MutationObserver(captureIfSettled);
    settleObserver.observe(hero, { attributes: true, attributeFilter: ["class"] });
  }

  function syncLandingMount() {
    var shell = document.querySelector("[data-landing-shell]");
    if (shell === currentShell) return;

    stopSettleObserver();
    currentShell = shell;
    if (!shell) return;

    var frame = readFrame();
    if (frame) {
      activateFrame(frame);
      return;
    }

    root.removeAttribute("data-esap-landing-seen");
    root.style.removeProperty("--esap-landing-final-frame");
    clearInvalidSeenState();
    cacheSettledCanvas(shell);
  }

  var bootFrame = readFrame();
  if (bootFrame) {
    activateFrame(bootFrame);
  } else {
    clearInvalidSeenState();
  }

  function startLandingObserver() {
    syncLandingMount();
    var observer = new MutationObserver(syncLandingMount);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLandingObserver, { once: true });
  } else {
    startLandingObserver();
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: returningLandingScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
