import { useAccount, useChainId, useChains } from "wagmi";

export const useCurrentChain = () => {
  const { chainId: walletChainId, chain: walletChain } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  if (walletChainId) return walletChain;
  else return chains.find((chain) => chain.id === chainId);
};
