import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/samplerp',
        destination: '/sample-report.html',
      },
    ]
  },
};

export default nextConfig;
