'use client'

import { FC, useState } from "react";
import { IExecDataProtector } from "@iexec/dataprotector";
import { type Address } from "@iexec/web3mail";
import { LedgityAddress, AuthorizedAppAddress } from "@/utils/address";

// Define props interface for SubscribeButton component
interface Props {
    protectedData: Address;
    onSuccessfulSubscription: () => void;
    onError: (message: string) => void;
}

const SubscribeButton: FC<Props> = ({ 
    protectedData, 
    onSuccessfulSubscription, 
    onError 
}) => {
    // State management
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Helper function to grant access
     */
    const grantAccessSubmit = async () => {
        setIsLoading(true);
        const dataProtector = new IExecDataProtector(window.ethereum);
        const dataProtectorCore = dataProtector.core;

        try {
            // Grant access to the protected data
            await dataProtectorCore.grantAccess({
                protectedData: protectedData,
                authorizedApp: AuthorizedAppAddress,
                authorizedUser: LedgityAddress,
                numberOfAccess: 1000
            });
            onSuccessfulSubscription();
        } catch (error) {
            onError(`Error granting access: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Render function for the SubscribeButton component
     */
    return (
        <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={grantAccessSubmit}
            disabled={isLoading}
        >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
    );
}

export default SubscribeButton;