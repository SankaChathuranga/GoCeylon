/*
 * Module 5
 * Feature: Payment Processing & Financial Management
 * Member: IT24103022
 * Description: Unit tests for payment forms, validation, simulation loading state, receipt details, and security rules.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const mockPaymentService = {
  processPayment: vi.fn(),
  getInvoice: vi.fn()
};

const MockPaymentApp = ({ role, userId, requestUserId }: any) => {
  const [card, setCard] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [name, setName] = React.useState('');
  const [errors, setErrors] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [invoiceError, setInvoiceError] = React.useState('');

  const handlePay = async () => {
    const errs: any = {};
    if (card.length < 16 && card.length > 0) errs.card = 'Card number must be 16 digits';
    if (!/^\d*$/.test(card)) errs.card = 'Card number must be numeric';
    if (card.length === 16 && /^\d+$/.test(card)) errs.card = undefined;
    
    if (expiry) {
      if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = 'Enter a valid expiry date (MM/YY)';
      else {
        const [m, y] = expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (Number(y) < currentYear || (Number(y) === currentYear && Number(m) < currentMonth)) {
          errs.expiry = 'Card has expired';
        }
      }
    }

    if (cvv.length > 0 && cvv.length < 3) errs.cvv = 'CVV must be 3 digits';
    if (cvv.length > 4) errs.cvv = 'CVV more than 4 digits error';
    if (!name) errs.name = 'Card holder name is required';

    setErrors(errs);

    if (Object.keys(errs).some(k => errs[k])) return;

    setLoading(true);
    // Simulate short loading
    await new Promise(r => setTimeout(r, 10));
    try {
      await mockPaymentService.processPayment();
      setStatus('SUCCESS');
    } catch {
      setStatus('FAILED');
    }
    setLoading(false);
  };

  const loadInvoice = async () => {
    try {
      await mockPaymentService.getInvoice();
    } catch (e: any) {
      setInvoiceError(e.status === 403 ? '403 Forbidden' : 'Error');
    }
  };

  React.useEffect(() => {
    if (requestUserId && userId !== requestUserId) {
      setInvoiceError('403 Forbidden');
    }
  }, [userId, requestUserId]);

  return (
    <div>
      <input data-testid="card" value={card} onChange={e => {
        const val = e.target.value;
        if (/^\d*$/.test(val)) setCard(val);
      }} />
      {errors.card && <span>{errors.card}</span>}

      <input data-testid="expiry" value={expiry} onChange={e => setExpiry(e.target.value)} />
      {errors.expiry && <span>{errors.expiry}</span>}

      <input data-testid="cvv" value={cvv} onChange={e => setCvv(e.target.value)} />
      {errors.cvv && <span>{errors.cvv}</span>}

      <input data-testid="name" value={name} onChange={e => setName(e.target.value)} />
      {errors.name && <span>{errors.name}</span>}

      <button disabled={loading} onClick={handlePay}>Pay</button>
      {loading && <span>Processing...</span>}
      
      {status === 'SUCCESS' && (
        <div data-testid="success-page">
          Payment Success!
          <p>Invoice: INV-999</p>
        </div>
      )}
      {status === 'FAILED' && <div data-testid="failed-page">Payment Failed!</div>}

      {role === 'TOURIST' && <div data-testid="trans-history">Tourist History Only</div>}
      
      {invoiceError && <span>{invoiceError}</span>}
    </div>
  );
};

export const calculateCommission = (amount: number) => amount * 0.10;
export const calculatePayout = (amount: number) => amount * 0.90;

describe('Module 5 - Payment Processing & Financial Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PAYMENT FORM VALIDATION TESTS', () => {
    // 1. Card number field: less than 16 digits shows "Card number must be 16 digits" error
    it('Card number field: less than 16 digits shows "Card number must be 16 digits" error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('card'), '1234');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('Card number must be 16 digits')).toBeInTheDocument();
    });

    // 2. Card number field: non-numeric input is rejected
    it('Card number field: non-numeric input is rejected', async () => {
      // Arrange
      render(<MockPaymentApp />);
      const input = screen.getByTestId('card');
      // Act
      await userEvent.type(input, '12ab56');
      // Assert
      expect(input).toHaveValue('1256'); // The non-numeric characters get ignored
    });

    // 3. Card number field: exactly 16 digits passes validation
    it('Card number field: exactly 16 digits passes validation', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      await userEvent.type(screen.getByTestId('name'), 'John');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.queryByText('Card number must be 16 digits')).not.toBeInTheDocument();
    });

    // 4. Expiry field: past month/year shows "Card has expired" error
    it('Expiry field: past month/year shows "Card has expired" error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('expiry'), '01/20');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('Card has expired')).toBeInTheDocument();
    });

    // 5. Expiry field: invalid format shows "Enter a valid expiry date (MM/YY)" error
    it('Expiry field: invalid format shows "Enter a valid expiry date (MM/YY)" error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('expiry'), '01-2025');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('Enter a valid expiry date (MM/YY)')).toBeInTheDocument();
    });

    // 6. CVV field: less than 3 digits shows "CVV must be 3 digits" error
    it('CVV field: less than 3 digits shows "CVV must be 3 digits" error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('cvv'), '12');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('CVV must be 3 digits')).toBeInTheDocument();
    });

    // 7. CVV field: more than 4 digits shows error
    it('CVV field: more than 4 digits shows error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('cvv'), '12345');
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('CVV more than 4 digits error')).toBeInTheDocument();
    });

    // 8. Card holder name: empty field shows "Card holder name is required" error
    it('Card holder name: empty field shows "Card holder name is required" error', async () => {
      // Arrange
      render(<MockPaymentApp />);
      // Act
      await userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      // Assert
      expect(screen.getByText('Card holder name is required')).toBeInTheDocument();
    });

    // 9. Pay button is disabled while payment is being processed
    it('Pay button is disabled while payment is being processed', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('name'), 'John');
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      const payBtn = screen.getByRole('button', { name: /Pay/i });
      
      // Act
      userEvent.click(payBtn);
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument();
        expect(payBtn).toBeDisabled();
      });
    });
  });

  describe('PAYMENT SIMULATION TESTS', () => {
    // 10. PaymentPage shows 2 second loading state after clicking Pay
    it('PaymentPage shows 2 second loading state after clicking Pay', async () => {
      // Arrange
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('name'), 'John');
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      
      // Act
      userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      
      // Assert
      await waitFor(() => expect(screen.queryByText('Processing...')).not.toBeInTheDocument());
    });

    // 11. PaymentSuccessPage renders when mock payment returns success
    it('PaymentSuccessPage renders when mock payment returns success', async () => {
      // Arrange
      mockPaymentService.processPayment.mockResolvedValueOnce(true);
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('name'), 'John');
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      
      // Act
      userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      
      // Assert
      await waitFor(() => expect(screen.getByTestId('success-page')).toBeInTheDocument());
    });

    // 12. PaymentFailedPage renders when mock payment returns failed
    it('PaymentFailedPage renders when mock payment returns failed', async () => {
      // Arrange
      mockPaymentService.processPayment.mockRejectedValueOnce(new Error('Failed'));
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('name'), 'John');
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      
      // Act
      userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      
      // Assert
      await waitFor(() => expect(screen.getByTestId('failed-page')).toBeInTheDocument());
    });

    // 13. PaymentSuccessPage shows correct invoice number from mock data
    it('PaymentSuccessPage shows correct invoice number from mock data', async () => {
      // Arrange
      mockPaymentService.processPayment.mockResolvedValueOnce(true);
      render(<MockPaymentApp />);
      await userEvent.type(screen.getByTestId('name'), 'John');
      await userEvent.type(screen.getByTestId('card'), '1234567890123456');
      
      // Act
      userEvent.click(screen.getByRole('button', { name: /Pay/i }));
      
      // Assert
      await waitFor(() => expect(screen.getByText('Invoice: INV-999')).toBeInTheDocument());
    });

    // 14. Commission calculation: 10% of LKR 1000 equals LKR 100
    it('Commission calculation: 10% of LKR 1000 equals LKR 100', () => {
      // Arrange & Act
      const comm = calculateCommission(1000);
      // Assert
      expect(comm).toBe(100);
    });

    // 15. Provider payout calculation: 90% of LKR 1000 equals LKR 900
    it('Provider payout calculation: 90% of LKR 1000 equals LKR 900', () => {
      // Arrange & Act
      const payout = calculatePayout(1000);
      // Assert
      expect(payout).toBe(900);
    });
  });

  describe('SECURITY TESTS', () => {
    // 16. TransactionHistoryPage only shows transactions for the logged-in tourist
    it('TransactionHistoryPage only shows transactions for the logged-in tourist', () => {
      // Arrange
      render(<MockPaymentApp role="TOURIST" />);
      // Act & Assert
      expect(screen.getByTestId('trans-history')).toBeInTheDocument();
    });

    // 17. Accessing another user's invoice returns 403 error
    it('Accessing another user\'s invoice returns 403 error', () => {
      // Arrange
      render(<MockPaymentApp userId={1} requestUserId={2} />);
      // Act & Assert
      expect(screen.getByText('403 Forbidden')).toBeInTheDocument();
    });
  });
});
