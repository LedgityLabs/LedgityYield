import { defineConfig } from "@wagmi/cli";
import { hardhat, react, actions } from "@wagmi/cli/plugins";
import { contracts } from "./contracts/deployments";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      project: "./contracts/hardhat/",
      deployments: Object.entries(contracts).reduce(
        (acc, [key, value]) => {
          if (!value.beacon) {
            acc[key] = value.address;
          }
          return acc;
        },
        {} as Record<string, `0x${string}` | Record<number, `0x${string}`> | undefined>,
      ),
      include: ["contracts/src/**"],
      exclude: [
        "contracts/src/abstracts/**",
        "contracts/src/libs/**",
        "contracts/src/Multicall3.sol/**",
      ],
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
    actions({
      getContract: true,
      readContract: true,
      watchContractEvent: true,
      writeContract: true,
      prepareWriteContract: true,
    }),
  ],
});
