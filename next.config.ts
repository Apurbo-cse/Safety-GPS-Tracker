import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets verification builds run in a separate folder without disturbing `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 90] },
};

export default nextConfig;
