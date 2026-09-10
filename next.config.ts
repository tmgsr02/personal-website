import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The four essays moved from /notes to /writing. Keep old links alive.
      {
        source: '/notes/:slug',
        destination: '/writing/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
