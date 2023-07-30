import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts/src",
    tests: "./contracts/hardhat/test",
    cache: "./contracts/hardhat/cache",
    artifacts: "./contracts/hardhat/artifacts",
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    linea: {
      url: "",
      chainId: 59144,
    },
    lineaGoerli: {
      url: "",
      chainId: 59140,
    },
    arbitrum: {
      url: "",
      chainId: 42161,
    },
    arbitrumGoerli: {
      url: "",
      chainId: 421613,
    },
  },
  defaultNetwork: "hardhat",
};

export default config;
