// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {
//   /* config options here */
// };
// export default nextConfig;
//  @type {import('next').NextConfig}
import { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    scrollRestoration: false, // Disable scroll restoration
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wwah-bucket.s3.us-east-1.amazonaws.com',
      },
    ],
    minimumCacheTTL: 60,
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn1.gstatic.com",
      "ichef.bbci.co.uk",
      "flagcdn.com",
      'wwah-bucket.s3.us-east-1.amazonaws.com'
    ],

    // Allow images from Cloudinary
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Proxy all requests starting with /api/
        destination: "https://your-backend.vercel.app/api/:path*", // Your backend URL
      },
    ];
  },
};
module.exports = nextConfig;