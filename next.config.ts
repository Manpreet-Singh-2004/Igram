import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allowing any Host name for images for now
        port: "",
        pathname: "/**",
      },
      // you can add more hosts here if needed
    ],
  },
};

export default nextConfig;
