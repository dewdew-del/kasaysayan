import type { NextConfig } from "next";

// Static export: the whole site is plain HTML/CSS/JS files in out/, hosted free on Vercel.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
