'use client'
import React from 'react';
import { useAccount } from 'wagmi';
import SendMailForm from '@/components/sendMail/SendMailForm';
import { LedgityAddress } from '@/utils/address';

export default function EmailPage() {
    const { address } = useAccount();

    const isLedgityAddress = address?.toLowerCase() === LedgityAddress;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Sending secure emails with web3mail</h1>

            {isLedgityAddress ? (
                <SendMailForm />
            ) : (
                <div className="border-2 border-red-500 bg-red-100 text-red-700 p-4 rounded-md text-center">
                    Only for Ledgity
                </div>
            )}
        </div>
    );
}