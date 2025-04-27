import {
  createContext,
  useState,
  ReactElement,
  useContext,
  useEffect,
} from "react";
// Context
import { useWeb3Context } from "./Web3ContextProvider";
// Hooks
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "../utils/useLocalStorage";
import {
  useTokenInfos,
  useLTokenInfos,
  useWLTokenInfos,
} from "@/hooks/contracts";
import { useTokenPricesUsd } from "@/hooks/api/useTokenPricesUsd";
// Functions
import { computeTvlMetrics, TvlMetrics } from "@/functions/helpers";
// Data
import {
  lTokenAddresses,
  wrappedLTokensAddresses,
  dependencies,
} from "@/data/addresses";
// Types
import { TokenInfo, LTokenInfo, WLTokenInfo } from "@/types";
import { Address } from "viem";

type AppDataContext = {
  referralCode: string;
  lTokenInfos: LTokenInfo[];
  lTokenInfosCurrentChain: LTokenInfo[];
  wLTokensInfos: WLTokenInfo[];
  wLTokenInfosCurrentChain: WLTokenInfo[];
  tvlMetrics: TvlMetrics;
  isLoadingPrices: boolean;
  tokenInfos: TokenInfo[];
};

const AppDataContext = createContext({} as AppDataContext);

export function AppDataContextProvider({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const { currentAccount, appChainId } = useWeb3Context();

  // ==== Referral Code ==== //

  const searchParams = useSearchParams();

  const { localData: referralCode, setLocalData: setReferralCode } =
    useLocalStorage("referralCode", "");

  useEffect(() => {
    if (referralCode) return;

    if (searchParams.has("referral")) {
      const referralCode = searchParams.get("referral");
      if (!referralCode) return;

      setReferralCode(referralCode);
    }
  }, []);

  // ==== Token Datas ==== //

  const ltokens = Object.keys(lTokenAddresses).flatMap((chainId) =>
    Object.values(lTokenAddresses[Number(chainId)]).map((address) => ({
      address,
      chainId: Number(chainId),
    })),
  );
  const lTokenInfos = useLTokenInfos(ltokens, currentAccount);
  const lTokenInfosCurrentChain = lTokenInfos.filter(
    (lToken) => lToken.chainId === appChainId,
  );

  const wLTokens = Object.keys(wrappedLTokensAddresses).flatMap((chainId) =>
    Object.values(wrappedLTokensAddresses[Number(chainId)]).map((address) => ({
      address,
      chainId: Number(chainId),
    })),
  );
  const wLTokensInfos = useWLTokenInfos(wLTokens, currentAccount);
  const wLTokenInfosCurrentChain = wLTokensInfos.filter(
    (wLToken) => wLToken.chainId === appChainId,
  );

  // @dev Safe to cast since strings in the Set are Address typed
  const tokens = [
    // Get data from ltoken underlying
    ...lTokenInfos.map((lToken) => ({
      address: lToken.underlying,
      chainId: lToken.chainId,
    })),
    ...Object.values(dependencies[appChainId]).map((address) => ({
      address,
      chainId: appChainId,
    })),
  ] as { address: Address; chainId?: number }[];
  const tokenInfos = useTokenInfos(tokens);

  // ==== Prices ==== //

  const underlyingSymbols = [
    ...new Set(lTokenInfos.map((lToken) => lToken.symbol.slice(1))),
  ];
  const tokenPrices = useTokenPricesUsd(underlyingSymbols);
  const isLoadingPrices = Object.keys(tokenPrices).length === 0;

  const tvlMetrics = computeTvlMetrics(lTokenInfos, tokenPrices);

  return (
    <AppDataContext.Provider
      value={{
        referralCode,
        lTokenInfos,
        lTokenInfosCurrentChain,
        wLTokensInfos,
        wLTokenInfosCurrentChain,
        tvlMetrics,
        isLoadingPrices,
        tokenInfos,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppDataContext = () => useContext(AppDataContext);
