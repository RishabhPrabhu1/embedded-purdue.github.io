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

const returningLandingScript = `
(function () {
  var root = document.documentElement;
  var seenAtBoot = false;
  var currentShell = null;
  var firstLandingMountHandled = false;

  try {
    seenAtBoot = sessionStorage.getItem("esap-landing-animation-seen") === "1";
  } catch (e) {}

  if (seenAtBoot) root.setAttribute("data-esap-landing-seen", "1");

  function storageSaysSeen() {
    try {
      return sessionStorage.getItem("esap-landing-animation-seen") === "1";
    } catch (e) {
      return false;
    }
  }

  function syncLandingMount() {
    var shell = document.querySelector("[data-landing-shell]");
    if (shell === currentShell) return;

    currentShell = shell;
    if (!shell) return;

    if (!firstLandingMountHandled) {
      firstLandingMountHandled = true;
      if (seenAtBoot) root.setAttribute("data-esap-landing-seen", "1");
      return;
    }

    if (storageSaysSeen()) root.setAttribute("data-esap-landing-seen", "1");
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
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: returningLandingScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
