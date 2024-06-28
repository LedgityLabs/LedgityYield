'use client'
import { type NextPage } from "next";
import React, { useEffect, useState } from 'react';
import { useSwitchChain, useChainId, useAccount } from 'wagmi'
import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import { IExecWeb3mail } from "@iexec/web3mail";
import ExplanationCard from "@/components/mail/ExplanationCard";
import EmailForm from "@/components/mail/EmailForm";
import SuccessfulRegister from "@/components/mail/SuccessfulRegister";
import ProtectedDataList from "@/components/mail/ProtectedDataList";
import { type Address } from "@iexec/web3mail";

//Hardcoded address of the Ledgity app - test address
const LedgityAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const Page: NextPage = () => {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { address } = useAccount();
  const userAddress = address as Address;
  const desiredChainId = 134; // For iExec sidechain.

  const web3Provider = window.ethereum;
  const web3mail = new IExecWeb3mail(web3Provider);
  const dataProtector = new IExecDataProtector(web3Provider);
  const dataProtectorCore = dataProtector.core;

  const [protectedDataAddress, setProtectedDataAddress] = useState<string>('');
  const [protectedAddressDataList, setProtectedDataList] = useState<string[]>([]);
  const [isProtected, setIsProtected] = useState(false);
  const [hasJustRegistered, setHasJustRegistered] = useState(false);
  const [appIsGrantedAccess, setAppIsGrantedAccess] = useState(false);


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

  const checkIsProtected = async (_userAddress: Address) => {
    const protectedDataList = await dataProtectorCore.getProtectedData({
      owner: _userAddress,
      requiredSchema: {
        email: 'string',
      },
    });
    const protectedAddressDataList = protectedDataList.map((protectedData: ProtectedData) => protectedData.address as Address);
    if (protectedDataList.length > 0) {
      setProtectedDataList(protectedAddressDataList);
      setIsProtected(true);
    }
  }

  const handleSubmitProtection = async (email: string) => {
    try {
      const { address: protectedDataAddress } = await dataProtectorCore.protectData({
        data: { email }
      })

      setProtectedDataAddress(protectedDataAddress as Address);
      setIsProtected(true);
      setHasJustRegistered(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const checkAppIsGrantedAccess = async () => {

    // console.log(userAddress)
    const contactList = await web3mail.fetchUserContacts({ userAddress });
    // console.log(contactList)

    const grantedAccess = contactList.some((contact) => contact.owner === LedgityAddress);

    if (grantedAccess) {
      setAppIsGrantedAccess(true);
    }

  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <ExplanationCard />
      {!isProtected && <EmailForm onSubmit={handleSubmitProtection} />}
      {isProtected && hasJustRegistered && <SuccessfulRegister protectedData={protectedDataAddress} />}
      {protectedAddressDataList.length > 0 && <ProtectedDataList protectedAddressDataList={protectedAddressDataList} appIsGrantedAccess={appIsGrantedAccess} />}
      <p> app is: {String(appIsGrantedAccess)}</p>
    </div>
  );
};

export default Page;