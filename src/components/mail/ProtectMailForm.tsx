'use client'

import React, { useState, useEffect, ChangeEvent } from 'react';
import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import { useAccount } from "wagmi";

type Address = `0x${string}`;


const ProtectMailForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [protectedData, setProtectedData] = useState<Address | null>(null);
    const [protectedAddressDataList, setProtectedDataList] = useState<Address[]>([]);
    const [isProtected, setIsProtected] = useState(false);
    const [hasJustRegistered, setHasJustRegistered] = useState(false);

    const { address } = useAccount();
    const provider = window.ethereum;
    const dataProtector = new IExecDataProtector(provider);
    const dataProtectorCore = dataProtector.core;


    // ---------
    // Effects
    // ---------

    useEffect(() => {
        if (protectedData) {
            console.log('Protected data updated:', protectedData);
        }
    }, [protectedData]);

    useEffect(() => {
        if (address) {
            checkIsProtected(address);
        }
    }, [address]);


    // ---------
    // Functions
    // ---------

    // Check if the user's address is already protected and fetch all protected data
    const checkIsProtected = async (address: Address) => {
        const protectedDataList = await dataProtectorCore.getProtectedData({
            owner: address,
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


    // Submit the email to be protected
    const handleSubmit = async () => {

        try {
            const { address: protectedDataAddress } = await dataProtectorCore.protectData({
                data: { email }
            })

            setProtectedData(protectedDataAddress as Address);
            setIsProtected(true);
            setHasJustRegistered(true);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Handle email input change
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            {/* Explanation Card */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-3">Why Register Your Email?</h2>
                <p className="text-gray-600">
                    Registering your email allows us to keep you updated with the latest news,
                    offers, and important information. We do not save your email address. Viva webmail from iexec
                </p>
            </div>

            {/* Email Form */}
            {!isProtected && (
                <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Validate Email
                        </button>
                    </div>
                </form>
            )}

            {/* Once registered displays message + authorization button for using user mail by Ledgity*/}
            {isProtected && hasJustRegistered && (<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mt-4">
                <div className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-bold">Your data is protected</span>
                </div>
                <p className="mt-2">
                    Address of your protected data: <span className="font-mono">{protectedData}</span>
                </p>
            </div>)}

            {/* Protected Address Data List if already registered*/}
            {protectedAddressDataList.length > 0 && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg shadow-md mt-4">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold">Protected Address Data List</span>
                    </div>
                    <ul className="list-disc list-inside mt-2">
                        {protectedAddressDataList.map((address, index) => (
                            <li key={index} className="font-mono">{address}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProtectMailForm;