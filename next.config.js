/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com",
      "images.unsplash.com",
      "assets.aceternity.com"
    ]
  },
  typescript: {
    // Ignoring TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
