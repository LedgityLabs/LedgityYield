// src/tests/components/SubscribeButton.test.tsx

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SubscribeButton from '@/components/mail/buttons/SubscribeButton';
import { IExecDataProtector, ProtectedData } from '@iexec/dataprotector';
import { AuthorizedAppAddress, LedgityAddress } from '@/utils/address';
import { checkIsProtected, handleSubmitProtection, checkAppIsGrantedAccess } from '@/components/mail/utils/utils';


// Mock the IExecDataProtector
jest.mock('@iexec/dataprotector', () => ({
    IExecDataProtector: jest.fn().mockImplementation(() => ({
        core: {
            grantAccess: jest.fn(),
            getProtectedData: jest.fn(),
            getGrantedAccess: jest.fn(),
        },
    })),
}));

jest.mock('@/components/mail/utils/utils', () => ({
    checkIsProtected: jest.fn(),
    handleSubmitProtection: jest.fn(),
    checkAppIsGrantedAccess: jest.fn(),
}));

describe('SubscribeButton', () => {
    const mockOnSuccessfulSubscription = jest.fn();
    const mockOnError = jest.fn();
    const mockProtectedData = '0x1234567890123456789012345678901234567890';

    beforeEach(() => {
        jest.clearAllMocks();
        // Set up mock behavior for utility functions if needed
        (checkIsProtected as jest.Mock).mockResolvedValue(mockProtectedData);
        (handleSubmitProtection as jest.Mock).mockResolvedValue(mockProtectedData);
        (checkAppIsGrantedAccess as jest.Mock).mockResolvedValue(false);
    });

    it('renders correctly', () => {
        render(
            <SubscribeButton
                protectedData={mockProtectedData}
                onSuccessfulSubscription={mockOnSuccessfulSubscription}
                onError={mockOnError}
            />
        );
        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    });

    it('calls grantAccess when clicked and handles success', async () => {
        const mockGrantAccess = jest.fn().mockResolvedValue({});
        (IExecDataProtector as jest.Mock).mockImplementation(() => ({
            core: {
                grantAccess: mockGrantAccess,
            },
        }));

        render(
            <SubscribeButton
                protectedData={mockProtectedData}
                onSuccessfulSubscription={mockOnSuccessfulSubscription}
                onError={mockOnError}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

        await waitFor(() => {
            expect(mockGrantAccess).toHaveBeenCalledWith({
                protectedData: mockProtectedData,
                authorizedApp: AuthorizedAppAddress,
                authorizedUser: LedgityAddress,
                numberOfAccess: 1000,
            });
            expect(mockOnSuccessfulSubscription).toHaveBeenCalled();
            expect(mockOnError).not.toHaveBeenCalled();
        });

        expect(screen.getByRole('button', { name: 'Subscribe' })).not.toBeDisabled();
    });

    it('handles error when grantAccess fails', async () => {
        const mockError = new Error('Grant access failed');
        const mockGrantAccess = jest.fn().mockRejectedValue(mockError);
        (IExecDataProtector as jest.Mock).mockImplementation(() => ({
            core: {
                grantAccess: mockGrantAccess,
            },
        }));

        render(
            <SubscribeButton
                protectedData={mockProtectedData}
                onSuccessfulSubscription={mockOnSuccessfulSubscription}
                onError={mockOnError}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

        await waitFor(() => {
            expect(mockGrantAccess).toHaveBeenCalled();
            expect(mockOnSuccessfulSubscription).not.toHaveBeenCalled();
            expect(mockOnError).toHaveBeenCalledWith(`Error granting access: ${mockError.message}`);
        });

        expect(screen.getByRole('button', { name: 'Subscribe' })).not.toBeDisabled();
    });
});