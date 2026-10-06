import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/*-cover-box-art.png", search: "?v=ad1996" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
