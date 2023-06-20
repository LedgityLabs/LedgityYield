import { useContext } from "react";
import { DAppContext } from "@/contexts";

export const useDApp = () => {
  const context = useContext(DAppContext);
  if (context === undefined) throw new Error("useDApp() must be used within a <DAppProvider>");
  return context;
};
