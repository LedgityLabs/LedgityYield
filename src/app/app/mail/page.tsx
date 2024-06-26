'use client'
import { type NextPage } from "next";
import React, { useEffect } from 'react';
import ProtectMailForm from "@/components/mail/ProtectMailForm";
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";

const Page: NextPage = () => {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const desiredChainId = 134; // For Ethereum mainnet. Adjust as needed.

  useEffect(() => {
    if (currentChainId !== desiredChainId) {
      switchChain({ chainId: desiredChainId });
    }
  }, [currentChainId, switchChain]);

  return (
    <>
      <br />
      <ProtectMailForm />

    </>
  );
};
export default Page;