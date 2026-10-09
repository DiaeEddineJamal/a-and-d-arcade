import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // static files only: the optimizer is a function (Fast Origin Transfer); covers are pre-sized by tools/cover-thumbs.py
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
