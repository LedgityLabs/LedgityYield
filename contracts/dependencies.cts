import { Address } from "viem";

export const dependencies: {
  [chainId: string]: {
    LDY?: Address;
    USDC?: Address;
    EURC?: Address;
  };
} = {
  // Ethereum Mainnet
  "1": {
    LDY: "0x482dF7483a52496F4C65AB499966dfcdf4DDFDbc",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  // X Layer Testnet
  "195": {
    LDY: "0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b",
    USDC: "0x7C3bE0fa5a20ad361685932a50be9dEC6F302db6",
  },
  // X Layer
  "196": {
    LDY: "0x39c54346eFA8e38FBC7B4daB3dc9B61D76e80e3b",
    USDC: "0x74b7f16337b8972027f6196a17a631ac6de26d22",
  },
  // Arbitrum One
  "42161": {
    LDY: "0x999FAF0AF2fF109938eeFE6A7BF91CA56f0D07e1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  // Sonic
  "146": {
    LDY: "0x9cFBf905a444B5c871f0B447e137e8Ce7EeD0BCE",
    USDC: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
    EURC: "0xe715cbA7B5cCb33790ceBFF1436809d36cb17E57",
  },
  // Hedera
  "295": {
    LDY: "0x9588f69388E905Dc55cF36f70c769da96aeE069F",
    USDC: "0x000000000000000000000000000000000006f89a",
  },
  // Arbitrum Goerli
  "421613": {
    USDC: "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63",
  },
  // Arbitrum Sepolia
  "421614": {
    USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  },
  // Linea Goerli
  "59140": {
    USDC: "0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068",
  },
  // Linea
  "59144": {
    USDC: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  },
  // Base
  "8453": {
    LDY: "0x055d20a70eFd45aB839Ae1A39603D0cFDBDd8a13",
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    EURC: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
  },
  // Base Testnet
  "84532": {
    LDY: "0x8584BCd220A048104e654F842C56E33d37d6aEe3",
    USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  // Sepolia
  "11155111": {
    LDY: "0xD57baAf94696F178804fBFB2345c977C40F20266",
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
};
