"use client";

import { type NextPage } from "next";
import React, { useEffect, useState } from 'react';
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { type Address } from "@iexec/web3mail";
import { checkIsProtected, handleSubmitProtection, checkAppIsGrantedAccess } from "@/components/mail/utils/utils";

// Component imports
import ExplanationCard from "@/components/mail/ExplanationCard";
import EmailForm from "@/components/mail/EmailForm";
import SuccessfulProtection from "@/components/mail/SuccessfulProtection"
import ProtectedDataBox from "@/components/mail/ProtectedDataBox";

const Page: NextPage = () => {
  // Blockchain related hooks and constants
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();
  const userAddress = address as string;
  const desiredChainId = 134; // For iExec sidechain.

  // State management
  const [protectedDataAddress, setProtectedDataAddress] = useState<string>('');
  const [isProtected, setIsProtected] = useState(false);
  const [hasJustRegistered, setHasJustRegistered] = useState(false);
  const [appIsGrantedAccess, setAppIsGrantedAccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect hooks for managing side effects
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

  // Helper functions
  // Resets all state variables to their initial values
  const resetStates = () => {
    setIsProtected(false);
    setHasJustRegistered(false);
    setAppIsGrantedAccess(false);
    setProtectedDataAddress('');
    setError(null);
  };

  // Checks if the user's address is protected
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

  // Handles the submission of email protection
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

  // Checks if the app is granted access to the protected data
  const checkAppIsGrantedAccessWrapper = async () => {
    try {
      const isGranted = await checkAppIsGrantedAccess(protectedDataAddress);
      setAppIsGrantedAccess(isGranted);
    } catch (err) {
      setError(`Failed to check app access: ${(err as Error).message}`);
    }
  };

  // Updates the app's access status based on subscription changes
  const handleSubscriptionChange = (isSubscribed: boolean) => {
    setAppIsGrantedAccess(isSubscribed);
  };

  // Render function
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