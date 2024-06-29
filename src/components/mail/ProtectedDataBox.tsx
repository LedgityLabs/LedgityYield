'use client'

import React from 'react';
import Link from 'next/link';
import SubscribeButton from './buttons/SubscribeButton';
import CancelSubscriptionButton from './buttons/CancelSubscriptionButton';
import { type Address } from "@iexec/web3mail";

interface ProtectedDataListProps {
    protectedAddressData: Address;
    appIsGrantedAccess: boolean;
    userAddress: Address;
}

const ProtectedDataBox: React.FC<ProtectedDataListProps> = ({ protectedAddressData, appIsGrantedAccess, userAddress }) => {

    return (<div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg shadow-md mt-4">
        <div className="flex items-center">
            <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">Address of protected data:</span>
        </div>

        <ul className="list-disc list-inside mt-2 mb-4">
            <Link href={`https://blockscout-bellecour.iex.ec/address/${protectedAddressData}`} className="font-mono underline">
                {protectedAddressData}
            </Link>
        </ul>
        <div className="flex justify-center items-center mt-4">
            <p className="flex items-center">
                You have:
                {!appIsGrantedAccess && (
                    <span className="ml-2 flex items-center">
                        not subscribed
                        <svg className="h-5 w-5 text-red-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                )}
                {appIsGrantedAccess && (
                    <span className="ml-2 flex items-center">
                        already subscribed
                        <svg className="h-5 w-5 text-green-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </span>
                )}
            </p>
        </div>
        <div className="flex justify-center mt-8 mb-2">
            {!appIsGrantedAccess && (<SubscribeButton protectedData={protectedAddressData} />)}
            {appIsGrantedAccess && (<CancelSubscriptionButton protectedData={protectedAddressData} userAddress={userAddress} />)}
        </div>
    </div>)
};

export default ProtectedDataBox;