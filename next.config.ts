import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/cortex",
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
