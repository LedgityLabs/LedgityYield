"use client";
import { FC, createContext } from "react";
import { chainAwarePublicClient } from "@/components/DApp";
import { useState } from "react";
import { usePublicClient, useSwitchNetwork } from "wagmi";
import { getConfig } from "@wagmi/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";

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
  const publicClient = usePublicClient();
  const { switchNetworkAsync: switchWalletNetwork } = useSwitchNetwork();
  const [isSwitching, setIsSwitching] = useState(false);
  const searchParams = useSearchParams();

  const switchNetwork = async (id: string | number) => {
    setIsSwitching(true);

    // Ensure the id is a number
    if (typeof id === "string") id = Number.parseInt(id);

    // Ignore if trying to switch to the same network
    if (publicClient && publicClient.chain.id !== id) {
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
          chainAwarePublicClient({ chainId: config.chainId || (id as number) }),
        );
      }
    }

    setIsSwitching(false);
  };

  const handleDefault = () => {
    const chain = searchParams.get("c");
    let hasBeenSet = false;
    if (chain) {
      if (chain === "l") {
        setCookie("preferedChain", "59144");
        switchNetwork(59144);
        hasBeenSet = true;
      } else if (chain === "a") {
        setCookie("preferedChain", "42161");
        switchNetwork(42161);
        hasBeenSet = true;
      }
    }
    if (!hasBeenSet && getCookie("preferedChain")) {
      // Change the network to the prefered one (if the wallet is not connected)
      if (!switchWalletNetwork) switchNetwork(getCookie("preferedChain")!.toString());
    }
  };

  // If the user comes from a prefered chain, set it as the default chain
  useEffect(() => {
    handleDefault();
  }, [switchWalletNetwork]);

  useEffect(() => {
    handleDefault();
  }, []);

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
