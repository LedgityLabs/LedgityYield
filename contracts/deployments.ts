import { Abi } from "viem";
import GlobalOwnerJSON from "./hardhat/artifacts/contracts/src/GlobalOwner.sol/GlobalOwner.json";
import GlobalPauseJSON from "./hardhat/artifacts/contracts/src/GlobalPause.sol/GlobalPause.json";
import GlobalBlacklistJSON from "./hardhat/artifacts/contracts/src/GlobalBlacklist.sol/GlobalBlacklist.json";
import LDYStakingJSON from "./hardhat/artifacts/contracts/src/LDYStaking.sol/LDYStaking.json";
import LTokenJSON from "./hardhat/artifacts/contracts/src/LToken.sol/LToken.json";
import ERC20JSON from "./hardhat/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import LTokenSignalerJSON from "./hardhat/artifacts/contracts/src/LTokenSignaler.sol/LTokenSignaler.json";
import Multicall3JSON from "./hardhat/artifacts/contracts/src/Multicall3.sol/Multicall3.json";
import APRCheckpointsJSON from "./hardhat/artifacts/contracts/src/libs/APRCheckpoints.sol/APRCheckpoints.json";

interface Contract {
  contractName?: string;
  beacon?: boolean;
  abi: Abi;
  address: {
    [key: number]: `0x${string}`;
  };
}

const _contracts = {
  GlobalOwner: {
    abi: GlobalOwnerJSON.abi,
    address: {
      31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
  },
  GlobalPause: {
    abi: GlobalPauseJSON.abi,
    address: {
      31337: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    },
  },
  GlobalBlacklist: {
    abi: GlobalBlacklistJSON.abi,
    address: {
      31337: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    },
  },
  APRCheckpoints: {
    abi: APRCheckpointsJSON.abi,
    address: {
      31337: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    },
  },
  LDY: {
    abi: ERC20JSON.abi,
    address: {
      31337: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    },
  },
  LDYStaking: {
    abi: LDYStakingJSON.abi,
    address: {
      31337: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    },
  },
  USDC: {
    abi: ERC20JSON.abi,
    address: {
      31337: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
      59144: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
      59140: "0x",
      42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      421613: "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63",
    },
  },
  EUROC: {
    abi: ERC20JSON.abi,
    address: {
      31337: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    },
  },
  LUSDC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    },
  },
  LEUROC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    },
  },
  LTokenSignaler: {
    abi: LTokenSignalerJSON.abi,
    address: {
      31337: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
    },
  },
  Multicall3: {
    abi: Multicall3JSON.abi,
    address: {
      31337: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
      59144: "0xcA11bde05977b3631167028862bE2a173976CA11",
      59140: "0xcA11bde05977b3631167028862bE2a173976CA11",
      42161: "0xcA11bde05977b3631167028862bE2a173976CA11",
      421613: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
} as const;

// Holds a disjunction of all contracts IDs.
export type ContractId = keyof typeof _contracts;

// Export a typed version of _contracts object
export const contracts = _contracts as Record<ContractId, Contract>;

export type LTokenId = {
  [K in ContractId]: (typeof _contracts)[K] extends { contractName: "LToken" } ? K : never;
}[ContractId];

// Holds a disjunction of all L-Token contracts IDs (excluding beacon one).
export const lTokensIds = Object.keys(contracts).filter((key) => {
  return contracts[key as ContractId].contractName === "LToken";
}) as LTokenId[];
