import React, { useState } from 'react';
import { LedgityAddress } from '@/utils/address';
import { useAccount } from 'wagmi';

const BatchEmailComposer: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState('text/plain');
    const [label, setLabel] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState('');

    const { address } = useAccount();

    const handleSendBatch = async () => {
        if (!subject || !content) {
            setStatus('Please fill in both subject and content.');
            return;
        }
        setIsSending(true);
        setStatus('Initiating batch email send...');
        try {
            const response = await fetch('/api/send-batch-emails', {
                method: 'POST',
                cache: 'no-cache',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({subject, content, contentType, label})
            });
            const data = await response.json();

            setStatus(`Batch email process initiated. Job IDs: ${data.jobIds}`);
        } catch (error) {
            setStatus(`Error initiating batch email process: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Batch Email Composer</h2>

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
                    rows={6}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contentType">
                    Content Type
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                >
                    <option value="text/plain">Plain Text</option>
                    <option value="text/html">HTML</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                    Custom Label
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="label"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Enter custom label"
                />
            </div>

            <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSending || address?.toLowerCase() !== LedgityAddress.toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={handleSendBatch}
                disabled={isSending || address?.toLowerCase() !== LedgityAddress.toLowerCase()}
            >
                {isSending ? 'Sending...' : 'Send Batch Emails'}
            </button>

            {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
        </div>
    );
};

export default BatchEmailComposer;