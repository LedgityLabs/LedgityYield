'use client'

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { checkIsProtected, checkAppIsGrantedAccess } from './utils/utils';

const MailTooltip = () => {
    // State management
    const [isVisible, setIsVisible] = useState(true);

    // Hooks
    const { address } = useAccount();
    const pathname = usePathname();

    // Effects
    useEffect(() => {
        if (pathname !== '/app/mail') {
            displayMailTooltip();
        } else {
            setIsVisible(false);
        }
    }, [pathname, address]);

    // Helper function to check and display the tooltip
    const displayMailTooltip = async () => {
        const protectedAddress = await checkIsProtected(address as string);
        const isGranted = await checkAppIsGrantedAccess(protectedAddress as string);

        if (isGranted) {
            setIsVisible(false);
        }
    };

    // Early return if tooltip should not be visible
    if (!isVisible) return null;

    // Render function
    return (
        <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md shadow-md flex items-center">
            <span>
                <Link href="/app/mail">
                    Web3mail with: {address ? `${address.slice(0, 6)}...` : 'Unknown'}
                </Link>
            </span>
            <button
                onClick={() => setIsVisible(false)}
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default MailTooltip;