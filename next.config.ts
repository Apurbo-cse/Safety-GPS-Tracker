import path from "node:path";
import type { NextConfig } from "next";

/** Pictures live in the backend (backend/assets/img); the website asks for /img/... and Next fetches it from the API. */
const apiOrigin = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Lets verification builds run in a separate folder without disturbing `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    // Pins the project root, so a stray package-lock.json in a parent folder is not picked up.
    root: path.resolve("."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // minimumCacheTTL: a picture edited in backend/storage shows on the website within a minute
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 80, 90], minimumCacheTTL: 60 },
  async rewrites() {
    return [{ source: "/img/:path*", destination: `${apiOrigin}/assets/img/:path*` }];
  },
  async redirects() {
    return [
      { source: "/devices", destination: "/products", permanent: true },
      { source: "/devices/:path*", destination: "/products/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
