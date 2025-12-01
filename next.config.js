/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Supabase storage URL will be added here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig

