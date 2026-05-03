import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Matches /api and /api/anything-else
        source: "/api",
        destination: "/",
        permanent: true, // 301 Redirect
      },
    ];
  },
};

export default nextConfig;
