import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['work-2-zojpkemmrzpxquxi.prod-runtime.all-hands.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'work-2-zojpkemmrzpxquxi.prod-runtime.all-hands.dev',
        port: '12001',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://work-2-zojpkemmrzpxquxi.prod-runtime.all-hands.dev:12001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
