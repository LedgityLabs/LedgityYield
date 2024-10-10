import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import CancelSubscriptionButton from '@/components/mail/buttons/CancelSubscriptionButton';
import { IExecDataProtector } from '@iexec/dataprotector';

jest.mock('@iexec/dataprotector', () => ({
    IExecDataProtector: jest.fn(),
}));

describe('CancelSubscriptionButton', () => {
    const mockProps = {
        protectedData: '0x1234567890123456789012345678901234567890',
        userAddress: '0x0987654321098765432109876543210987654321',
        onSuccessfulUnsubscription: jest.fn(),
        onError: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<CancelSubscriptionButton {...mockProps} />);
        expect(screen.getByRole('button', { name: 'Cancel Subscription' })).toBeInTheDocument();
    });

    it('handles successful unsubscription', async () => {
        const mockRevokeOneAccess = jest.fn().mockResolvedValue({});
        (IExecDataProtector as jest.Mock).mockImplementation(() => ({
            core: {
                getProtectedData: jest.fn().mockResolvedValue([{ address: mockProps.protectedData }]),
                getGrantedAccess: jest.fn().mockResolvedValue({ grantedAccess: [{ dataset: mockProps.protectedData }] }),
                revokeOneAccess: mockRevokeOneAccess,
            },
        }));

        render(<CancelSubscriptionButton {...mockProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel Subscription' }));

        await waitFor(() => {
            expect(mockRevokeOneAccess).toHaveBeenCalled();
            expect(mockProps.onSuccessfulUnsubscription).toHaveBeenCalled();
        });
    });

    it('handles error during unsubscription', async () => {
        const mockError = new Error('Unsubscription failed');
        (IExecDataProtector as jest.Mock).mockImplementation(() => ({
            core: {
                getProtectedData: jest.fn().mockRejectedValue(mockError),
            },
        }));

        render(<CancelSubscriptionButton {...mockProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'Cancel Subscription' }));

        await waitFor(() => {
            expect(mockProps.onError).toHaveBeenCalledWith(`Error during subscription cancellation: ${mockError.message}`);
        });
    });
});