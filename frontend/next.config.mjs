// frontend/next.config.mjs
import "../env.mjs";
import { env } from "../env.mjs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['~'] = path.join(__dirname, 'public');
    config.resolve.alias['@root'] = path.join(__dirname, '..');

    return config;
  },
  transpilePackages: ['@graphql-mesh/http', '@graphql-mesh/merger-stitching', 'graphql-yoga'],
  
  // Combined rewrites for both RPC and manifest
  async rewrites() {
    return [
      {
        source: '/api/rpc/:chain*',
        destination: '/api/proxy/rpc/:chain*',
      },
      {
        source: '/manifest.json',
        destination: 'https://ledgity.finance/manifest.json',
      }
    ]
  },

  // Add CORS headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      }
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "euc.li",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "chain.link",
      },
    ],
  },
  
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_INTEGRATOR_ID: env.NEXT_PUBLIC_INTEGRATOR_ID,
    NEXT_PUBLIC_FRONTEND_URL: env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_AFFILIATE_API_URL: env.NEXT_PUBLIC_AFFILIATE_API_URL,
  },
};

export default nextConfig;