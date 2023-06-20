import {
  ConnectButton as _ConnectButton,
  useAccountModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { chains, chainsIcons } from "@/lib/chains";
import { WalletAvatar } from "@/components/WalletAvatar";
import clsx from "clsx";
import { useDApp } from "@/hooks";
import { Button } from "@/components/ui";
import { WalletName } from "./WalletName";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import React from "react";

// Used as select value when no network or a wrong one is selected
const placeholder = <p>Select a network...</p>;

export const ConnectButton = () => {
  const { chain, wrongNetwork, walletClient } = useDApp();
  const { switchNetwork, switching } = useSwitchNetwork();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex gap-6 justify-center items-center">
      <Select onValueChange={switchNetwork} value={chain.id.toString()}>
        <SelectTrigger disabled={switching}>
          {(wrongNetwork && placeholder) || <SelectValue placeholder={placeholder} />}
        </SelectTrigger>
        <SelectContent>
          {chains.map((_chain) => (
            <SelectItem value={_chain.id.toString()} key={_chain.id}>
              <div className="flex justify-center items-center gap-[0.6rem]">
                <Image
                  alt={_chain.name ?? "Chain icon"}
                  src={chainsIcons[_chain.id] ?? ""}
                  width={20}
                  height={20}
                  className="w-6 h-6"
                />
                <p className="font-semibold">{_chain.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(walletClient && walletClient.account && (
        <Button
          disabled={wrongNetwork || switching}
          onClick={openAccountModal}
          size="medium"
          variant={wrongNetwork ? "destructive" : "primary"}
          className={clsx("flex justify-between gap-3 overflow-hidden", !wrongNetwork && "pr-[5px]")}
        >
          {(!wrongNetwork && (
            <>
              <p>
                <WalletName address={walletClient.account.address as `0x${string}`} />
              </p>
              <WalletAvatar
                address={walletClient.account.address as `0x${string}`}
                size={80}
                className="rounded-r-[0.6rem] rounded-l-sm h-[calc(100%-10px)]"
              />
            </>
          )) || <p>Wrong network</p>}
        </Button>
      )) || (
        <Button size="large" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
