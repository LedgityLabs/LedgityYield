import { useContext } from "react";
import { SwitchNetworkContext } from "@/contexts";

export const useSwitchNetwork = () => {
  const context = useContext(SwitchNetworkContext);
  if (context === undefined)
    throw new Error("useSwitchNetwork() must be used within a <SwitchNetworkProvider>");
  return context;
};
