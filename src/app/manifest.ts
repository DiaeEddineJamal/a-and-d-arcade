import type { MetadataRoute } from "next";

// Makes the arcade installable: an app icon on the desktop that opens even offline (public/sw.js serves it).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A&D Arcade",
    short_name: "A&D Arcade",
    description: "Arcade originals and browser classics. Downloaded games play offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#008384",
    theme_color: "#000000",
    icons: [
      { src: "/icon-any-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-any-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
