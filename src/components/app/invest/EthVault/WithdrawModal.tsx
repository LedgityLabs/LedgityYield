import React, { useState } from 'react';
import { parseEther } from 'viem';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWithdraw: (amount: string) => void;
    maxAmount: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdraw, maxAmount }) => {
    const [amount, setAmount] = useState('');

    const handleWithdraw = () => {
        if (!amount) {
            alert('Please enter an amount to withdraw');
            return;
        }
        if (parseFloat(amount) > parseFloat(maxAmount)) {
            alert('Cannot withdraw more than your invested amount');
            return;
        }
        onWithdraw(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Withdraw ETH</h2>
                <p className="mb-2">Available to withdraw: {maxAmount} ETH</p>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount to withdraw"
                    className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleWithdraw}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;