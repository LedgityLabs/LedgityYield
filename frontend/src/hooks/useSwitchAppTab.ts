import { useContext } from "react";
import { SwitchAppTabContext } from "@/contexts";

export const useSwitchAppTab = () => {
  const context = useContext(SwitchAppTabContext);
  if (context === undefined)
    throw new Error("useSwitchAppTab() must be used within a <SwitchAppTabContext>");
  return context;
};
