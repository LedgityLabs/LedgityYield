import React, { useState } from 'react';
import { IExecWeb3mail } from '@iexec/web3mail';
import { type SendEmailParams } from '@iexec/web3mail';

const web3Provider = window.ethereum;
// instantiate
const web3mail = new IExecWeb3mail(web3Provider);

const SendMail: React.FC<SendEmailParams> = ({ protectedData }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSendEmail = async () => {
        setIsSending(true);
        setError(null);
        setSuccess(false);

        try {


            const result = await web3mail.sendEmail({
                protectedData,
                emailSubject: subject,
                emailContent: content,
            });

            console.log('Email sent:', result);
            setSuccess(true);
        } catch (err) {
            console.error('Error sending email:', err);
            setError('Failed to send email. Please try again.');
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Send Web3 Email</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                    Subject
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter email content"
                    rows={4}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSending ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSending}
                >
                    {isSending ? 'Sending...' : 'Send Email'}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
            {success && <p className="text-green-500 text-xs italic mt-2">Email sent successfully!</p>}
        </div>
    );
};

export default SendMail;