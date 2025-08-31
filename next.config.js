/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving for GeoJSON data
  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;