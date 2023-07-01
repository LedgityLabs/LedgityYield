"use client";
import { FC, createContext } from "react";
import { chainAwarePublicClient } from "@/components/app/DApp";
import { useState } from "react";
import { useSwitchNetwork } from "wagmi";
import { getConfig } from "@wagmi/core";

interface ISwitchNetworkContext {
  switchNetwork: (id: string | number) => void;
  isSwitching: boolean;
}

export const SwitchNetworkContext = createContext<ISwitchNetworkContext | undefined>(undefined);

interface Props {
  children?: React.ReactNode;
}

export const SwitchNetworkProvider: FC<Props> = ({ children }) => {
  const config = getConfig();
  const { switchNetworkAsync: switchWalletNetwork } = useSwitchNetwork();
  const [isSwitching, setIsSwitching] = useState(false);

  const switchNetwork = async (id: string | number) => {
    setIsSwitching(true);
    // Ensure the id is a number
    if (typeof id === "string") id = Number.parseInt(id);

    let error: Error | null = null;
    // If a wallet is connected, switch the wallet network
    if (switchWalletNetwork) {
      await switchWalletNetwork(id).catch((e: Error) => {
        // Ignore the error if it's a user rejected switch
        if (!e.message.includes("rejected")) error = e;
      });
    }
    // If no wallet is connected or wallet switch was successful
    if (!error) {
      // Switch public client
      config.setPublicClient((config: { chainId?: number }) =>
        chainAwarePublicClient({ chainId: config.chainId || (id as number) })
      );
    }
    setIsSwitching(false);
  };

  return (
    <SwitchNetworkContext.Provider
      value={{
        switchNetwork,
        isSwitching,
      }}
    >
      {children}
    </SwitchNetworkContext.Provider>
  );
};
