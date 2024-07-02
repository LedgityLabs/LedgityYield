'use client'

import { FC, useState } from "react";
import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import { type Address } from "@iexec/web3mail";
import { LedgityAddress } from "@/utils/address";

// Define props interface for CancelSubscriptionButton component
interface Props {
    protectedData: Address;
    userAddress: Address;
    onSuccessfulUnsubscription: () => void;
    onError: (message: string) => void;
}


const CancelSubscriptionButton: FC<Props> = ({ 
    protectedData, 
    userAddress, 
    onSuccessfulUnsubscription, 
    onError 
}) => {
    // State management
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to cancel subscription
    const cancelSubscription = async () => {
        setIsLoading(true);
        try {
            const dataProtector = new IExecDataProtector(window.ethereum);
            const dataProtectorCore = dataProtector.core;

            // Fetch protected data for the user
            const listProtectedData = await dataProtectorCore.getProtectedData({
                owner: userAddress,
                requiredSchema: {
                    email: 'string',
                },
            });

            if (listProtectedData.length === 0) {
                throw new Error("No protected data found for the user");
            }

            const protectedAddressDataList = listProtectedData.map((protectedData: ProtectedData) => protectedData.address as Address);

            // Get granted access for the protected data
            const { grantedAccess } = await dataProtectorCore.getGrantedAccess({
                protectedData: protectedAddressDataList[0],
                authorizedUser: LedgityAddress,
            });

            // Filter for the specific protected data
            const protectedDataArray = grantedAccess.filter((oneAccess) => oneAccess.dataset.toLowerCase() === protectedData);

            if (protectedDataArray.length === 0) {
                throw new Error("No matching granted access found for revocation");
            }

            // Revoke access
            await dataProtectorCore.revokeOneAccess(protectedDataArray[0]);
            onSuccessfulUnsubscription();
        } catch (error) {
            onError(`Error during subscription cancellation: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Render function
    return (
        <button
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={cancelSubscription}
            disabled={isLoading}
        >
            {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
        </button>
    );
}

export default CancelSubscriptionButton;