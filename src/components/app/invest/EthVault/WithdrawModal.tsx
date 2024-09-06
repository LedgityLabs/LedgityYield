import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWithdraw: (amount: string) => Promise<void>;
    maxAmount: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onWithdraw, maxAmount }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleWithdraw = async () => {
        setIsLoading(true);
        try {
            await onWithdraw(amount);
        } catch (error) {
            console.error('Withdrawal failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-gradient-to-r from-white to-blue-50 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    Withdraw ETH
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="mb-2 text-sm text-blue-500">Available to withdraw: {maxAmount} ETH</p>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Amount to withdraw"
                                        className="w-full p-2 border border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={handleWithdraw}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-500 rounded text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    >
                                        {isLoading ? 'Withdrawing...' : 'Withdraw'}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-white border border-blue-200 rounded text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                    
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default WithdrawModal;