// This file has a .cts extension, because Hardhat that's currently the only way to get
// hardhat to support ESM in TypeScript projects.
// See: https://hardhat.org/hardhat-runner/docs/advanced/using-esm
// And: https://github.com/NomicFoundation/hardhat/issues/3385

import { type HardhatUserConfig } from "hardhat/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";

// Retrieve deployer private key from secrets.json (if available)
let deployerPrivateKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  deployerPrivateKey = secrets.CONTRACT_DEPLOYER_PRIVATE_KEY;
} catch (e) {}

// Retrieve Lineascan API key from secrets.json (if available)
let lineascanApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  lineascanApiKey = secrets.LINEASCAN_API_KEY;
} catch (e) {}

// Retrive Arbiscan API key from secrets.json (if available)
let arbiscanApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  arbiscanApiKey = secrets.ARBISCAN_API_KEY;
} catch (e) {}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
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
    cache: "./contracts/hardhat/cache",
    artifacts: "./contracts/hardhat/artifacts",
    deploy: "./contracts/hardhat/deploy",
    deployments: "./contracts/hardhat/deployments",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      // Is used to fix gas estimation error
      // See: https://github.com/NomicFoundation/hardhat/issues/3089#issuecomment-1366428941
      initialBaseFeePerGas: 0,
    },
    linea: {
      chainId: 59144,
      url: "https://linea-mainnet.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: lineascanApiKey,
          apiUrl: "https://api.lineascan.build",
        },
      },
    },
    lineaGoerli: {
      chainId: 59140,
      url: "https://linea-goerli.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
    },
    arbitrum: {
      chainId: 42161,
      url: "https://arbitrum-mainnet.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: arbiscanApiKey,
          apiUrl: "https://api.arbiscan.io/",
        },
      },
    },
    arbitrumGoerli: {
      chainId: 421613,
      url: "https://arbitrum-goerli.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
    },
    OKX_X1_testnet: {
      chainId: 195,
      url: "https://testrpc.x1.tech",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
    },
  },
  etherscan: {
    apiKey: {
      linea: lineascanApiKey!,
      arbitrumOne: arbiscanApiKey!,
    },
    customChains: [
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
};

export default config;
