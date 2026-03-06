import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rareimagery/api', '@rareimagery/types', '@rareimagery/ui'],

  async rewrites() {
    const drupalUrl = process.env.DRUPAL_BASE_URL || 'http://localhost:8088';
    return [
      { source: '/jsonapi/:path*', destination: `${drupalUrl}/jsonapi/:path*` },
      { source: '/api/:path*', destination: `${drupalUrl}/api/:path*` },
      { source: '/session/token', destination: `${drupalUrl}/session/token` },
      { source: '/cart/:path*', destination: `${drupalUrl}/cart/:path*` },
      { source: '/sites/:path*', destination: `${drupalUrl}/sites/:path*` },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8088' },
      { protocol: 'https', hostname: 'api.rareimagery.net' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
    ],
  },
};

export default nextConfig;
