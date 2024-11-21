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

// Retrive Mainnet API key from secrets.json (if available)
let mainnetApiKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  mainnetApiKey = secrets.ETHERSCAN_API_KEY;
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

// Retrive Mainnet RPC URL from secrets.json (if available)
let MAINNET_RPC_URL: string | undefined;
try {
  const secrets = require("./secrets.json");
  MAINNET_RPC_URL = secrets.MAINNET_RPC_URL;
} catch (e) {}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      // {
      //   version: "0.8.10",
      //   settings: {
      //     optimizer: {
      //       enabled: true,
      //       runs: 200,
      //     },
      //   },
      // },
      {
        version: "0.8.18",
        settings: {
          evmVersion: "london",
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
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
      chainId: 31337,
      initialBaseFeePerGas: 0,
      deploy: ["./contracts/hardhat/mainnet-deploy"],
      saveDeployments: true,
    },
    mainnet: {
      chainId: 1,
      url: MAINNET_RPC_URL,
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      deploy: ["./contracts/hardhat/mainnet-deploy"],
      verify: {
        etherscan: {
          apiKey: mainnetApiKey,
          apiUrl: "https://api.etherscan.io",
        },
      },
    },
    linea: {
      chainId: 59144,
      url: "https://linea-mainnet.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      deploy: ["./contracts/hardhat/linea-mainnet-deploy"],
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
          apiKey: mainnetApiKey,
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
      deploy: ["./contracts/hardhat/arbi-mainnet-deploy"],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: arbiscanApiKey,
          apiUrl: "https://api.arbiscan.io/",
        },
      },
    },
    arbitrumSepolia: {
      chainId: 421614,
      url: "https://arb-sepolia.g.alchemy.com/v2/_976nGRu_17y8mA3ywVTwBsmNAbE2NL1",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
      verify: {
        etherscan: {
          apiKey: arbiscanApiKey,
          apiUrl: "https://api-sepolia.arbiscan.io",
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
      url: "https://base-mainnet.g.alchemy.com/v2/Ui4vv-Z6n-6lAyB9spGYJL1pV3MDNnTh",
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
    xlayer: {
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
    xlayer_testnet: {
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
  },
  etherscan: {
    apiKey: {
      mainnet: mainnetApiKey!,
      sepolia: mainnetApiKey!,
      linea: lineascanApiKey!,
      arbitrumOne: arbiscanApiKey!,
      arbitrumSepolia: arbiscanApiKey!,
      base: basescanApiKey!,
      baseSepolia: basescanApiKey!,
      xlayer: okxscanApiKey!,
      xlayer_testnet: okxscanApiKey!,
    },
    customChains: [
      {
        network: "xlayer_testnet",
        chainId: 195,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET",
          browserURL: "https://www.oklink.com/xlayer-test",
        },
      },
      {
        network: "xlayer",
        chainId: 196,
        urls: {
          apiURL:
            "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer",
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
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
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
