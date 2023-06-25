import BlacklistJSON from "./artifacts/hardhat/contracts/Blacklist.sol/Blacklist.json";
import LTYStakingJSON from "./artifacts/hardhat/contracts/LTYStaking.sol/LTYStaking.json";
import GenericStableTokenJSON from "./artifacts/hardhat/contracts/GenericStableToken.sol/GenericStableToken.json";
import LTokenJSON from "./artifacts/hardhat/contracts/LToken.sol/LToken.json";

interface Contracts {
  [key: string]: {
    [key: string]: {
      beacon?: true;
      proxy?: true;
      address?: `0x${string}`;
      abi: any;
    };
  };
}

export const contracts: Contracts = {
  31337: {
    Blacklist: {
      proxy: true,
      address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      abi: BlacklistJSON.abi,
    },
    LTYStaking: {
      proxy: true,
      address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      abi: LTYStakingJSON.abi,
    },
    LToken: {
      beacon: true,
      address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      abi: LTokenJSON.abi,
    },
    LUSDC: {
      proxy: true,
      address: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
      abi: LTokenJSON.abi,
    },
    LEUROC: {
      proxy: true,
      address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
      abi: LTokenJSON.abi,
    },
  },
};
