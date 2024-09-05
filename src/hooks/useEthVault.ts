import { useState, useEffect, useCallback, useRef } from 'react';
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

const GRAPH_API_URL = 'https://subgraph.satsuma-prod.com/8a26f33a279b/ledgity--128781/eth-vault-subgraph/api';
const CACHE_DURATION = 60000; // 1 minute
const MIN_INTERVAL_BETWEEN_CALLS = 5000; // 5 seconds

interface SubgraphData {
    user: User | null;
}

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
    const [subgraphData, setSubgraphData] = useState<SubgraphData | null>(null);
    const [subgraphError, setSubgraphError] = useState<string | null>(null);
    const lastFetchTime = useRef<number>(0);
    const cachedData = useRef<{ data: SubgraphData | null, timestamp: number } | null>(null);

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

    const fetchSubgraphData = useCallback(async (address: string, retryCount = 0): Promise<void> => {
        const now = Date.now();
        if (now - lastFetchTime.current < MIN_INTERVAL_BETWEEN_CALLS) {
            console.log('Too soon to fetch. Using cached data or waiting.');
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
        } catch (error) {
            console.error('Error fetching subgraph data:', error);
            if (retryCount < 3) {
                const backoffDelay = Math.pow(2, retryCount) * 1000;
                console.log(`Retrying in ${backoffDelay}ms...`);
                setTimeout(() => fetchSubgraphData(address, retryCount + 1), backoffDelay);
            } else {
                setSubgraphError('Failed to fetch data after multiple attempts. Please try again later.');
                if (cachedData.current) {
                    console.log('Using last cached data');
                    setSubgraphData(cachedData.current.data);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (userAddress) {
            fetchSubgraphData(userAddress);
        }
    }, [userAddress, fetchSubgraphData]);

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
                            : (actualEpochId < Number(currentEpochId) ? 'Ended' : 'Future')
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

    const calculateInvestmentPerEpoch = (): { [key: number]: string } => {
        const investmentPerEpoch: { [key: number]: string } = {};

        if (subgraphData?.user?.actions) {
            let currentInvestment = BigInt(0);
            let lastProcessedEpoch = 0;

            subgraphData.user.actions.forEach((action: UserAction) => {
                const epochNumber = action.epochNumber;
                const amount = BigInt(action.amount);

                // If there's a gap in epochs, fill it with the last known investment
                for (let i = lastProcessedEpoch + 1; i < epochNumber; i++) {
                    investmentPerEpoch[i] = currentInvestment.toString();
                }

                if (action.actionType === 'DEPOSIT') {
                    currentInvestment += amount;
                } else if (action.actionType === 'WITHDRAW') {
                    currentInvestment -= amount;
                    if (currentInvestment < BigInt(0)) currentInvestment = BigInt(0);
                }

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
            await fetchSubgraphData(userAddress as string);
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
            await fetchSubgraphData(userAddress as string);
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
            await fetchSubgraphData(userAddress as string);
            return tx;
        } catch (error) {
            console.error('Claim rewards error:', error);
            throw error;
        }
    };

    const calculateTotalRewardsClaimed = () => {
        if (subgraphData?.user?.totalRewardsClaimed) {
            return parseFloat(formatEther(BigInt(subgraphData.user.totalRewardsClaimed))).toFixed(4);
        }
        return "0.0000";
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
        subgraphData,
        totalRewardsClaimed: calculateTotalRewardsClaimed(),
        investmentPerEpoch: calculateInvestmentPerEpoch(),
        subgraphError,
        refetchSubgraphData: () => fetchSubgraphData(userAddress as string),
    };
};