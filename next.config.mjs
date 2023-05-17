// This ensure env vars are validated at build-time
// See: https://env.t3.gg/docs/nextjs
import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // typedRoutes: true, // Enable internal link type-checking (see: https://nextjs.org/docs/pages/building-your-application/configuring/typescript#statically-typed-links)
  },
};
export default nextConfig;