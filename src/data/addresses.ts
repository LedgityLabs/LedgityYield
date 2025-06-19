import { ChainId } from "./chainId";
import { zeroAddress, Address } from "viem";
import {
  globalBlacklistAddress,
  globalOwnerAddress,
  globalPauseAddress,
  ldyStakingAddress,
  lTokenSignalerAddress,
  preMiningAddress,
  //
  globalBlacklistSonicAddress,
  globalOwnerSonicAddress,
  globalPauseSonicAddress,
  ldyStakingSonicAddress,
  lTokenSignalerSonicAddress,
} from "@/types";

// @dev Copied from contracts/dependencies.cts
export const dependencies: {
  [chainId: string]: {
    LDY?: Address;
    USDC?: Address;
    EURC?: Address;
  };
} = {
  [ChainId.mainnet]: {
    LDY: "0x482dF7483a52496F4C65AB499966dfcdf4DDFDbc",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  [ChainId.arbitrum_one]: {
    LDY: "0x999FAF0AF2fF109938eeFE6A7BF91CA56f0D07e1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  [ChainId.sonic]: {
    LDY: "0x9cFBf905a444B5c871f0B447e137e8Ce7EeD0BCE",
    USDC: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
    EURC: "0xe715cbA7B5cCb33790ceBFF1436809d36cb17E57",
  },
  [ChainId.linea]: {
    USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  },
  [ChainId.base]: {
    LDY: "0x055d20a70eFd45aB839Ae1A39603D0cFDBDd8a13",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    EURC: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
  },
  [ChainId.hedera]: {
    LDY: "0x9588f69388E905Dc55cF36f70c769da96aeE069F",
    USDC: "0x000000000000000000000000000000000006f89a",
  },
};

export type ContractName =
  | "GlobalBlacklist"
  | "GlobalOwner"
  | "GlobalPause"
  | "LDY"
  | "LDYStaking"
  | "LTokenSignaler"
  | "PreMining"
  // Tokens
  | "EURC"
  | "USDC"
  | "LEURC"
  | "LUSDC"
  | "lyEUR"
  | "lyUSD";

// @dev New LTokens should be specified here to feed the wagmi hooks
export const lTokenAddresses: {
  [chainId: number]: {
    LEURC?: Address;
    LUSDC?: Address;
  };
} = {
  [ChainId.mainnet]: {},
  [ChainId.sonic]: {
    LEURC: "0x88dC8674339731A12a08624f455Fd41Fe2d6DC82",
    LUSDC: "0xD7cCABfBEfE332C9784FF3debeBdDbc787E75e69",
  },
  [ChainId.arbitrum_one]: {
    LUSDC: "0xd54d564606611A3502FE8909bBD3075dbeb77813",
  },
  [ChainId.base]: {
    LEURC: "0x77ce973744745310359B0d1a3415A34FF983708F",
    LUSDC: "0x3C769d0e8D21d380228dFB7918c6933bb6ecB6D4",
  },
  [ChainId.linea]: {
    LUSDC: "0x4AF215DbE27fc030F37f73109B85F421FAB45B7a",
  },
  [ChainId.hedera]: {
    LUSDC: "0x92A5C054358c7cfd10d6593570fb4E3349f4d459",
  },
};

export const wrappedLTokensAddresses: {
  [chainId: number]: {
    lyEUR?: Address;
    lyUSD?: Address;
  };
} = {
  [ChainId.mainnet]: {},
  [ChainId.sonic]: {
    lyEUR: "0xff95bE862813739C5f2A25b8d3B3E166fE5Dd49e",
    lyUSD: "0xbb86bAe893F8EA5bf34e708ECB10e82090331C01",
  },
  [ChainId.arbitrum_one]: {},
  [ChainId.base]: {},
  [ChainId.linea]: {},
  [ChainId.hedera]: {
    lyUSD: "0x914850de7EdbA37457C451695eD912F61C16070B",
  },
};

function fetchChainAddresses(
  chainId:
    | ChainId.mainnet
    | ChainId.arbitrum_one
    | ChainId.base
    | ChainId.linea
    | ChainId.sonic,
): {
  [key in ContractName]: Address;
} {
  // Check that LTokens always have their underlying token address specified
  if (
    (lTokenAddresses[chainId]?.LEURC && !dependencies[chainId]?.EURC) ||
    (lTokenAddresses[chainId]?.LUSDC && !dependencies[chainId]?.USDC)
  )
    throw Error("LToken address specified without dependency address");

  /// @dev Override for special Sonic implementation with FeeM register library
  if (chainId === ChainId.sonic) {
    return {
      GlobalBlacklist: globalBlacklistSonicAddress[chainId] || zeroAddress,
      GlobalOwner: globalOwnerSonicAddress[chainId] || zeroAddress,
      GlobalPause: globalPauseSonicAddress[chainId] || zeroAddress,
      LDYStaking: ldyStakingSonicAddress[chainId] || zeroAddress,
      LTokenSignaler:
        (lTokenSignalerSonicAddress as any)[chainId] || zeroAddress,
      PreMining: (preMiningAddress as any)[chainId] || zeroAddress,
      // Tokens
      LDY: dependencies[chainId]?.LDY || zeroAddress,
      LEURC: lTokenAddresses[chainId]?.LEURC || zeroAddress,
      LUSDC: lTokenAddresses[chainId]?.LUSDC || zeroAddress,
      EURC: dependencies[chainId]?.EURC || zeroAddress,
      USDC: dependencies[chainId]?.USDC || zeroAddress,
      // Wrapped
      lyEUR: wrappedLTokensAddresses[chainId]?.lyEUR || zeroAddress,
      lyUSD: wrappedLTokensAddresses[chainId]?.lyUSD || zeroAddress,
    };
  }

  // @dev The as const of the addresses is annoying for generic functions
  return {
    GlobalBlacklist: globalBlacklistAddress[chainId] || zeroAddress,
    GlobalOwner: globalOwnerAddress[chainId] || zeroAddress,
    GlobalPause: globalPauseAddress[chainId] || zeroAddress,
    LDYStaking: ldyStakingAddress[chainId] || zeroAddress,
    LTokenSignaler: (lTokenSignalerAddress as any)[chainId] || zeroAddress,
    PreMining: (preMiningAddress as any)[chainId] || zeroAddress,
    // Tokens
    LDY: dependencies[chainId]?.LDY || zeroAddress,
    LEURC: lTokenAddresses[chainId]?.LEURC || zeroAddress,
    LUSDC: lTokenAddresses[chainId]?.LUSDC || zeroAddress,
    EURC: dependencies[chainId]?.EURC || zeroAddress,
    USDC: dependencies[chainId]?.USDC || zeroAddress,
    // Wrapped
    lyEUR: wrappedLTokensAddresses[chainId]?.lyEUR || zeroAddress,
    lyUSD: wrappedLTokensAddresses[chainId]?.lyUSD || zeroAddress,
  };
}

const addressesProd: {
  [chainId: number]: {
    [key in ContractName]: Address;
  };
} = {
  [ChainId.mainnet]: fetchChainAddresses(ChainId.mainnet),
  [ChainId.arbitrum_one]: fetchChainAddresses(ChainId.arbitrum_one),
  [ChainId.base]: fetchChainAddresses(ChainId.base),
  [ChainId.linea]: fetchChainAddresses(ChainId.linea),
  [ChainId.sonic]: fetchChainAddresses(ChainId.sonic),
};

export const ADDRESSES = addressesProd;
