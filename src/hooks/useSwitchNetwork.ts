import { useCallback, useState } from "react";
import { useDApp } from "./useDApp";
import { ConnectorNotFoundError, switchNetwork as _switchNetwork } from "@wagmi/core";

export const useSwitchNetwork = () => {
  const { handleChange } = useDApp();
  const [switching, setSwitching] = useState(false);

  const switchNetwork = async (_id: string | number) => {
    setSwitching(true);
    const id = typeof _id === "number" ? _id : Number.parseInt(_id);
    // Try to switch wallet's network
    try {
      await _switchNetwork({
        chainId: id,
      });
      await handleChange(id);
      setSwitching(false);
    } catch (e) {
      if (e instanceof Error) {
        // If the error is that the user rejected the switch
        if (e.message.includes("rejected")) {
          setSwitching(false);
          return;
        }
        // Or if no wallet is connected
        else if (e instanceof ConnectorNotFoundError) {
          await handleChange(id);
          setSwitching(false);
          return;
        }
        // Else throw it
        else throw e;
      }
    }
  };
  return { switchNetwork, switching };
};
