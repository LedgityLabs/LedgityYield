import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    TWITTER_CLIENT_ID: z.string().optional(),
    TWITTER_CLIENT_SECRET: z.string().optional(),
    IPINFO_TOKEN: z.string().optional(),
    SCORECHAIN_API_KEY: z.string().optional(),
    AML_ALERT_WEBHOOK: z.string().url().optional(),
    SENDER_PRIVATE_KEY: z.string().required(),
    RPC_URL: z.string().required(),
  },
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
    NEXT_PUBLIC_INTEGRATOR_ID: z.string(),
    NEXT_PUBLIC_FRONTEND_URL: z.string(),
    NEXT_PUBLIC_AFFILIATE_API_URL: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_INTEGRATOR_ID: process.env.NEXT_PUBLIC_INTEGRATOR_ID,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_AFFILIATE_API_URL: process.env.NEXT_PUBLIC_AFFILIATE_API_URL,
  },
});