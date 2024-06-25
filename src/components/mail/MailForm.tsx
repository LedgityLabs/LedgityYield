'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { IExecDataProtector, type DataSchema } from "@iexec/dataprotector";


const MailForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Email submitted:', email);
        // Add your validation logic or API call here


        const web3Provider = window.ethereum;
        // instantiate
        const dataProtector = new IExecDataProtector(web3Provider);

        console.log('Data protector:', dataProtector)

        try {
            const data: DataSchema = { email: email } as DataSchema;
            const protectedData = await dataProtector.protectData({
                data
            })
            console.log('Protected data:', protectedData);
        }
        catch (error) {
            console.error('Error:', error);
        }

    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            {/* Explanation Card */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-3">Why Register Your Email?</h2>
                <p className="text-gray-600">
                    Registering your email allows us to keep you updated with the latest news,
                    offers, and important information. We do not save your email address. Viva webmail from iexec
                </p>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Validate Email
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MailForm;