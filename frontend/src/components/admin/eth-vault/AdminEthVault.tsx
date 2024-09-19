import React, { useState, useEffect } from 'react';
import { parseEther, formatEther } from 'viem';
import {
    useWriteEthVaultTerminateCurrentAndOpenNextEpoch,
    useWriteEthVaultSetFundWallet,
    useWriteEthVaultLockFundsAndRunCurrentEpoch,
    useWriteEthVaultAllocateRewards,
    useWriteEthVaultLockOrUnlockContract,
    useReadEthVaultLocked,
    useReadEthVaultOwner,
    useReadEthVaultCurrentEpochId,
    useReadEthVaultCurrentEpochStatus,
    useReadEthVaultGetCurrentEpoch,
    useReadEthVaultFundWallet
} from "@/generated";

const AdminEthVault: React.FC = () => {
    const [newFundWallet, setNewFundWallet] = useState('');
    const [rewardsAmount, setRewardsAmount] = useState('');
    const [isLocking, setIsLocking] = useState(true);
    const [returnedFunds, setReturnedFunds] = useState('');
    const [rewardPercentage, setRewardPercentage] = useState('0');

    const terminateAndOpenHook = useWriteEthVaultTerminateCurrentAndOpenNextEpoch();
    const setFundWalletHook = useWriteEthVaultSetFundWallet();
    const lockFundsHook = useWriteEthVaultLockFundsAndRunCurrentEpoch();
    const allocateRewardsHook = useWriteEthVaultAllocateRewards();
    const lockUnlockHook = useWriteEthVaultLockOrUnlockContract();
    const { data: isLocked } = useReadEthVaultLocked();
    const { data: ownerAddress } = useReadEthVaultOwner();
    const { data: fundWalletAddress } = useReadEthVaultFundWallet();
    const { data: currentEpochId } = useReadEthVaultCurrentEpochId();
    const { data: currentEpochStatus } = useReadEthVaultCurrentEpochStatus();
    const { data: currentEpoch } = useReadEthVaultGetCurrentEpoch();

    useEffect(() => {
        if (currentEpoch && rewardsAmount) {
            const tvl = parseFloat(formatEther(currentEpoch.totalValueLocked));
            const rewards = parseFloat(rewardsAmount);
            if (tvl > 0) {
                const percentage = (rewards / tvl) * 100;
                setRewardPercentage(percentage.toFixed(2));
            }
        }
    }, [currentEpoch, rewardsAmount]);

    const handleTerminateAndOpen = async () => {
        if (!returnedFunds) {
            alert('Please enter the amount of funds to return');
            return;
        }
        try {
            const tx = await terminateAndOpenHook.writeContractAsync({
                value: parseEther(returnedFunds),
            });
            console.log('Terminate and Open transaction:', tx);
            alert('Epoch terminated and new epoch opened successfully');
        } catch (error) {
            console.error('Error in terminating and opening epoch:', error);
            alert('Failed to terminate and open epoch');
        }
    };

    const handleSetFundWallet = async () => {
        if (!newFundWallet) {
            alert('Please enter a valid fund wallet address');
            return;
        }
        try {
            const tx = await setFundWalletHook.writeContractAsync({
                args: [newFundWallet as `0x${string}`],
            });
            console.log('Set Fund Wallet transaction:', tx);
            alert('Fund wallet updated successfully');
        } catch (error) {
            console.error('Error in setting fund wallet:', error);
            alert('Failed to update fund wallet');
        }
    };

    const handleLockFunds = async () => {
        try {
            const tx = await lockFundsHook.writeContractAsync({
                args: [],
            });
            console.log('Lock Funds transaction:', tx);
            alert('Funds locked and epoch started successfully');
        } catch (error) {
            console.error('Error in locking funds:', error);
            alert('Failed to lock funds and start epoch');
        }
    };

    const handleAllocateRewards = async () => {
        if (!rewardsAmount) {
            alert('Please enter a valid rewards amount');
            return;
        }
        try {
            const tx = await allocateRewardsHook.writeContractAsync({
                value: parseEther(rewardsAmount),
            });
            console.log('Allocate Rewards transaction:', tx);
            alert('Rewards allocated successfully');
        } catch (error) {
            console.error('Error in allocating rewards:', error);
            alert('Failed to allocate rewards');
        }
    };

    const handleLockUnlock = async () => {
        try {
            const tx = await lockUnlockHook.writeContractAsync({
                args: [isLocking],
            });
            console.log('Lock/Unlock transaction:', tx);
            alert(`Contract ${isLocking ? 'locked' : 'unlocked'} successfully`);
        } catch (error) {
            console.error('Error in locking/unlocking contract:', error);
            alert('Failed to lock/unlock contract');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">ETH Vault Admin Panel</h2>
            <div className="space-y-2 mb-6">
                <div className="text-sm text-gray-600">
                    <strong>Owner:</strong> {ownerAddress ? (
                        <span className="font-mono">{ownerAddress}</span>
                    ) : (
                        <span className="italic">Loading...</span>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    <strong>Fund Wallet:</strong> {fundWalletAddress ? (
                        <span className="font-mono">{fundWalletAddress}</span>
                    ) : (
                        <span className="italic">Loading...</span>
                    )}
                </div>
                <div className="text-sm text-gray-600">
                    <strong>Current Epoch:</strong> {currentEpochId ? currentEpochId.toString() : 'Loading...'}
                </div>
                <div className="text-sm text-gray-600">
                    <strong>Epoch Status:</strong> {currentEpochStatus !== undefined ? (currentEpochStatus === 0 ? 'Open' : 'Running') : 'Loading...'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Fund Wallet Section */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Fund Wallet Functions</h3>

                    <div className="space-y-4">
                        <div className="border rounded p-4 bg-gray-100">
                            <h4 className="font-medium mb-2">Lock Funds</h4>
                            <button
                                onClick={handleLockFunds}
                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                            >
                                Lock Funds & Run Current Epoch
                            </button>
                        </div>

                        <div className="border rounded p-4 bg-gray-100">
                            <h4 className="font-medium mb-2">Terminate & Open Epoch</h4>
                            <div className="text-sm text-gray-600 mb-2">
                                Funds to return: {currentEpoch ? formatEther(currentEpoch.totalValueLocked) : 'Loading...'} ETH
                            </div>
                            <input
                                type="text"
                                value={returnedFunds}
                                onChange={(e) => setReturnedFunds(e.target.value)}
                                placeholder="Returned Funds Amount (in ETH)"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <button
                                onClick={handleTerminateAndOpen}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Terminate Current & Open Next Epoch
                            </button>
                        </div>

                        <div className="border rounded p-4 bg-gray-100">
                            <h4 className="font-medium mb-2">Allocate Rewards</h4>
                            <div className="text-sm text-gray-600 mb-2">
                                Current Epoch TVL: {currentEpoch ? formatEther(currentEpoch.totalValueLocked) : 'Loading...'} ETH
                            </div>
                            <input
                                type="text"
                                value={rewardsAmount}
                                onChange={(e) => setRewardsAmount(e.target.value)}
                                placeholder="Rewards Amount (in ETH)"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="text-sm text-gray-600 mb-2">
                                Reward Percentage: {rewardPercentage}%
                            </div>
                            <button
                                onClick={handleAllocateRewards}
                                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            >
                                Allocate Rewards
                            </button>
                        </div>
                    </div>
                </div>

                {/* Owner Section */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Owner Functions</h3>

                    <div className="space-y-4">
                        <div className="border rounded p-4 bg-gray-100">
                            <h4 className="font-medium mb-2">Set Fund Wallet</h4>
                            <input
                                type="text"
                                value={newFundWallet}
                                onChange={(e) => setNewFundWallet(e.target.value)}
                                placeholder="New Fund Wallet Address"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <button
                                onClick={handleSetFundWallet}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            >
                                Set Fund Wallet
                            </button>
                        </div>

                        <div className="border rounded p-4 bg-gray-100">
                            <h4 className="font-medium mb-2">Lock/Unlock Contract</h4>
                            <div className="flex items-center justify-between mb-4">
                                <span>Current Status:</span>
                                <span className={`font-bold ${isLocked ? 'text-red-500' : 'text-green-500'}`}>
                                    {isLocked ? 'Locked' : 'Unlocked'}
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={isLocking}
                                    onChange={(e) => setIsLocking(e.target.checked)}
                                    className="mr-2"
                                />
                                <label>{isLocking ? 'Lock' : 'Unlock'} Contract</label>
                            </div>
                            <button
                                onClick={handleLockUnlock}
                                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                            >
                                {isLocking ? 'Lock' : 'Unlock'} Contract
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEthVault;