"use client";
/**
 * This file initializes Wagmi and RainbowKit and exports a DApp component that should wrap the part of
 * the app that requires access to Wagmi hooks and Connect Wallet button.
 */
import { env } from "../../../env.mjs";
import React, { FC } from "react";
import merge from "lodash.merge";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  lightTheme,
  type Theme,
  connectorsForWallets,
  type AvatarComponent,
  type DisclaimerComponent,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  argentWallet,
  bitskiWallet,
  braveWallet,
  coinbaseWallet,
  dawnWallet,
  ledgerWallet,
  imTokenWallet,
  metaMaskWallet,
  okxWallet,
  omniWallet,
  phantomWallet,
  rabbyWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  xdefiWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { chains } from "@/lib/chains";
import { WalletAvatar } from "@/components/ui/WalletAvatar";
import { SwitchNetworkProvider } from "@/contexts";

//
const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      safeWallet({ chains }),
      ledgerWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      phantomWallet({ chains }),
      coinbaseWallet({ appName: "Ledgity DeFi", chains }),
      braveWallet({ chains }),
      argentWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      injectedWallet({ chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      okxWallet({ projectId, chains }),
      bitskiWallet({ chains }),
      dawnWallet({ chains }), //
      imTokenWallet({ projectId, chains }),
      omniWallet({ projectId, chains }),
      rabbyWallet({ chains }),
      tahoWallet({ chains }),
      xdefiWallet({ chains }),
      zerionWallet({ projectId, chains }),
    ],
  },
]);

// Retrieve public clients and setup Wagmi config
export const { publicClient: chainAwarePublicClient } = configureChains(chains, [publicProvider()], {
  rank: true,
});
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient: chainAwarePublicClient,
});

// Built RainbowKit theme
const ledgityTheme: Theme = merge(lightTheme(), {
  colors: {
    accentColor: "rgb(var(--primary-bg))",
    accentColorForeground: "rgb(var(--primary-fg))",
    profileForeground: "#eef2ff",
    modalBackdrop: "var(--modal-backdrop)",
  },
  blurs: {
    modalOverlay: "blur(12px)",
  },
  fonts: {
    body: "var(--font-body)",
  },
} as Partial<Theme>);

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to <br />
    our&nbsp;
    <Link href="/legal/terms-of-service">Terms of Service</Link> and&nbsp;
    <Link href="/legal/privacy-policy">Privacy Policy</Link>.
  </Text>
);

interface Props {
  children?: React.ReactNode;
}

export const DApp: FC<Props> = async (props?: Props) => {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        theme={ledgityTheme}
        avatar={WalletAvatar as AvatarComponent}
        appInfo={{
          appName: "Ledgity DeFi",
          disclaimer: Disclaimer,
        }}
        showRecentTransactions={true}
      >
        <SwitchNetworkProvider>{props && props.children}</SwitchNetworkProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
export default DApp;
