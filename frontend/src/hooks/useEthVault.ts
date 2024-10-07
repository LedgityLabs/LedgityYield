import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { GraphQLClient } from 'graphql-request';
import { GET_USER_DATA } from '@/services/graph/queries/ethVault';
import { User, UserAction } from '@/utils/types';
import {
    useReadEthVaultGetCurrentEpoch,
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

const GRAPH_API_URL = 'https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/eth-vault/api';
const CACHE_DURATION = 60000; // 1 minute
const MIN_INTERVAL_BETWEEN_CALLS = 5000; // 5 seconds

interface SubgraphData {
    user: User | null;
}

export const useEthVault = () => {
    const { address: userAddress } = useAccount();

    const { data: currentEpochData, isError, isLoading, refetch: refetchCurrentEpoch } = useReadEthVaultGetCurrentEpoch();
    const { data: currentEpochStatus, refetch: refetchCurrentEpochStatus } = useReadEthVaultCurrentEpochStatus();
    const { data: userStake, refetch: refetchUserStake } = useReadEthVaultUserStakes({
        args: [userAddress as `0x${string}`],
    }) as { data: readonly [bigint, bigint] | undefined, refetch: () => Promise<any> };
    const { data: currentEpochId, refetch: refetchCurrentEpochId } = useReadEthVaultCurrentEpochId();
    const { data: allEpochs, refetch: refetchAllEpochs } = useReadEthVaultGetAllEpochs();
    const { data: claimableRewards, refetch: refetchClaimableRewards } = useReadEthVaultClaimableRewards();
    const { data: hasClaimableRewards, refetch: refetchHasClaimableRewards } = useReadEthVaultHasClaimableRewards({
        args: [userAddress as `0x${string}`]
    });
    const { data: calculatedRewards, refetch: refetchCalculatedRewards } = useReadEthVaultCalculateRewards({
        args: [userAddress as `0x${string}`],
    });

    const { writeContract: writeEnter } = useWriteEthVaultEnter();
    const { writeContract: writeExit } = useWriteEthVaultExit();
    const { writeContract: writeClaimRewards } = useWriteEthVaultClaimRewards();

    const [subgraphData, setSubgraphData] = useState<SubgraphData | null>(null);
    const [subgraphError, setSubgraphError] = useState<string | null>(null);
    const [userDepositEvents, setUserDepositEvents] = useState<UserAction[]>([]);
    const [userWithdrawEvents, setUserWithdrawEvents] = useState<UserAction[]>([]);
    const lastFetchTime = useRef<number>(0);
    const cachedData = useRef<{ data: SubgraphData | null, timestamp: number } | null>(null);

    const calculateAPR = useCallback((tvl: string, rewards: string): string => {
        const tvlValue = parseFloat(tvl);
        const rewardsValue = parseFloat(rewards);
        if (tvlValue === 0 || rewardsValue === 0) return "0";
        const aprValue = (rewardsValue / tvlValue) * 100;
        return aprValue.toFixed(2);
    }, []);

    const fetchSubgraphData = useCallback(async (address: string, retryCount = 0): Promise<void> => {
        const now = Date.now();
        if (now - lastFetchTime.current < MIN_INTERVAL_BETWEEN_CALLS) {
            if (cachedData.current && now - cachedData.current.timestamp < CACHE_DURATION) {
                setSubgraphData(cachedData.current.data);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL_BETWEEN_CALLS - (now - lastFetchTime.current)));
        }

        lastFetchTime.current = now;

        const client = new GraphQLClient(GRAPH_API_URL);

        try {
            const userData: SubgraphData = await client.request(GET_USER_DATA, { userId: address.toLowerCase() });
            setSubgraphData(userData);
            setSubgraphError(null);
            cachedData.current = { data: userData, timestamp: now };

            // Process and set deposit and withdraw events
            if (userData.user && userData.user.actions) {
                const deposits = userData.user.actions.filter(action => action.actionType === 'DEPOSIT');
                const withdrawals = userData.user.actions.filter(action => action.actionType === 'WITHDRAW');
                setUserDepositEvents(deposits);
                setUserWithdrawEvents(withdrawals);

            }
        } catch (error) {
            if (retryCount < 3) {
                const backoffDelay = Math.pow(2, retryCount) * 1000;
                setTimeout(() => fetchSubgraphData(address, retryCount + 1), backoffDelay);
            } else {
                setSubgraphError('Failed to fetch data after multiple attempts. Please try again later.');
                if (cachedData.current) {
                    setSubgraphData(cachedData.current.data);
                }
            }
        }
    }, []);

    const refetchAllData = useCallback(async () => {
        await Promise.all([
            refetchCurrentEpoch(),
            refetchCurrentEpochStatus(),
            refetchUserStake(),
            refetchCurrentEpochId(),
            refetchAllEpochs(),
            refetchClaimableRewards(),
            refetchHasClaimableRewards(),
            refetchCalculatedRewards(),
            fetchSubgraphData(userAddress as string)
        ]);
    }, [refetchCurrentEpoch, refetchCurrentEpochStatus, refetchUserStake, refetchCurrentEpochId, refetchAllEpochs, refetchClaimableRewards, refetchHasClaimableRewards, refetchCalculatedRewards, fetchSubgraphData, userAddress]);

    useEffect(() => {
        if (userAddress) {
            refetchAllData();
        }
    }, [userAddress, refetchAllData]);

    const currentEpoch = useMemo(() => {
        if (currentEpochData && currentEpochStatus !== undefined) {
            return {
                totalValueLocked: currentEpochData.totalValueLocked,
                totalEpochRewards: currentEpochData.totalEpochRewards,
                status: currentEpochStatus === 0 ? 'Open' : 'Running',
                rewardsDistributed: currentEpochData.totalEpochRewards > 0n
            };
        }
        return {
            totalValueLocked: BigInt(0),
            totalEpochRewards: BigInt(0),
            status: 'Open' as 'Open' | 'Running',
            rewardsDistributed: false
        };
    }, [currentEpochData, currentEpochStatus]);

    const epochs = useMemo(() => {
        if (allEpochs && currentEpochId && userStake) {
            return allEpochs
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
                            : (actualEpochId < Number(currentEpochId) ? 'Ended' : 'Future')
                    };
                }).reverse();
        }
        return [];
    }, [allEpochs, currentEpochId, userStake, currentEpochStatus, calculateAPR]);

    const calculateInvestmentPerEpoch = useCallback((): { [key: number]: string } => {
        const investmentPerEpoch: { [key: number]: string } = {};

        if (subgraphData?.user?.actions) {
            let currentInvestment = BigInt(0);
            let lastProcessedEpoch = 0;

            // Sort actions by epoch and then by timestamp
            const sortedActions = [...subgraphData.user.actions].sort((a, b) => {
                if (a.epochNumber === b.epochNumber) {
                    return Number(a.timestamp) - Number(b.timestamp);
                }
                return a.epochNumber - b.epochNumber;
            });

            sortedActions.forEach((action: UserAction) => {
                const epochNumber = action.epochNumber;
                const amount = BigInt(action.amount);

                // If there's a gap in epochs, fill it with the last known investment
                for (let i = lastProcessedEpoch + 1; i < epochNumber; i++) {
                    investmentPerEpoch[i] = currentInvestment.toString();
                }

                // Update current investment based on action type
                if (action.actionType === 'DEPOSIT') {
                    currentInvestment += amount;
                } else if (action.actionType === 'WITHDRAW') {
                    currentInvestment = currentInvestment >= amount ? currentInvestment - amount : BigInt(0);
                }

                // Update or set the investment for the current epoch
                investmentPerEpoch[epochNumber] = currentInvestment.toString();
                lastProcessedEpoch = epochNumber;
            });

            // Fill any remaining epochs up to the current epoch
            const currentEpochNumber = currentEpochId ? Number(currentEpochId) : lastProcessedEpoch;
            for (let i = lastProcessedEpoch + 1; i <= currentEpochNumber; i++) {
                investmentPerEpoch[i] = currentInvestment.toString();
            }
        }

        return investmentPerEpoch;
    }, [subgraphData, currentEpochId]);

    const handleDeposit = useCallback(async (amount: string) => {
        if (!writeEnter) {
            console.error('Write function is not available');
            throw new Error('The deposit function is not ready. Please try again in a few moments.');
        }

        try {
            const hash = await writeEnter({
                args: [],
                value: parseEther(amount),
            });
            console.log('Transaction submitted:', hash);
            
            // Refetch data after a short delay to allow time for the transaction to be processed
            setTimeout(() => refetchAllData(), 5000);
            
            return hash;
        } catch (error) {
            console.error('Deposit error:', error);
            throw error;
        }
    }, [writeEnter, refetchAllData]);

    const handleWithdraw = useCallback(async (amount: string) => {
        if (!writeExit) {
            console.error('Withdraw function is not available');
            throw new Error('The withdraw function is not ready. Please try again in a few moments.');
        }

        try {
            const hash = await writeExit({
                args: [parseEther(amount)],
            });
            console.log('Withdraw transaction submitted:', hash);
            
            // Refetch data after a short delay to allow time for the transaction to be processed
            setTimeout(() => refetchAllData(), 5000);
            
            return hash;
        } catch (error) {
            console.error('Withdraw error:', error);
            throw error;
        }
    }, [writeExit, refetchAllData]);

    const handleClaimRewards = useCallback(async () => {
        if (!writeClaimRewards) {
            console.error('Claim rewards function is not available');
            throw new Error('The claim rewards function is not ready. Please try again in a few moments.');
        }

        try {
            const hash = await writeClaimRewards({
                args: [],
            });
            console.log('Claim rewards transaction submitted:', hash);
            
            // Refetch data after a short delay to allow time for the transaction to be processed
            setTimeout(() => refetchAllData(), 5000);
            
            return hash;
        } catch (error) {
            console.error('Claim rewards error:', error);
            throw error;
        }
    }, [writeClaimRewards, refetchAllData]);

    const totalRewardsClaimed = useMemo(() => {
        if (subgraphData?.user?.totalRewardsClaimed) {
            return parseFloat(formatEther(BigInt(subgraphData.user.totalRewardsClaimed))).toFixed(4);
        }
        return "0.0000";
    }, [subgraphData]);

    const invested = useMemo(() => userStake && userStake[0] ? formatEther(userStake[0]) : "0", [userStake]);
    const hasInvestment = useMemo(() => parseFloat(invested) > 0, [invested]);

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
        subgraphData,
        totalRewardsClaimed,
        investmentPerEpoch: calculateInvestmentPerEpoch(),
        subgraphError,
        refetchAllData,
    };
};