'use client'

import { IExecDataProtector } from "@iexec/dataprotector";
import { FC } from "react";
import { type Address } from "@iexec/web3mail";

interface Props {
    protectedData: Address;
}

const LedgityAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const CancelSubscriptionButton: FC<Props> = ({ protectedData }) => {
    const cancelSubscription = async () => {
        try {
            const dataProtector = new IExecDataProtector(window.ethereum);
            const dataProtectorCore = dataProtector.core;

            const revokeAllAccessResult = await dataProtectorCore.revokeAllAccess({
                protectedData: protectedData,
                authorizedApp: LedgityAddress,
                authorizedUser: LedgityAddress,
            });

            console.log('Access revoked:', revokeAllAccessResult);
            // You might want to add some user feedback here, like a success message
        } catch (error) {
            console.error('Error revoking access:', error);
            // You might want to add some user feedback here, like an error message
        }
    }

    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={cancelSubscription}
        >
            Cancel Subscription
        </button>
    );
}

export default CancelSubscriptionButton;