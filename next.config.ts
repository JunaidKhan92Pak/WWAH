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
    domains: [
      "res.cloudinary.com",
      "encrypted-tbn1.gstatic.com",
      "ichef.bbci.co.uk",
      "flagcdn.com"
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