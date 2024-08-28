import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
    useReadEthVaultGetCurrentEpoch,
    useReadEthVaultGetEpochCount,
    useReadEthVaultEpochs,
    useReadEthVaultCurrentEpochStatus,
    useReadEthVaultUserStakes,
    useReadEthVaultCurrentEpochId,
    useWriteEthVaultEnter,
    useWriteEthVaultExit,
    useReadEthVaultGetAllEpochs,
    useReadEthVaultClaimableRewards,
    useReadEthVaultHasClaimableRewards,
    useWriteEthVaultClaimRewards,
    useReadEthVaultCalculateRewards
} from "@/generated";
import { parseEther, formatEther } from 'viem';

export const useEthVault = () => {
    const [currentEpoch, setCurrentEpoch] = useState({
        totalValueLocked: BigInt(0),
        totalEpochRewards: BigInt(0),
        status: 'Open' as 'Open' | 'Running',
        rewardsDistributed: false
    });
    const [epochs, setEpochs] = useState<Array<{
        id: number;
        apr: string;
        invested: string;
        tvl: string;
        status: string;
    }>>([]);

    const { address: userAddress } = useAccount();

    const { data: currentEpochData, isError, isLoading } = useReadEthVaultGetCurrentEpoch();
    const { data: currentEpochStatus } = useReadEthVaultCurrentEpochStatus();
    const { data: userStake } = useReadEthVaultUserStakes({
        args: [userAddress as `0x${string}`],
    }) as { data: readonly [bigint, bigint] | undefined };
    const { data: currentEpochId } = useReadEthVaultCurrentEpochId();
    const { data: allEpochs } = useReadEthVaultGetAllEpochs();
    const { data: claimableRewards } = useReadEthVaultClaimableRewards();
    const { data: hasClaimableRewards, refetch: refetchHasClaimableRewards } = useReadEthVaultHasClaimableRewards({
        args: [userAddress as `0x${string}`]
    });
    const { data: calculatedRewards } = useReadEthVaultCalculateRewards({
        args: [userAddress as `0x${string}`],
    });

    const writeHookResult = useWriteEthVaultEnter();
    const withdrawHookResult = useWriteEthVaultExit();
    const claimRewardsHook = useWriteEthVaultClaimRewards();

    useEffect(() => {
        if (currentEpochData && currentEpochStatus !== undefined) {
            setCurrentEpoch({
                totalValueLocked: currentEpochData.totalValueLocked,
                totalEpochRewards: currentEpochData.totalEpochRewards,
                status: currentEpochStatus === 0 ? 'Open' : 'Running',
                rewardsDistributed: currentEpochData.totalEpochRewards > 0n
            });
        }
    }, [currentEpochData, currentEpochStatus]);

    useEffect(() => {
        if (allEpochs && currentEpochId && userStake) {
            const formattedEpochs = allEpochs
                .slice(1) // Remove epoch 0
                .map((epoch, index) => {
                    const actualEpochId = index + 1; // Adjust epoch ID to start from 1
                    const apr = calculateAPR(epoch.totalValueLocked.toString(), epoch.totalEpochRewards.toString());
                    return {
                        id: actualEpochId,
                        apr: `${apr}%`,
                        invested: actualEpochId === Number(currentEpochId) ? formatEther(userStake[0]) : "0",
                        tvl: formatEther(epoch.totalValueLocked),
                        status: actualEpochId === Number(currentEpochId)
                            ? (currentEpochStatus === 0 ? 'Open' : 'Running')
                            : (actualEpochId < Number(currentEpochId) ? 'Closed' : 'Future')
                    };
                });
            setEpochs(formattedEpochs.reverse());
        }
    }, [allEpochs, currentEpochId, userStake, currentEpochStatus]);

    const calculateAPR = (tvl: string, rewards: string): string => {
        const tvlValue = parseFloat(tvl);
        const rewardsValue = parseFloat(rewards);
        if (tvlValue === 0 || rewardsValue === 0) return "0";
        const aprValue = (rewardsValue / tvlValue) * 100;
        return aprValue.toFixed(2);
    };

    const handleDeposit = async (amount: string) => {
        if (!writeHookResult.writeContractAsync) {
            console.error('Write function is not available');
            throw new Error('The deposit function is not ready. Please try again in a few moments.');
        }

        try {
            const tx = await writeHookResult.writeContractAsync({
                args: [],
                value: parseEther(amount),
            });
            console.log('Transaction submitted:', tx);
            return tx;
        } catch (error) {
            console.error('Deposit error:', error);
            throw error;
        }
    };

    const handleWithdraw = async (amount: string) => {
        if (!withdrawHookResult.writeContractAsync) {
            console.error('Withdraw function is not available');
            throw new Error('The withdraw function is not ready. Please try again in a few moments.');
        }

        try {
            const tx = await withdrawHookResult.writeContractAsync({
                args: [parseEther(amount)],
            });
            console.log('Withdraw transaction submitted:', tx);
            return tx;
        } catch (error) {
            console.error('Withdraw error:', error);
            throw error;
        }
    };

    const handleClaimRewards = async () => {
        if (!claimRewardsHook.writeContractAsync) {
            console.error('Claim rewards function is not available');
            throw new Error('The claim rewards function is not ready. Please try again in a few moments.');
        }

        try {
            const tx = await claimRewardsHook.writeContractAsync({
                args: [],
            });
            console.log('Claim rewards transaction submitted:', tx);
            await refetchHasClaimableRewards();
            return tx;
        } catch (error) {
            console.error('Claim rewards error:', error);
            throw error;
        }
    };

    const invested: string = userStake && userStake[0] ? formatEther(userStake[0]) : "0";
    const hasInvestment = parseFloat(invested) > 0;

    return {
        currentEpoch,
        epochs,
        isError,
        isLoading,
        claimableRewards,
        hasClaimableRewards,
        invested,
        hasInvestment,
        calculatedRewards: calculatedRewards ? formatEther(calculatedRewards) : "0",
        handleDeposit,
        handleWithdraw,
        handleClaimRewards,
    };
};