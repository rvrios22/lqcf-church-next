import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Matches /api and /api/anything-else
        source: "/api/:path*",
        destination: "/",
        permanent: true, // 301 Redirect
      },
    ];
  },
};

export default nextConfig;
