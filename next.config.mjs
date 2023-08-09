// This ensure env vars are validated at build-time
// See: https://env.t3.gg/docs/nextjs
import "./env.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true, // Enable internal link type-checking (see: https://nextjs.org/docs/pages/building-your-application/configuring/typescript#statically-typed-links)
  },
  // Require by Wagmi work in Next.js client components
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Required to load ENS avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "euc.li",
        port: "",
      },
    ],
  },
};
export default nextConfig;
