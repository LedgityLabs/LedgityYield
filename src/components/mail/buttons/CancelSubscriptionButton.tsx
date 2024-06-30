'use client'

import { IExecDataProtector, type ProtectedData, type GrantedAccess } from "@iexec/dataprotector";
import { FC, useState } from "react";
import { type Address } from "@iexec/web3mail";

interface Props {
    protectedData: Address;
    userAddress: Address;
    onSuccessfulUnsubscription: () => void;
    onError: (message: string) => void;
}

const LedgityAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase();

const CancelSubscriptionButton: FC<Props> = ({ protectedData, userAddress, onSuccessfulUnsubscription, onError }) => {
    const [isLoading, setIsLoading] = useState(false);

    const cancelSubscription = async () => {
        setIsLoading(true);
        try {
            const dataProtector = new IExecDataProtector(window.ethereum);
            const dataProtectorCore = dataProtector.core;

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

            const { grantedAccess } = await dataProtectorCore.getGrantedAccess({
                protectedData: protectedAddressDataList[0],
                authorizedUser: LedgityAddress,
            });

            const protectedDataArray = grantedAccess.filter((oneAccess) => oneAccess.dataset.toLowerCase() === protectedData);

            if (protectedDataArray.length === 0) {
                throw new Error("No matching granted access found for revocation");
            }

            await dataProtectorCore.revokeOneAccess(protectedDataArray[0]);
            onSuccessfulUnsubscription();
        } catch (error) {
            onError(`Error during subscription cancellation: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

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