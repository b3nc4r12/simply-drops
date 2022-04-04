/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io"]
  },
  env: {
    sanity_dataset: process.env.SANITY_DATASET,
    sanity_project_id: process.env.SANITY_PROJECT_ID
  }
}

module.exports = nextConfig