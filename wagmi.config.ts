import { defineConfig } from "@wagmi/cli";
import { hardhat, react, actions } from "@wagmi/cli/plugins";
import { contracts } from "./hardhat/deployments";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      project: "./hardhat/",
      deployments: Object.entries(contracts).reduce((acc, [key, value]) => {
        if (!value.beacon) {
          acc[key] = value.address;
        }
        return acc;
      }, {} as Record<string, `0x${string}` | Record<number, `0x${string}`> | undefined>),
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
    actions({
      getContract: true,
      readContract: true,
      watchContractEvent: true,
      writeContract: true,
      prepareWriteContract: true,
    }),
  ],
});
