import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output static exports for best performance on Vercel
  // Uncomment for full static export:
  // output: 'export',

  // Enable React strict mode for better development
  reactStrictMode: true,

  // React Compiler for performance
  reactCompiler: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'railyatra.co.in',
      },
    ],
  },

  // Trailing slashes for SEO consistency
  trailingSlash: false,

  // Generate source maps for production debugging
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Power by header removal for security
  poweredByHeader: false,

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Cache static assets
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for old URL patterns
  async redirects() {
    return [
      {
        source: '/train-details/:trainNo',
        destination: '/train/:trainNo',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
