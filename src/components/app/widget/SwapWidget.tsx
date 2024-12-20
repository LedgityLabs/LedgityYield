import "@swing.xyz/ui/theme.css";
import { Swap } from "@swing.xyz/ui";

export function SwapWidget() {
  return (
    <div className="w-[90vw] max-w-[800px] mx-auto sm:w-[95vw] xs:w-screen xs:px-2.5 pb-8">
      <Swap projectId="swing-bridge" environment="production" />
    </div>
  );
}
