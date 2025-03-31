/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Remove any redirects that might be overriding the landing page
    ]
  },
}

export default nextConfig

