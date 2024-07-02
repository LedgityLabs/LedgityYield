// utils.tsx
import { IExecDataProtector, type ProtectedData } from "@iexec/dataprotector";
import { type Address } from "@iexec/web3mail";

export const LedgityAddress = ('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').toLowerCase();


const dataProtector = new IExecDataProtector(window.ethereum);
const dataProtectorCore = dataProtector.core;

export const checkIsProtected = async (_userAddress: string) => {
    const protectedDataList = await dataProtectorCore.getProtectedData({
        owner: _userAddress,
        requiredSchema: {
            email: 'string',
        },
    });
    const protectedAddressDataList = protectedDataList.map((protectedData: ProtectedData) => protectedData.address);
    return protectedDataList.length > 0 ? protectedAddressDataList[0] : null;
};

export const handleSubmitProtection = async (email: string) => {
    try {
        const { address: protectedDataAddress } = await dataProtectorCore.protectData({
            data: { email }
        });
        return protectedDataAddress as Address;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const checkAppIsGrantedAccess = async (protectedDataAddress: string) => {
    if (!protectedDataAddress || protectedDataAddress === '') {
        console.log("No protected data address available");
        return false;
    }

    try {
        const { grantedAccess: isGrantedAccess } = await dataProtectorCore.getGrantedAccess({
            protectedData: protectedDataAddress,
            authorizedUser: LedgityAddress,
        });

        const LedgityIsGranted = isGrantedAccess.filter((oneAccess: any) => oneAccess.requesterrestrict.toLowerCase() === LedgityAddress);

        return LedgityIsGranted.length > 0;
    } catch (error) {
        console.error("Error checking app access:", error);
        return false;
    }
};