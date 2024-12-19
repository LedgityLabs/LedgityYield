import { TxWidget } from "@xswap-link/sdk";

export const dstChain = "42161";
export const dstToken = "0x999FAF0AF2fF109938eeFE6A7BF91CA56f0D07e1";

export function BridgeWidget() {
  return (
    <TxWidget
      integratorId={process.env.NEXT_PUBLIC_INTEGRATOR_ID || ""}
      dstChain={dstChain}
      dstToken={dstToken}
      lightTheme={true}
      defaultWalletPicker={true}
    />
  );
}


