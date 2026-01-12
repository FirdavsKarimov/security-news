import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.86.0.246"],
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "eu-west-2.graphassets.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
