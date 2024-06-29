'use client'

import React from 'react';
import SubscribeButton from './buttons/SubscribeButton';
import { type Address } from "@iexec/web3mail";
import Link from 'next/link';

interface SuccessfulProtectionProps {
    protectedData: Address;
}

const SuccessfulProtection: React.FC<SuccessfulProtectionProps> = ({ protectedData }) => (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mt-4">
        <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold">Your data is protected</span>
        </div>
        <p className="mt-2">
            Address of your protected data:
        </p>
        <Link href={`https://blockscout-bellecour.iex.ec/address/${protectedData}`} className="font-mono underline">
            {protectedData}
        </Link>
        <div className="flex justify-center items-center mt-4">
            <SubscribeButton protectedData={protectedData} />
        </div>
    </div>
);

export default SuccessfulProtection;