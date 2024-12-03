"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { FC, useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../lib/dapp/config";
import RainbowKitProvider from "./RainbowKitProvider";
import { MainContextProvider } from "@/contexts";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchInterval: 10000,
      retry: 1,
    },
  },
});

interface Props {
  children?: React.ReactNode;
}

const DApp: FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <MainContextProvider>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </MainContextProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default DApp;