import React, { useState, useCallback, useEffect } from 'react';
import { formatEther } from 'viem';
import { AnimatePresence } from 'framer-motion';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useEthVault } from '@/hooks/useEthVault';
import { useNotify } from '@/hooks/useNotify';
import { Spinner } from '@/components/ui/Spinner';
import { Card, Button } from '@/components/ui';
import Link from 'next/link';
import EpochsOverview from './EpochsOverview';

const AppInvestEthVault: React.FC = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const {
    currentEpoch,
    epochs,
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
        <div className="flex sm:gap-10 gap-6 justify-between flex-wrap-reverse sm:p-10 p-5 pt-8 pb-0">
          <div className="flex flex-col gap-2">
            <div className="text-[1.92rem] text-fg font-heading font-bold flex items-center">
              <img
                src="/assets/logo/eth.png"
                alt="ETH Logo"
                className="w-16 h-16 -ml-5 sm:-ml-10 mr-4" // Increased size, negative margin to stick to left, adjusted right margin
              />
              ETH Vault
            </div>
          </div>
          <div className="flex sm:gap-6 gap-4 flex-wrap">
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-bold text-sm text-fg/50 whitespace-nowrap">Claimable</h3>
              <span className="text-lg text-fg/90 font-heading font-bold">{formatNumber(calculatedRewards)}</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-bold text-sm text-fg/50 whitespace-nowrap">Claimed</h3>
              <span className="text-lg text-fg/90 font-heading font-bold">{formatNumber(totalRewardsClaimed)}</span>
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
          <div className="bg-fg/5 py-4 px-6 -mx-5 sm:-mx-10 mb-8">
            <div className="max-w-[calc(100%+2rem)] sm:max-w-[calc(100%+5rem)] mx-auto flex items-center">
              <div className="flex space-x-12 pl-8 md:pl-12 flex-grow">
                <div className="font-semibold text-fg/70">APR</div>
                <div className="font-semibold text-fg/70">TVL</div>
                <div className="font-semibold text-fg/70">Invested</div>
              </div>
              <div className="font-semibold text-fg/70 flex-grow text-center">Actions</div>
              <div className="flex-grow"></div> {/* This empty div helps to position 'Actions' in the middle */}
            </div>
          </div>
          <div className="p-6 rounded-lg shadow-md mb-6" style={{ backgroundColor: '#d7defb' }}>
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="flex flex-col md:flex-row md:space-x-16 flex-grow mb-4 md:mb-0">
                <div>{epochs[0]?.apr || "0%"}</div>
                <div>{formatNumber(formatEther(currentEpoch.totalValueLocked))}</div>
                <div>{formatNumber(invested)}</div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="tiny"
                  onClick={() => setIsDepositModalOpen(true)}
                  disabled={currentEpoch.status !== 'Open'}
                  className="text-sm inline-flex gap-1 justify-center items-center py-1 px-2"
                >
                  <span className="rotate-90 text-bg/90">
                    <i className="ri-login-circle-line text-xs" />
                  </span>
                  <span className="sm:inline-block hidden">Deposit</span>
                </Button>
                <Button
                  size="tiny"
                  variant="outline"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={currentEpoch.status !== 'Open' || !hasInvestment}
                  className="text-sm inline-flex gap-1 justify-center items-center py-1 px-2"
                >
                  <span className="rotate-[270deg] text-fg/70">
                    <i className="ri-logout-circle-r-line text-xs" />
                  </span>
                  <span className="sm:inline-block hidden">Withdraw</span>
                </Button>
                <Button
                  size="tiny"
                  variant="outline"
                  onClick={onClaimRewards}
                  disabled={!hasClaimableRewards}
                  className="text-sm inline-flex gap-1 justify-center items-center py-1 px-2"
                >
                  <span className="text-fg/70">
                    <i className="ri-money-dollar-circle-line text-xs" />
                  </span>
                  <span className="sm:inline-block hidden">Claim</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg overflow-hidden">
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