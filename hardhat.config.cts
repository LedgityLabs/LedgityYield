// This file has a .cts extension, because Hardhat that's currently the only way to get
// hardhat to support ESM in TypeScript projects.
// See: https://hardhat.org/hardhat-runner/docs/advanced/using-esm
// And: https://github.com/NomicFoundation/hardhat/issues/3385

import { type HardhatUserConfig } from "hardhat/config";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-verify";
import "@okxweb3/hardhat-explorer-verify";

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

// Retrive Sepolia API key from secrets.json (if available)
let sepoliaApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  sepoliaApiKey = secrets.ETHERSCAN_API_KEY;
} catch (e) {}

// Retrive BaseScan API key from secrets.json (if available)
let basescanApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  basescanApiKey = secrets.BASESCAN_API_KEY;
} catch (e) {}

// Retrive BaseScan API key from secrets.json (if available)
let okxscanApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  okxscanApiKey = secrets.OKXSCAN_API_KEY;
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
  // sourcify: {
  //   enabled: true,
  // },
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
    sepolia: {
      chainId: 11155111,
      url: "https://eth-sepolia.g.alchemy.com/v2/-papiHFcZc0tr4XSPsnwE0bhdTKLetjg",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: sepoliaApiKey,
          apiUrl: "https://api-sepolia.etherscan.io",
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
    base: {
      chainId: 8453,
      url: "https://base-mainnet.g.alchemy.com/v2/XH9V8IOVLgFCIP-EAflB27MR0Bc5oVoO",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: basescanApiKey,
          apiUrl: "https://api.basescan.org",
        },
      },
    },
    baseSepolia: {
      chainId: 84532,
      url: "https://base-sepolia.g.alchemy.com/v2/spQc9SK_L-lIL2tJpYXuhLk2YJNwbuEr",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: basescanApiKey,
          apiUrl: "https://api-sepolia.basescan.org",
        },
      },
    },
    OKX_X1_mainnet: {
      chainId: 196,
      url: "https://rpc.xlayer.tech",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: okxscanApiKey,
          apiUrl:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
        },
      },
    },
    XLAYER_TESTNET: {
      chainId: 195,
      url: "https://testrpc.xlayer.tech",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: okxscanApiKey,
          apiUrl:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET",
        },
      },
    },
    // XLAYER_TESTNET: {
    //   url: "https://testrpc.xlayer.tech",
    //   accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
    // },
  },
  etherscan: {
    apiKey: {
      linea: lineascanApiKey!,
      arbitrumOne: arbiscanApiKey!,
      sepolia: sepoliaApiKey!,
      base: basescanApiKey!,
      baseSepolia: basescanApiKey!,
      OKX_X1_mainnet: okxscanApiKey!,
      XLAYER_TESTNET: okxscanApiKey!,
    },
    customChains: [
      {
        network: "XLAYER_TESTNET",
        chainId: 195,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET",
          browserURL: "https://www.oklink.com/xlayer-test",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
      {
        network: "OKX_X1_mainnet",
        chainId: 196,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer",
        },
      },
    ],
  },
  okxweb3explorer: {
    apiKey: okxscanApiKey,
  },
  defaultNetwork: "hardhat",
};

export default config;
