// frontend/src/contexts/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import RainbowKitProvider from "@/components/RainbowKitProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchInterval: 10000,
    },
  },
});

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  );
};

export default Providers;