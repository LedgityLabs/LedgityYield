import React, { useState } from 'react';
import { Coins, Check, X } from 'lucide-react';
import { formatEther } from 'viem';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import VaultActionButtons from './VaultActionButtons';
import StatCard from './StatCard';
import EpochsOverview from './EpochsOverview';
import { useEthVault } from './useEthVault';

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
  } = useEthVault();

  const onClaimRewards = async () => {
    if (!hasClaimableRewards) {
      alert('You don\'t have any rewards to claim.');
      return;
    }
    try {
      await handleClaimRewards();
      alert('Your rewards have been claimed successfully!');
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('An error occurred while claiming rewards. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching current epoch data</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coins size={24} />
          <h2 className="text-xl font-bold">ETH Vault</h2>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">Current Epoch Rewards Distributed:</span>
          {currentEpoch.rewardsDistributed ? (
            <Check className="text-green-300" size={20} />
          ) : (
            <X className="text-red-300" size={20} />
          )}
        </div>
        <div className="text-sm">
          Current APR: <span className="font-bold">{epochs[0]?.apr || "0%"}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Current Epoch TVL" value={`${parseFloat(formatEther(currentEpoch.totalValueLocked)).toFixed(4)} ETH`} />
          <StatCard title="Your current Investment" value={`${parseFloat(invested).toFixed(4)} ETH`} />
          <StatCard title="Your available Rewards" value={`${parseFloat(calculatedRewards).toFixed(4)} ETH`} />
        </div>

        <VaultActionButtons
          isEpochOpen={currentEpoch.status === 'Open'}
          onDeposit={() => setIsDepositModalOpen(true)}
          onWithdraw={() => setIsWithdrawModalOpen(true)}
          onClaimRewards={onClaimRewards}
          isWithdrawDisabled={!hasInvestment}
          isClaimRewardsDisabled={!hasClaimableRewards}
          userInvestment={invested}
        />

        <EpochsOverview
          epochs={epochs}
          isClaimable={claimableRewards !== undefined ? claimableRewards : false}
        />
      </div>

      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={async (amount: string) => {
          try {
            await handleDeposit(amount);
            alert('Your deposit was successful!');
            setIsDepositModalOpen(false);
          } catch (error) {
            alert('An error occurred during the deposit. Please check your wallet and try again.');
          }
        }}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={async (amount: string) => {
          try {
            await handleWithdraw(amount);
            alert('Your withdrawal was successful!');
            setIsWithdrawModalOpen(false);
          } catch (error) {
            alert('An error occurred during the withdrawal. Please check your wallet and try again.');
          }
        }}
        maxAmount={invested}
      />
    </div>
  );
};

export default AppInvestEthVault;