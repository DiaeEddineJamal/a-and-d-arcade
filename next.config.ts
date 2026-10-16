import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // static files only: the optimizer is a function (Fast Origin Transfer); covers are pre-sized by tools/cover-thumbs.py
  images: { unoptimized: true },
  // one wrapper for every HTML5 port; each game keeps its own path so its saves (Unity hashes the page path) stay apart
  rewrites: async () => [{ source: "/ports/html5/:id", destination: "/ports/html5/index.html" }],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
