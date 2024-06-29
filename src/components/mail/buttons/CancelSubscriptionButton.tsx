'use client'

import { IExecDataProtector, type ProtectedData, type GrantedAccess } from "@iexec/dataprotector";
import { FC } from "react";
import { type Address } from "@iexec/web3mail";
import { useAccount } from "wagmi";

interface Props {
    protectedData: Address;
    userAddress: Address;
}

const LedgityAddress = ('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').toLowerCase();

const CancelSubscriptionButton: FC<Props> = ({ protectedData, userAddress }) => {
    const cancelSubscription = async () => {

        const dataProtector = new IExecDataProtector(window.ethereum);
        const dataProtectorCore = dataProtector.core;

        console.log(userAddress);

        const listProtectedData = await dataProtectorCore.getProtectedData({
            owner: userAddress,
            requiredSchema: {
                email: 'string',
            },
        });

        const protectedAddressDataList = listProtectedData.map((protectedData: ProtectedData) => protectedData.address as Address);

        const { grantedAccess } = await dataProtectorCore.getGrantedAccess({
            protectedData: protectedAddressDataList[0],
            authorizedUser: LedgityAddress,
        })

        const protectedDataArray = grantedAccess.filter((oneAccess) => oneAccess.dataset.toLowerCase() === protectedData);

        const revokeAccess = await dataProtectorCore.revokeOneAccess(protectedDataArray[0]);
        console.log(revokeAccess);
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