"use client";
import { type NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useSwitchChain, useChainId, useAccount } from "wagmi";
import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import ExplanationCard from "@/components/mail/ExplanationCard";
import EmailForm from "@/components/mail/EmailForm";
import SuccessfulRegister from "@/components/mail/SuccessfulRegister";
import ProtectedDataList from "@/components/mail/ProtectedDataList";
import { Address } from "@/utils/types";
import { type GrantedAccessResponse } from "@iexec/dataprotector";

//Hardcoded address of the Ledgity app - test address
const LedgityAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const Page: NextPage = () => {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();
  const desiredChainId = 134; // For iExec sidechain.

  const [protectedData, setProtectedData] = useState<Address>("0x0");
  const [protectedAddressDataList, setProtectedDataList] = useState<Address[]>([]);
  const [isProtected, setIsProtected] = useState(false);
  const [hasJustRegistered, setHasJustRegistered] = useState(false);
  const [appIsGrantedAccess, setAppIsGrantedAccess] = useState(false);

  const provider = window.ethereum;
  const dataProtector = new IExecDataProtector(provider);
  const dataProtectorCore = dataProtector.core;

  useEffect(() => {
    if (currentChainId !== desiredChainId) {
      switchChain({ chainId: desiredChainId });
    }
  }, [currentChainId, switchChain, desiredChainId]);

  useEffect(() => {
    if (address) {
      checkIsProtected(address);
    }
  }, [address]);

  useEffect(() => {
    checkAppIsGrantedAccess();
  });

  const checkIsProtected = async (address: Address) => {
    const protectedDataList = await dataProtectorCore.getProtectedData({
      owner: address,
      requiredSchema: {
        email: "string",
      },
    });
    const protectedAddressDataList = protectedDataList.map(
      (protectedData: ProtectedData) => protectedData.address as Address,
    );
    if (protectedDataList.length > 0) {
      setProtectedDataList(protectedAddressDataList);
      setIsProtected(true);
    }
  };

  const handleSubmitProtection = async (email: string) => {
    try {
      const { address: protectedDataAddress } = await dataProtectorCore.protectData({
        data: { email },
      });

      const response = await fetch(`/api/mailing/saveProtectedDataAddress`, {
        method: "POST",
        body: JSON.stringify({ protectedDataAddress }),
        cache: "no-cache",
      });
      if (response.ok) {
        setProtectedData(protectedDataAddress as Address);
        setIsProtected(true);
        setHasJustRegistered(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkAppIsGrantedAccess = async () => {
    // TODO(@Turof): Je ne sais pas exactement ou tu veux mettre ton check
    // mais je te laisse un exemple en dessous, à modifier en fonction de tes besoins

    console.log(" check granted access1: " + protectedAddressDataList[0]);
    const response = await fetch(`/api/mailing/retrieveProtectedDataAddress`, {
      cache: "no-cache",
    });
    if (response.ok) {
      const data = await response.json();
      if (!data?.protectedDataAddress) return;

      const { grantedAccess: appIsGrantedAccess } = await dataProtectorCore.getGrantedAccess({
        protectedData: data!.protectedDataAddress,
        authorizedUser: address,
      });
      console.log(appIsGrantedAccess);
      if (appIsGrantedAccess.length > 0) {
        setAppIsGrantedAccess(true);
      }
    }

    /*const { grantedAccess: appIsGrantedAccess } = await dataProtectorCore.getGrantedAccess({
      protectedData: protectedAddressDataList[0],
      authorizedUser: LedgityAddress,
    });
    console.log(appIsGrantedAccess);
    if (appIsGrantedAccess.length > 0) {
      setAppIsGrantedAccess(true);
    }*/
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <ExplanationCard />
      {!isProtected && <EmailForm onSubmit={handleSubmitProtection} />}
      {isProtected && hasJustRegistered && <SuccessfulRegister protectedData={protectedData} />}
      {protectedAddressDataList.length > 0 && (
        <ProtectedDataList
          protectedAddressDataList={protectedAddressDataList}
          appIsGrantedAccess={appIsGrantedAccess}
        />
      )}
    </div>
  );
};

export default Page;
