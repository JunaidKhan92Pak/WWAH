// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {
//   /* config options here */
// };
// export default nextConfig;
//  @type {import('next').NextConfig}
import { NextConfig } from "next";
// next.config.js
const nextConfig = {
  experimental: {
    scrollRestoration: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wwah-bucket.s3.us-east-1.amazonaws.com",
        port: "",          // keep empty unless you need a specific port
        pathname: "/**",   // <— this is the key line
      },
    ],
    minimumCacheTTL: 60,
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn1.gstatic.com",
      "ichef.bbci.co.uk",
      "flagcdn.com",
      "wwah-bucket.s3.us-east-1.amazonaws.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-backend.vercel.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
