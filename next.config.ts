import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://info2api.paxsz.com/api/:path*', // 目标API
      },
    ]
  },
  images: {
    domains: ['info.paxsz.com'],
  },
};

export default nextConfig;
