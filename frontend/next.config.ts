import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["placehold.co", "picsum.photos", "images.unsplash.com", "images.pexels.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
