import { Abi } from "viem";
import GlobalOwnerJSON from "./artifacts/hardhat/contracts/GlobalOwner.sol/GlobalOwner.json";
import GlobalPauserJSON from "./artifacts/hardhat/contracts/GlobalPauser.sol/GlobalPauser.json";
import GlobalBlacklistJSON from "./artifacts/hardhat/contracts/GlobalBlacklist.sol/GlobalBlacklist.json";
import LTYStakingJSON from "./artifacts/hardhat/contracts/LTYStaking.sol/LTYStaking.json";
import LTokenJSON from "./artifacts/hardhat/contracts/LToken.sol/LToken.json";
import ERC20JSON from "./artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import Multicall3Json from "./artifacts/hardhat/contracts/Multicall3.sol/Multicall3.json";

export const testnetIds = [
  31337, // Hardhat
  11155111, // Sepolia
  80001, // Mumbai
];

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
  GlobalPauser: {
    abi: GlobalPauserJSON.abi,
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
  LTY: {
    abi: ERC20JSON.abi,
    address: {
      31337: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    },
  },
  LTYStaking: {
    abi: LTYStakingJSON.abi,
    address: {
      31337: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    },
  },
  LToken: {
    beacon: true,
    abi: LTokenJSON.abi,
    address: {
      31337: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    },
  },
  USDC: {
    abi: ERC20JSON.abi,
    address: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      31337: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    },
  },
  LUSDC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    },
  },
  EUROC: {
    abi: ERC20JSON.abi,
    address: {
      1: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
      31337: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    },
  },
  LEUROC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
    },
  },
  Multicall3: {
    abi: Multicall3Json.abi,
    address: {
      31337: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
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
