// This ensure env vars are validated at build-time
// See: https://env.t3.gg/docs/nextjs
import "./env.mjs";
import _withBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = _withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true, // Enable internal link type-checking (see: https://nextjs.org/docs/pages/building-your-application/configuring/typescript#statically-typed-links)
  },
  // Require by Wagmi work in Next.js client components
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      // Required to load ENS avatars
      {
        protocol: "https",
        hostname: "euc.li",
        port: "",
      },
      // Required to load Twitter profile pics
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/invest",
        permanent: true,
      },
    ];
  },
});
export default nextConfig;
