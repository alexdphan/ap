import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "media.tenor.com",
      "pub-abc07a46b5d24733ab6e6ce723154196.r2.dev",
      "pub-5018f734e2604654b16c6609e8c82280.r2.dev",
    ],
  },
  // Optimize headers for video delivery
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
      // Optimize R2 video delivery
      {
        source: "/thumbnails/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // Compress responses
  compress: true,
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
