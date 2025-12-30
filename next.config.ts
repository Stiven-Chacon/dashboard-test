/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://dev.api.bekindnetwork.com/api/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig