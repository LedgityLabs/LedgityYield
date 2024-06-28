'use client'

import React from 'react';
import Link from 'next/link';
import SubscribeButton from './buttons/SubscribeButton';
import CancelSubscriptionButton from './buttons/CancelSubscriptionButton';
import { type Address } from "@iexec/web3mail";

interface ProtectedDataListProps {
    protectedAddressDataList: Address[];
    appIsGrantedAccess: boolean;
}

const ProtectedDataList: React.FC<ProtectedDataListProps> = ({ protectedAddressDataList, appIsGrantedAccess }) => {
    console.log(appIsGrantedAccess)
    return (<div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg shadow-md mt-4">
        <div className="flex items-center">
            <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">Address of protected data:</span>
        </div>
        <ul className="list-disc list-inside mt-2 mb-4">
            {protectedAddressDataList.map((address, index) => (
                <li key={index}>
                    <Link href={`https://blockscout-bellecour.iex.ec/address/${address}`} className="font-mono underline">
                        {address}
                    </Link>
                </li>
            ))}
        </ul>
        <p> Subscription to our emails:</p>
        <div className="flex justify-between px-8 mt-4">
            {!appIsGrantedAccess && (<SubscribeButton protectedData={protectedAddressDataList[0]} />)}
            {appIsGrantedAccess && (<CancelSubscriptionButton protectedData={protectedAddressDataList[0]} />)}
        </div>
    </div>)
};

export default ProtectedDataList;