import { chains } from "./chains";
import { env } from "../../../env.mjs";
import { wallets } from "./wallets";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const wagmiConfig = getDefaultConfig({
  appName: "Ledgity Yield",
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  // ssr: true,
  chains,
  wallets,
});
