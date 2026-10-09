import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import ArcadeDesktop from "./arcade-desktop";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { devicePhotos, deviceTracks, games, wallpaperArt } from "./catalog";

const serif = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });
const term = VT323({ subsets: ["latin"], weight: "400", variable: "--font-term", display: "swap" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel", display: "swap" });

export const metadata: Metadata = {
  title: { default: "A&D Arcade — One more game?", template: "%s · A&D Arcade" },
  description: "A little desktop, a big collection. Play arcade originals with friends and rediscover browser classics at A&D Arcade.",
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48" }, { url: "/icon-any-192.png", type: "image/png", sizes: "192x192" }], apple: "/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "A&D Arcade", statusBarStyle: "black-translucent" },
  ...(existsSync(join(process.cwd(), "public", "og.png")) && { openGraph: { images: [{ url: "/og.png", width: 1200, height: 630 }] }, twitter: { card: "summary_large_image", images: ["/og.png"] } }),
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#000000", interactiveWidget: "resizes-content" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script below may mark <html data-warm> before React loads
    <html lang="en" className={`${serif.variable} ${plex.variable} ${term.variable} ${pixel.variable}`} suppressHydrationWarning>
      {/* runs before the first paint: the CRT power-on plays once per visit, never with startup animations off */}
      <head><script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("ad-warm")||JSON.parse(localStorage.getItem("ad-preferences")||"{}").startup===false)document.documentElement.dataset.warm="1"}catch(e){}` }} /></head>
      <body><ArcadeDesktop games={games} wallpaperArt={wallpaperArt} devicePhotos={devicePhotos()} deviceTracks={deviceTracks()}>{children}</ArcadeDesktop></body></html>
  );
}
