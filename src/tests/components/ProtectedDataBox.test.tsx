import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedDataBox from '@/components/mail/ProtectedDataBox';

// Mock the @iexec/dataprotector module
jest.mock('@iexec/dataprotector', () => ({
    IExecDataProtector: jest.fn().mockImplementation(() => ({
        // Add any methods you need to mock here
    })),
}));

describe('ProtectedDataBox', () => {
    const mockProps = {
        protectedAddressData: '0x1234567890123456789012345678901234567890',
        appIsGrantedAccess: false,
        userAddress: '0x0987654321098765432109876543210987654321',
        onSubscriptionChange: jest.fn(),
    };

    it('renders correctly when app is not granted access', () => {
        render(<ProtectedDataBox {...mockProps} />);
        expect(screen.getByText('Address of your protected data:')).toBeInTheDocument();
        expect(screen.getByText('not subscribed')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    });

    it('renders correctly when app is granted access', () => {
        render(<ProtectedDataBox {...mockProps} appIsGrantedAccess={true} />);
        expect(screen.getByText('already subscribed')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel Subscription' })).toBeInTheDocument();
    });
});