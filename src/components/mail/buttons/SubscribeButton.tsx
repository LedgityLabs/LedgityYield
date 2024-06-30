'use client'

import { IExecDataProtector } from "@iexec/dataprotector";
import { FC, useState } from "react";
import { type Address } from "@iexec/web3mail";

// Hardcoded address of the Ledgity app - test address
const LedgityAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'.toLowerCase();

interface Props {
    protectedData: Address;
    onSuccessfulSubscription: () => void;
    onError: (message: string) => void;
}

const SubscribeButton: FC<Props> = ({ protectedData, onSuccessfulSubscription, onError }) => {
    const [isLoading, setIsLoading] = useState(false);

    const grantAccessSubmit = async () => {
        setIsLoading(true);
        const dataProtector = new IExecDataProtector(window.ethereum);
        const dataProtectorCore = dataProtector.core;

        try {
            await dataProtectorCore.grantAccess({
                protectedData: protectedData,
                authorizedApp: "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2",
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
