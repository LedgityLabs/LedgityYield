// frontend/src/lib/dapp/config.ts
import { chains } from "./chains";
import { env } from "../../../env.mjs";
import { wallets } from "./wallets";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createConfig } from 'wagmi'
import { fallback } from 'viem'

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const getRPCUrl = (chainId: number) => {
  switch (chainId) {
    case 59144: // Linea
      return `https://linea-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
    case 42161: // Arbitrum One
      return `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
    default:
      return undefined;
  }
}

export const config = getDefaultConfig({
  appName: "Ledgity Yield",
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
  wallets,
  transports: Object.fromEntries(
    chains.map((chain) => [
      chain.id,
      fallback([
        http(
          getRPCUrl(chain.id) ?? chain.rpcUrls.default.http[0]
        ),
        http(chain.rpcUrls.public?.http[0] ?? chain.rpcUrls.default.http[0])
      ])
    ])
  )
});