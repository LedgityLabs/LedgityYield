import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SCORECHAIN_API_URL: z.string().url(),
    SCORECHAIN_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_THEGRAPH_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SCORECHAIN_API_URL: process.env.SCORECHAIN_API_URL,
    SCORECHAIN_API_KEY: process.env.SCORECHAIN_API_KEY,
    NEXT_PUBLIC_THEGRAPH_API_KEY: process.env.NEXT_PUBLIC_THEGRAPH_API_KEY,
  },
});