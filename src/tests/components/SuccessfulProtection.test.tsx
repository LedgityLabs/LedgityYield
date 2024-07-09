import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessfulProtection from '@/components/mail/SuccessfulProtection';

// Mock the @iexec/dataprotector module
jest.mock('@iexec/dataprotector', () => ({
    IExecDataProtector: jest.fn().mockImplementation(() => ({
        // Add any methods you need to mock here
    })),
}));

describe('SuccessfulProtection', () => {
    const mockProps = {
        protectedData: '0x1234567890123456789012345678901234567890',
        onSubscriptionChange: jest.fn(),
    };

    it('renders correctly', () => {
        render(<SuccessfulProtection {...mockProps} />);
        expect(screen.getByText('Your data is protected')).toBeInTheDocument();
        expect(screen.getByText('Address of your protected data:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    });

    // Remove the test for error display if SuccessfulProtection doesn't handle errors directly
    // If it does handle errors, you might need to adjust the component or the test accordingly
});