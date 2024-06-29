'use client'

import { IExecDataProtector } from "@iexec/dataprotector";
import { FC } from "react";
import { type Address } from "@iexec/web3mail";

//Hardcoded address of the Ledgity app - test address
const LedgityAddress = ('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').toLowerCase();


interface Props {
    protectedData: Address;
}

const SubscribeButton: FC<Props> = ({ protectedData }) => {

    const grantAccessSubmit = async () => {
        const dataProtector = new IExecDataProtector(window.ethereum);
        const dataProtectorCore = dataProtector.core;

        await dataProtectorCore.grantAccess({
            protectedData: protectedData,
            authorizedApp: "0x781482C39CcE25546583EaC4957Fb7Bf04C277D2",
            authorizedUser: LedgityAddress,
            numberOfAccess: 1000
        });
    }

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={grantAccessSubmit}>
            Subscribe
        </button>
    );
}

export default SubscribeButton;
