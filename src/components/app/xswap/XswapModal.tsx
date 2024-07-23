import { useAccount, useWalletClient } from 'wagmi';
import { openTransactionModal, renderTxStatus, Transactions } from "@xswap-link/sdk";
import { useState, useRef, useEffect } from 'react';
import { waitForTransactionReceipt } from 'viem/actions';
import { dstChain, dstToken } from '@/constants/xswap';

export const XPayButton = () => {
  const { address, chain, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleOpenXPay = async () => {
    setIsLoading(true);
    
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const integratorId = process.env.NEXT_PUBLIC_INTEGRATOR_ID;
    if (!integratorId) {
      throw new Error("INTEGRATOR_ID is not set in the .env file");
    }

    if (!address || !chain || !connector || !walletClient) {
      throw new Error("Wallet not connected");
    }

    try {
      const result = await openTransactionModal({
        integratorId,
        dstChain,
        dstToken,
        returnTransactions: true,
      });

      if (!result) {
        throw new Error("No transactions returned from openTransactionModal");
      }

      const transactions: Transactions = result;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);

      if (transactions.approve && transactions.approve.to && transactions.approve.data) {
        const approveTxHash = await walletClient.sendTransaction({
          to: transactions.approve.to as `0x${string}`,
          data: transactions.approve.data as `0x${string}`,
          value: BigInt(transactions.approve.value || '0'),
        });
        await waitForTransactionReceipt(walletClient, { hash: approveTxHash });
      }

      if (transactions.swap && transactions.swap.to && transactions.swap.data) {
        const swapTxHash = await walletClient.sendTransaction({
          to: transactions.swap.to as `0x${string}`,
          data: transactions.swap.data as `0x${string}`,
          value: BigInt(transactions.swap.value || '0'),
        });
        await waitForTransactionReceipt(walletClient, { hash: swapTxHash });
        await renderTxStatus(chain.id.toString(), swapTxHash);
      }
    } catch (error) {
      console.error("Error in openXPay:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleOpenXPay} 
      disabled={!address || isLoading}
      className={`
        text-gray-500
        py-2 px-4
        transition-all duration-300 ease-in-out
        ${isHovered ? 'bg-gray-100 rounded-lg' : ''}
        ${(!address || isLoading) ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100 hover:rounded-lg'}
        flex items-center justify-center
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        'Bridge'
      )}
    </button>
  );
};