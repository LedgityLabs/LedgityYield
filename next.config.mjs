// This ensure env vars are validated at build-time
// See: https://env.t3.gg/docs/nextjs
import "./env.mjs";
import * as path from 'path'
import { fileURLToPath } from 'url';

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true, // Enable internal link type-checking (see: https://nextjs.org/docs/pages/building-your-application/configuring/typescript#statically-typed-links)
  },
  // Require by Wagmi work in Next.js client components
  webpack: (config, { isServer }) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.resolve.alias['./fetch.node'] = path.resolve(__dirname, 'polyfills/fetch.js');
    // config.externals.push("pino-pretty", "lokijs", "encoding");
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
  env: {
    SENDER_PRIVATE_KEY: process.env.SENDER_PRIVATE_KEY,
    RPC_URL: process.env.RPC_URL,
  },
};
export default nextConfig;
