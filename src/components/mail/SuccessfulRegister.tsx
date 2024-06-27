'use client'

import React from 'react';
import SubscribeButton from './buttons/SubscribeButton';
import { Address } from '@/utils/types';

interface SuccessfulRegisterProps {
    protectedData: Address;
}

const SuccessfulRegister: React.FC<SuccessfulRegisterProps> = ({ protectedData }) => (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md mt-4">
        <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-bold">Your data is protected</span>
        </div>
        <p className="mt-2">
            Address of your protected data: <span className="font-mono">{protectedData}</span>
        </p>
        <SubscribeButton protectedData={protectedData} />
    </div>
);

export default SuccessfulRegister;