// config.ts
import { http, createConfig } from 'wagmi'
import { chains } from "./chains";
import { env } from "../../../env.mjs";
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

const { connectors } = getDefaultWallets({
  appName: "Ledgity Yield",
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
})

export const config = createConfig({
  chains,
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http()])
  ),
  connectors
})