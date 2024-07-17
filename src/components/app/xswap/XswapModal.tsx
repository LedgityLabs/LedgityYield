import { openTransactionModal } from "@xswap-link/sdk";

export const openXPay = async () => {
    const integratorId = process.env.NEXT_PUBLIC_INTEGRATOR_ID;
    if (!integratorId) {
        throw new Error("INTEGRATOR_ID is not set in the .env file");
    }

    await openTransactionModal({
        integratorId,
        dstChain: "42161",
        dstToken: "0x999FAF0AF2fF109938eeFE6A7BF91CA56f0D07e1",
    });
};

