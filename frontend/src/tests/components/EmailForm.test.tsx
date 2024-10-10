import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import EmailForm from '@/components/mail/EmailForm';

describe('EmailForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('renders correctly', () => {
        render(<EmailForm onSubmit={mockOnSubmit} />);
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Validate Email' })).toBeInTheDocument();
    });

    it('validates email correctly', async () => {
        render(<EmailForm onSubmit={mockOnSubmit} />);
        const input = screen.getByLabelText('Email Address');
        const form = screen.getByTestId('email-form');

        // Test invalid email
        fireEvent.change(input, { target: { value: 'invalid-email' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter a valid email address');
        });
        expect(mockOnSubmit).not.toHaveBeenCalled();

        // Test valid email
        fireEvent.change(input, { target: { value: 'valid@email.com' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
        expect(mockOnSubmit).toHaveBeenCalledWith('valid@email.com');
    });
});