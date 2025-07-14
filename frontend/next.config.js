/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:12001/api/:path*', // Proxy to backend
      },
    ];
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;