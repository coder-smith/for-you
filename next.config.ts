import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(process.env.GITHUB_ACTIONS === "true"
    ? { basePath: "/for-you" }
    : {}),
};

export default nextConfig;
