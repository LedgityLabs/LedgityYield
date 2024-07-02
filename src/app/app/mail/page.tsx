"use client";
import { type NextPage } from "next";

import React, { useEffect, useState } from 'react';
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import ExplanationCard from "@/components/mail/ExplanationCard";
import EmailForm from "@/components/mail/EmailForm";
import SuccessfulProtection from "@/components/mail/SuccessfulProtection"
import ProtectedDataBox from "@/components/mail/ProtectedDataBox";
import { type Address } from "@iexec/web3mail";
import { checkIsProtected, handleSubmitProtection, checkAppIsGrantedAccess } from "@/components/mail/utils/utils";


const Page: NextPage = () => {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();
  const userAddress = address as string;
  const desiredChainId = 134; // For iExec sidechain.


  const [protectedDataAddress, setProtectedDataAddress] = useState<string>('');
  const [isProtected, setIsProtected] = useState(false);
  const [hasJustRegistered, setHasJustRegistered] = useState(false);
  const [appIsGrantedAccess, setAppIsGrantedAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      resetStates();
      checkIsProtectedWrapper(address as Address);
    }
  }, [address]);

  useEffect(() => {
    if (currentChainId !== desiredChainId) {
      try {
        switchChain({ chainId: desiredChainId });
      } catch (err) {
        setError(`Failed to switch chain: ${(err as Error).message}`);
      }
    }
  }, [currentChainId, switchChain, desiredChainId]);

  useEffect(() => {
    if (protectedDataAddress) {
      checkAppIsGrantedAccessWrapper();
    }
  }, [protectedDataAddress]);

  const resetStates = () => {
    setIsProtected(false);
    setHasJustRegistered(false);
    setAppIsGrantedAccess(false);
    setProtectedDataAddress('');
    setError(null);
  };

  const checkIsProtectedWrapper = async (_userAddress: Address) => {
    try {
      const protectedAddress = await checkIsProtected(_userAddress);
      if (protectedAddress) {
        setProtectedDataAddress(protectedAddress);
        setIsProtected(true);
      }
    } catch (err) {
      setError(`Failed to check protection status: ${(err as Error).message}`);
    }
  };

  const handleSubmitProtectionWrapper = async (email: string) => {
    try {
      const protectedAddress = await handleSubmitProtection(email);
      if (protectedAddress) {
        setProtectedDataAddress(protectedAddress);
        setIsProtected(true);
        setHasJustRegistered(true);
      }
    } catch (err) {
      setError(`Failed to submit protection: ${(err as Error).message}`);
    }
  };

  const checkAppIsGrantedAccessWrapper = async () => {
    try {
      const isGranted = await checkAppIsGrantedAccess(protectedDataAddress);
      setAppIsGrantedAccess(isGranted);
    } catch (err) {
      setError(`Failed to check app access: ${(err as Error).message}`);
    }
  };

  const handleSubscriptionChange = (isSubscribed: boolean) => {
    setAppIsGrantedAccess(isSubscribed);
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-20 px-4">
      <ExplanationCard />
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      {!isProtected && <EmailForm onSubmit={handleSubmitProtectionWrapper} />}
      {isProtected && hasJustRegistered &&
        <SuccessfulProtection
          protectedData={protectedDataAddress}
          onSubscriptionChange={handleSubscriptionChange} />
      }
      {isProtected && !hasJustRegistered &&
        <ProtectedDataBox
          protectedAddressData={protectedDataAddress}
          appIsGrantedAccess={appIsGrantedAccess}
          userAddress={userAddress}
          onSubscriptionChange={handleSubscriptionChange}
        />
      }
    </div>
  );
};

export default Page;
