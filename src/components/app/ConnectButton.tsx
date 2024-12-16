"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import {
  Button,
  WalletName,
  WalletAvatar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { chains, chainsIcons } from "@/lib/dapp/chains";
import clsx from "clsx";
import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useCurrentChain } from "@/hooks/useCurrentChain";

// Used as select value when no network or a wrong one is selected
const placeholder = <p>Select a network...</p>;

export const ConnectButton = () => {
  const account = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const chain = useCurrentChain();

  const wrongNetwork = !chain || !chain.id ? true : false;

  return (
    <div className="flex sm:gap-6 gap-3 justify-center items-center">
      <Select
        onValueChange={(value) => switchChain({ chainId: Number(value) })}
        value={chain?.id.toString()}
      >
        <SelectTrigger isLoading={isPending}>
          {wrongNetwork ? (
            placeholder
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
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
                  className="sm:w-6 w-7 sm:h-6 h-7 rounded-md overflow-hidden"
                />
                <p className="font-semibold sm:inline hidden">{_chain.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(account && account.address && (
        <Button
          disabled={wrongNetwork || isPending}
          onClick={openAccountModal}
          size="medium"
          variant={wrongNetwork ? "destructive" : "primary"}
          className={clsx(
            "flex justify-between gap-3 overflow-hidden",
            !wrongNetwork && "pr-[5px]",
          )}
        >
          {(!wrongNetwork && (
            <>
              <p className="min-[420px]:inline-block hidden">
                <WalletName address={account.address as `0x${string}`} />
              </p>
              <WalletAvatar
                address={account.address as `0x${string}`}
                size={80}
                className="rounded-r-[0.6rem] rounded-l-sm h-[calc(100%-10px)] min-[420px]:inline-block hidden"
              />
              {/* <div className="justify-center items-center sm:hidden inline-flex"> */}
              <i className="ri-wallet-3-fill min-[420px]:hidden inline text-2xl pr-2" />
              {/* </div> */}
            </>
          )) || <p>Wrong network</p>}
        </Button>
      )) || (
        <Button
          disabled={wrongNetwork || isPending}
          size="large"
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
