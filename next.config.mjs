// This ensures env vars are validated at build-time
// See: https://env.t3.gg/docs/nextjs
import "./env.mjs";
import { env } from "./env.mjs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true, // Enable internal link type-checking (see: https://nextjs.org/docs/pages/building-your-application/configuring/typescript#statically-typed-links)
  },
  // Required by Wagmi to work in Next.js client components
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    // config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['~'] = path.join(__dirname, 'public');
    config.resolve.alias['@root'] = path.join(__dirname, '..');
    config.resolve.modules.push(path.join(__dirname, '..'));
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
      // Added for Chainlink badges
      {
        protocol: "https",
        hostname: "chain.link",
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
  // Add this section to explicitly set environment variables
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_INTEGRATOR_ID: env.NEXT_PUBLIC_INTEGRATOR_ID,
    NEXT_PUBLIC_FRONTEND_URL: env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_AFFILIATE_API_URL: env.NEXT_PUBLIC_AFFILIATE_API_URL,
  },
};

export default nextConfig;