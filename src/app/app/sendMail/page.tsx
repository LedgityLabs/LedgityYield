'use client'
import React from 'react';
import { useAccount } from 'wagmi';
import SendMailForm from '@/components/sendMail/SendMailForm';

const LEDGITY_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export default function EmailPage() {
    const { address } = useAccount();

    const isLedgityAddress = address?.toLowerCase() === LEDGITY_ADDRESS.toLowerCase();

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