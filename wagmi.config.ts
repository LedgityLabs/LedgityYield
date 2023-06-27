import { defineConfig } from "@wagmi/cli";
import { hardhat, react, erc } from "@wagmi/cli/plugins";
import { contracts } from "./hardhat/deployments";

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
      exclude: ["hardhat/contracts/abstracts/**"],
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
