import { useContext } from "react";
import { MainContext } from "@/contexts";

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (context === undefined)
    throw new Error("useMainContext() must be used within a <MainContext>");
  return context;
};
