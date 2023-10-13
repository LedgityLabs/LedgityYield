import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SCORECHAIN_API_URL: z.string().url(),
    SCORECHAIN_API_KEY: z.string(),
    ZEALY_API_KEY: z.string(),
    TWITTER_CLIENT_ID: z.string(),
    TWITTER_CLIENT_SECRET: z.string(),
    REDIS_HOST: z.string(),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
  },
  client: {
    NEXT_PUBLIC_THEGRAPH_API_KEY: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_THEGRAPH_API_KEY: process.env.NEXT_PUBLIC_THEGRAPH_API_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
});
