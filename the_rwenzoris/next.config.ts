/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  experimental: {
    turbo: true,
    appDir: true,
  },
});

export default nextConfig;
