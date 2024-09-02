import React, { useState, useEffect, useCallback } from 'react';
import { Coins, Check, X, AlertTriangle } from 'lucide-react';
import { formatEther } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import StatCard from './StatCard';
import EpochsOverview from './EpochsOverview';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useEthVault } from './useEthVault';
import { useNotify } from '@/hooks/useNotify';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui';
import Link from 'next/link';

const AppInvestEthVault: React.FC = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const {
    currentEpoch,
    epochs,
    isError,
    isLoading,
    claimableRewards,
    hasClaimableRewards,
    invested,
    hasInvestment,
    calculatedRewards,
    handleDeposit,
    handleWithdraw,
    handleClaimRewards,
    subgraphData,
    totalRewardsClaimed,
    investmentPerEpoch,
    subgraphError,
    refetchSubgraphData,
  } = useEthVault();

  const notify = useNotify();

  const onClaimRewards = useCallback(async () => {
    if (!hasClaimableRewards) {
      notify.error('No Rewards Available', 'You don\'t have any rewards to claim.');
      return;
    }
    try {
      const loadingToast = notify.loading('Claiming Rewards', 'Please wait while we process your claim...');
      await handleClaimRewards();
      notify.dismiss(loadingToast.id);
      notify.success('Rewards Claimed', 'Your rewards have been claimed successfully!');
    } catch (error) {
      console.error('Error claiming rewards:', error);
      notify.error('Claim Failed', 'An error occurred while claiming rewards. Please try again.');
    }
  }, [hasClaimableRewards, handleClaimRewards, notify]);

  const onDeposit = useCallback(async (amount: string) => {
    try {
      const loadingToast = notify.loading('Processing Deposit', 'Please wait while we process your deposit...');
      await handleDeposit(amount);
      notify.dismiss(loadingToast.id);
      notify.success('Deposit Successful', `You have successfully deposited ${amount} ETH.`);
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error('Error during deposit:', error);
      notify.error('Deposit Failed', 'An error occurred during the deposit. Please check your wallet and try again.');
    }
  }, [handleDeposit, notify]);

  const onWithdraw = useCallback(async (amount: string) => {
    try {
      const loadingToast = notify.loading('Processing Withdrawal', 'Please wait while we process your withdrawal...');
      await handleWithdraw(amount);
      notify.dismiss(loadingToast.id);
      notify.success('Withdrawal Successful', `You have successfully withdrawn ${amount} ETH.`);
      setIsWithdrawModalOpen(false);
    } catch (error) {
      console.error('Error during withdrawal:', error);
      notify.error('Withdrawal Failed', 'An error occurred during the withdrawal. Please check your wallet and try again.');
    }
  }, [handleWithdraw, notify]);

  useEffect(() => {
    refetchSubgraphData();
  }, [refetchSubgraphData]);

  useEffect(() => {
    if (subgraphError) {
      notify.error('Data Fetch Error', subgraphError);
    }
  }, [subgraphError, notify]);

  if (isLoading && !subgraphData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="text-blue-500 text-4xl" />
      </div>
    );
  }

  const formatNumber = (value: string | number) => {
    return parseFloat(value.toString()).toFixed(2);
  };

  return (
    <ErrorBoundary>
      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        className="w-full flex flex-col gap-10 relative overflow-hidden"
      >
        <span className="absolute px-2 py-1.5 pt-1 text-sm leading-none rounded-bl-lg rounded-br-lg text-bg top-0 left-5 bg-orange-700 font-medium drop-shadow-md">
          Beta
        </span>
        {subgraphError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <div className="flex">
              <div className="py-1"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-4" /></div>
              <div>
                <p className="font-bold">Warning</p>
                <p>{subgraphError}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-gray-200 flex sm:gap-10 gap-6 justify-between flex-wrap-reverse sm:p-10 p-5 pt-8 pb-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-gray-600">ETH Vault</h3>
            <div className="text-[1.92rem] text-gray-800 font-heading font-bold flex items-center">
              <Coins size={32} className="mr-2" />
              ETH Vault
            </div>
          </div>
          <div className="flex sm:gap-14 gap-10 flex-wrap">
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-gray-600 whitespace-nowrap">Current APR</h3>
              <span className="text-[1.92rem] text-gray-800 font-heading font-bold">{epochs[0]?.apr || "0%"}</span>
            </div>
            <div className="flex flex-col md:items-end items-start gap-2">
              <h3 className="font-bold text-lg text-gray-600 whitespace-nowrap">Your Investment</h3>
              <span className="text-[1.92rem] text-gray-800 font-heading font-bold">{formatNumber(invested)}</span>
            </div>
          </div>
        </div>
        <p className="sm:px-10 px-5 font-medium text-lg lg:w-[60%] md:w-[65%] sm:w-[80%] w-full text-fg/80 -mt-3">
          Invest ETH and get exposed to real, stable and high-efficiency yield backed by RWA (Real World Assets).
          <br />
          <Link
            href="https://docs.ledgity.finance/"
            target="_blank"
            className="text-fg/95 font-semibold underline underline-offset-2 decoration-fg/20 hover:text-slate-900 transition-colors"
          >
            Read the{" "}
            <span className="whitespace-nowrap">
              documentation <i className="ri-arrow-right-line" />
            </span>
          </Link>
        </p>

        <div className="sm:px-10 px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard title="Current Epoch TVL" value={formatNumber(formatEther(currentEpoch.totalValueLocked))} />
            <StatCard title="Your current Investment" value={formatNumber(invested)} />
            <StatCard title="Your available Rewards" value={formatNumber(calculatedRewards)} />
            <StatCard title="Total Rewards Claimed" value={formatNumber(totalRewardsClaimed)} />
          </div>

          <div className="bg-gray-200 p-4 rounded-lg mb-6 flex flex-col md:flex-row items-center">
            <div className="flex flex-col md:flex-row md:space-x-16 flex-grow mb-4 md:mb-0">
              <div className="font-semibold text-gray-700">APR</div>
              <div className="font-semibold text-gray-700">TVL</div>
              <div className="font-semibold text-gray-700">Invested</div>
            </div>
            <div className="font-semibold text-gray-700">Actions</div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="flex flex-col md:flex-row md:space-x-16 flex-grow mb-4 md:mb-0">
                <div>{epochs[0]?.apr || "0%"}</div>
                <div>{formatNumber(formatEther(currentEpoch.totalValueLocked))}</div>
                <div>{formatNumber(invested)}</div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDepositModalOpen(true)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={currentEpoch.status !== 'Open'}
                >
                  Deposit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  disabled={currentEpoch.status !== 'Open' || !hasInvestment}
                >
                  Withdraw
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClaimRewards}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  disabled={!hasClaimableRewards}
                >
                  Claim
                </motion.button>
              </div>
            </div>

            <div className="mt-6">
              <EpochsOverview
                epochs={epochs}
                isClaimable={claimableRewards !== undefined ? claimableRewards : false}
                investmentPerEpoch={investmentPerEpoch}
              />
            </div>
          </div>
        </div>

        <p className="text-center pb-5 -mt-5 opacity-60 font-medium text-[0.85rem] px-5">
          By depositing you agree to our{" "}
          <Link
            href="/legal/terms-and-conditions"
            className="text-indigo-700 underline underline-offset-2 decoration-primary/40"
          >
            Terms & Conditions.
          </Link>
        </p>

        <AnimatePresence>
          {isDepositModalOpen && (
            <DepositModal
              isOpen={isDepositModalOpen}
              onClose={() => setIsDepositModalOpen(false)}
              onDeposit={onDeposit}
            />
          )}
          {isWithdrawModalOpen && (
            <WithdrawModal
              isOpen={isWithdrawModalOpen}
              onClose={() => setIsWithdrawModalOpen(false)}
              onWithdraw={onWithdraw}
              maxAmount={invested}
            />
          )}
        </AnimatePresence>
      </Card>
    </ErrorBoundary>
  );
};

export default React.memo(AppInvestEthVault);