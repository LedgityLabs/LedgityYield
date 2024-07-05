'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { type Address } from "@iexec/web3mail";
import SubscribeButton from './buttons/SubscribeButton';

// Define props interface for SuccessfulProtection component
interface SuccessfulProtectionProps {
    protectedData: Address;
    onSubscriptionChange: (isSubscribed: boolean) => void;
}

const SuccessfulProtection: React.FC<SuccessfulProtectionProps> = ({
    protectedData,
    onSubscriptionChange
}) => {
    // State management
    const [error, setError] = useState<string | null>(null);

    // Event handlers
    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const handleSubscriptionChange = (isSubscribed: boolean) => {
        setError(null);
        onSubscriptionChange(isSubscribed);
    };

    // Render function
    return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mt-4">
            {/* Success Message Section */}
            <div className="flex items-center">
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold">Your data is protected</span>
            </div>

            {/* Protected Data Address Section */}
            <p className="mt-2">
                Address of your protected data:
            </p>
            <ul className="list-disc list-inside mt-2 mb-4 text-center">
                <Link href={`https://blockscout-bellecour.iex.ec/address/${protectedData}`} className="font-mono underline">
                    {protectedData.slice(0, 12)} [...] {protectedData.slice(-10)}
                </Link>
            </ul>


            {/* Error Display Section */}
            {error && (
                <div className="text-red-500 text-center mt-2">
                    {error}
                </div>
            )}

            {/* Subscribe Button Section */}
            <div className="flex justify-center items-center mt-4">
                <SubscribeButton
                    protectedData={protectedData}
                    onSuccessfulSubscription={() => handleSubscriptionChange(true)}
                    onError={handleError}
                />
            </div>
        </div>
    );
};

export default SuccessfulProtection;