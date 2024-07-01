import React from 'react';
import SendMailForm from '@/components/sendMail/SendMailForm';
import { useAccount } from 'wagmi'

export default function EmailPage() {
    const { address } = useAccount();
    const LedgityAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h1>
            {address && address.toLowerCase() === LedgityAddress ? (
                <SendMailForm />
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Access Denied!</strong>
                    <span className="block sm:inline"> Only Ledgity address is allowed.</span>
                </div>
            )}
        </div>
    );
}