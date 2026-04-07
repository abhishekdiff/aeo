import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/aeo",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
