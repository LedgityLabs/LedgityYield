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
    // typedRoutes: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Handle GraphQL Mesh dependencies
    config.externals = [
      ...(config.externals || []),
      '@graphql-mesh/utils',
      'graphql-yoga',
    ];

    // Ignore specific problematic modules
    config.ignoreWarnings = [
      { module: /node_modules\/@graphql-mesh\/utils/ },
      { module: /node_modules\/graphql-yoga/ },
    ];

    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['~'] = path.join(__dirname, 'public');
    config.resolve.alias['@root'] = path.join(__dirname, '..');
    config.resolve.modules.push(path.join(__dirname, '..'));

    return config;
  },
  transpilePackages: ['@graphql-mesh/http', '@graphql-mesh/merger-stitching', 'graphql-yoga'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "euc.li",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
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
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_INTEGRATOR_ID: env.NEXT_PUBLIC_INTEGRATOR_ID,
    NEXT_PUBLIC_FRONTEND_URL: env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_AFFILIATE_API_URL: env.NEXT_PUBLIC_AFFILIATE_API_URL,
  },
};

export default nextConfig;