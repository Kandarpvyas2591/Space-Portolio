/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize image loading
  images: {
    domains: [],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
    unoptimized: true, // Set to true to avoid image optimization issues
  },
  // Enable gzip compression
  compress: true,
  // Improve production performance
  swcMinify: true,
  // Optimize page loading
  reactStrictMode: true,
  // Reduce bundle size with treeshaking
  modularizeImports: {
    'react-icons': {
      transform: 'react-icons/{{member}}',
    },
  },
  experimental: {
    optimizeCss: true, // Optimize CSS
    scrollRestoration: true, // Improve scroll position restoration
  },
};

module.exports = nextConfig;
