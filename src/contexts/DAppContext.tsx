"use client";
import { FC, useState, createContext, useEffect } from "react";
import { contracts as _contracts } from "../../hardhat/deployments";
import {
  type Chain as _Chain,
  WalletClient,
  PublicClient,
  getNetwork,
  getPublicClient,
  getWalletClient,
  watchWalletClient,
  watchNetwork,
} from "@wagmi/core";

interface Chain extends _Chain {
  unsupported?: boolean | undefined;
}

interface IDAppContext {
  chain: Chain;
  wrongNetwork: boolean;
  publicClient: PublicClient;
  walletClient: WalletClient | null | undefined;
  handleChange: (network: number) => Promise<void>;
}

export const DAppContext = createContext<IDAppContext | undefined>(undefined);

interface DAppProviderProps {
  children?: React.ReactNode;
}

export const DAppProvider: FC<DAppProviderProps> = ({ children }) => {
  // Initialize network state
  const [walletClient, setWalletClient] = useState<WalletClient | null>();
  const __chain = getNetwork().chain;
  const [network, setNetwork] = useState(__chain ? __chain.id : 1);
  const [publicClient, setPublicClient] = useState(getPublicClient({ chainId: network }));
  const [chain, setChain] = useState<Chain>(__chain || publicClient.chain);
  const [wrongNetwork, setWrongNetwork] = useState((chain && chain.unsupported) || false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    getWalletClient().then((w) => {
      setWalletClient(w);
      setInitialized(true);
    });
    const unwatch1 = watchWalletClient({}, async () => await handleChange());
    const unwatch2 = watchNetwork(async () => await handleChange());
    setInitialized(true);
    return () => {
      unwatch1();
      unwatch2();
    };
  }, []);

  const handleChange = async (_network: number = 0) => {
    const _walletClient = await getWalletClient();
    let _chain: Chain | undefined = getNetwork().chain;
    if (_network == 0) _network = _chain ? _chain.id : network;
    const _publicClient = getPublicClient({ chainId: _network });
    _chain = _chain || _publicClient.chain;
    const _wrongNetwork = (_chain && _chain.unsupported) || false;
    setNetwork(_network);
    setWalletClient(_walletClient);
    setWrongNetwork(_wrongNetwork);
    setPublicClient(_publicClient);
    setChain(_chain);
  };

  return (
    <DAppContext.Provider
      value={{
        chain,
        wrongNetwork,
        publicClient,
        walletClient,
        handleChange,
      }}
    >
      {initialized && children}
    </DAppContext.Provider>
  );
};
