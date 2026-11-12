import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import SiteProvider from "@/components/providers/SiteProvider";
import { getSite } from "@/lib/site.server";
import { SITE } from "@/lib/site";

// Runs before paint so the saved theme never flashes.
const THEME_SCRIPT = `try{var t=localStorage.getItem("sgt-theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Safety GPS Tracker — GPS Vehicle Tracking & Fleet Management", template: "%s | Safety GPS Tracker" },
  description:
    "Real-time GPS vehicle tracking and fleet management in Bangladesh: live tracking, engine lock, geo-fencing, reports and mobile apps.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Safety GPS Tracker — GPS Vehicle Tracking & Fleet Management",
    description: "Track vehicles in real time, protect assets and manage your fleet with Safety GPS Tracker.",
    locale: "en_BD",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f05a22", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <noscript><style>{"#preloader{display:none!important}"}</style></noscript>
      </head>
      <body className="min-h-screen antialiased">
        <Providers><SiteProvider site={site}>{children}</SiteProvider></Providers>
      </body>
    </html>
  );
}
