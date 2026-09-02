import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.tugeelt.mn', pathname: '/**' },
      { protocol: 'https', hostname: 'tugeelt.mn', pathname: '/**' },
      { protocol: 'http',  hostname: 'www.barcodes4.me', pathname: '/**' },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      // Serve upload files from old PHP directory during migration
      {
        source: '/upload/:path*',
        destination: 'http://localhost/tugeelt.mn/upload/:path*',
      },
    ]
  },
}

export default nextConfig
