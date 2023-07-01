import { Abi } from "viem";
import BlacklistJSON from "./artifacts/hardhat/contracts/Blacklist.sol/Blacklist.json";
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
  Blacklist: {
    abi: BlacklistJSON.abi,
    address: {
      31337: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
  },
  LTY: {
    abi: ERC20JSON.abi,
    address: {
      31337: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    },
  },
  LTYStaking: {
    abi: LTYStakingJSON.abi,
    address: {
      31337: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    },
  },
  LToken: {
    beacon: true,
    abi: LTokenJSON.abi,
    address: {
      31337: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    },
  },
  USDC: {
    abi: ERC20JSON.abi,
    address: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      31337: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    },
  },
  LUSDC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    },
  },
  EUROC: {
    abi: ERC20JSON.abi,
    address: {
      1: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
      31337: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    },
  },
  LEUROC: {
    contractName: "LToken",
    abi: LTokenJSON.abi,
    address: {
      31337: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    },
  },
  Multicall3: {
    abi: Multicall3Json.abi,
    address: {
      31337: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
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

// export type UnderlyingTokenId = {

// }
