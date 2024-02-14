import { http } from "@wagmi/core";
import { chains } from "./chains";
import { createClient } from "viem";
// import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { env } from "../../../env.mjs";
import { wallets } from "./wallets";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Ledgity Yield",
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  ssr: true,
  chains,
  wallets,
  // @ts-ignore
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
