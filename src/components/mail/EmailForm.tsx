import React, { useState, ChangeEvent } from 'react';

interface EmailFormProps {
    onSubmit: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState<string>('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(email);
    };

    return (
        <form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
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
                    type="button"
                    onClick={handleSubmit}
                >
                    Validate Email
                </button>
            </div>
        </form>
    );
};

export default EmailForm;