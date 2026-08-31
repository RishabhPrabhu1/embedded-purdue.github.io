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
try {
  if (sessionStorage.getItem("esap-landing-animation-seen") === "1") {
    document.documentElement.setAttribute("data-esap-landing-seen", "1");
    var style = document.createElement("style");
    style.id = "esap-returning-landing-style";
    style.textContent = [
      'html[data-esap-landing-seen="1"] [data-landing-shell]{--landing-nav-opacity:1!important;--landing-content-opacity:1!important}',
      'html[data-esap-landing-seen="1"] [data-landing-shell]>section:first-of-type{height:min(66svh,600px)!important;min-height:500px!important}',
      'html[data-esap-landing-seen="1"] [data-landing-shell]>section:first-of-type canvas{top:calc(50% + 34px)!important}',
      'html[data-esap-landing-seen="1"] [data-landing-shell]>section:first-of-type::before,html[data-esap-landing-seen="1"] [data-landing-shell]>section:first-of-type::after{display:none!important}',
      'html[data-esap-landing-seen="1"] #hero-intro{border-color:rgba(255,255,255,.08)!important;background:#0b0b0a!important}',
      'html[data-esap-landing-seen="1"] #hero-intro>div:first-child{opacity:1!important}',
      'html[data-esap-landing-seen="1"] #hero-intro [data-hero-intro-grid]{opacity:1!important;transform:translateY(0)!important}'
    ].join('');
    document.head.appendChild(style);
  }
} catch (e) {}
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
