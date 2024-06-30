import React from 'react';
import SendMailForm from '@/components/sendMail/SendMailForm';

export default function EmailPage() {

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h1>
            <SendMailForm />
        </div>
    );
}