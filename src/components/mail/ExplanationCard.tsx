'use client'

import React from 'react';
import Link from 'next/link';

const ExplanationCard: React.FC = () => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Why Register Your Email?</h2>
        <div className="text-gray-600">
            <ul>
                <li>Registering your email allows us to keep you updated with the latest news,
                    offers, and important information. </li>
                <li>
                    The
                    <Link href="https://tools.docs.iex.ec/tools/web3mail" className='font-sans underline'> Web3Mail </Link>
                    tool from
                    <Link href="https://iex.ec/" className='font-sans underline'> iExec tool suite </Link>
                    offers a secure method to manage email-based communications via the blockchain.
                    This mechanism helps protect the personal information of the email recipients through use of Ethereum addresses.
                </li>
            </ul>
        </div>
    </div>
);

export default ExplanationCard;