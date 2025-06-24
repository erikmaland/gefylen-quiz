/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['api.gefylenquiz.fun'],
  },
}

export default nextConfig;
