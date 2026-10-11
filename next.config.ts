import type { NextConfig } from "next";

/**
 * Avatar sprites are local files under /public/assets.
 * Remote image hosts, wallet connectors, and NFT metadata stay out of
 * this config until those features exist (see lib/future).
 */
const nextConfig: NextConfig = {
  // A lockfile in the user profile sits above this repo. Pin the root so
  // Turbopack resolves files from CryptoPanim only.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
