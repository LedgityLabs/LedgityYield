import "hardhat-contract-sizer";
import "hardhat-deploy";
import { type HardhatUserConfig } from "hardhat/config";

// Retrieve deployer private key from secrets.json (if available)
let deployerPrivateKey: string | undefined;
try {
  const secrets = require("./secrets.json");
  deployerPrivateKey = secrets.CONTRACT_DEPLOYER_PRIVATE_KEY;
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
    hardhat: {},
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },
    linea: {
      chainId: 59144,
      url: "https://linea-mainnet.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
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
    },
    arbitrumGoerli: {
      chainId: 421613,
      url: "https://arbitrum-goerli.infura.io/v3/05368c74554249babb6f126ccf325401",
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      saveDeployments: true,
    },
  },
  defaultNetwork: "hardhat",
};

export default config;
