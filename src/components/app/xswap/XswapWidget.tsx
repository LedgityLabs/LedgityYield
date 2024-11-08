import { dstChain, dstToken } from '@/constants/xswap';
import { TxWidget } from '@xswap-link/sdk';

export const XSwapWidget = () => {
    return(
        <TxWidget
            integratorId={process.env.NEXT_PUBLIC_INTEGRATOR_ID || ""}
            dstChain={dstChain}
            dstToken={dstToken}
            lightTheme={true}
            defaultWalletPicker={true}
        />
    )
}