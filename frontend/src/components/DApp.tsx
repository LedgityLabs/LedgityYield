"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { FC } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../lib/dapp/config";
import RainbowKitProvider from "./RainbowKitProvider";
import { MainContextProvider } from "@/contexts";

const customSerializer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return { type: 'BigInt', value: value.toString() };
  }
  return value;
};

const customReviver = (key: string, value: any) => {
  if (value && typeof value === 'object' && value.type === 'BigInt') {
    return BigInt(value.value);
  }
  return value;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      structuralSharing: (oldData, newData) => {
        const serialized = JSON.stringify(newData, customSerializer);
        return JSON.parse(serialized, customReviver);
      },
    },
  },
});

interface Props {
  children?: React.ReactNode;
}

const DApp: FC<Props> = ({ children }) => {
  return (
    <MainContextProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </MainContextProvider>
  );
};

export default DApp;