import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";
import { contracts } from "./hardhat/contracts";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      project: "./hardhat/",
      deployments: Object.entries(contracts).reduce(
        (acc, [key, value]) => {
          acc[key] = value.address;
          return acc;
        },
        {} as {
          [x: string]: `0x${string}` | Record<number, `0x${string}`> | undefined;
        }
      ),
      include: ["hardhat/contracts/**"],
      exclude: ["hardhat/contracts/abstracts/**", "hardhat/contracts/LToken.sol/**"],
    }),
    react({
      useContractRead: true,
      useContractFunctionRead: true,
      useContractWrite: true,
      usePrepareContractWrite: true,
      useContractFunctionWrite: true,
      usePrepareContractFunctionWrite: true,
      useContractEvent: true,
      useContractItemEvent: true,
    }),
  ],
});
