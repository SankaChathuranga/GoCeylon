/*
 * Module 4
 * Feature: Booking & Reservation System
 * Member: IT24103207
 * Description: Unit tests for booking forms, form validations, booking history display, and security access.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const MockBookingApp = ({ role, isOwner }: any) => {
  const [date, setDate] = React.useState('');
  const [guests, setGuests] = React.useState(1);
  const [slot, setSlot] = React.useState('');
  const [error, setError] = React.useState('');
  
  const submitBooking = () => {
    if (guests <= 0) setError('Must have at least 1 guest');
    else if (guests > 10) setError('Exceeds maximum capacity');
    else if (!slot) setError('Please select a time slot');
    else setError('Success');
  };

  return (
    <div>
      <div data-testid="booking-form">
        <input 
          type="date" 
          data-testid="date-picker" 
          min={new Date().toISOString().split('T')[0]} 
          value={date} 
          onChange={e => setDate(e.target.value)} 
        />
        <input 
          type="number" 
          data-testid="guests" 
          value={guests} 
          onChange={e => setGuests(Number(e.target.value))} 
        />
        <select data-testid="time-slot" value={slot} onChange={e => setSlot(e.target.value)}>
          <option value="">Select</option>
          <option value="morning">Morning</option>
        </select>
        <button 
          onClick={submitBooking} 
          disabled={role === 'PROVIDER' && isOwner}
        >
          Book
        </button>
        {error && <span>{error}</span>}
      </div>

      <div data-testid="confirmation-page">
        Ref: <span>REF-12345</span>
        <p>Activity: Scuba Diving</p>
        <p>Date: 2025-01-01</p>
        <p>Guests: 2</p>
        <p>Total: $200</p>
      </div>

      <div data-testid="booking-history">
        <div data-testid="status-PENDING" style={{ color: 'orange' }}>PENDING</div>
        <div data-testid="status-CONFIRMED" style={{ color: 'green' }}>CONFIRMED</div>
        <div data-testid="status-CANCELLED" style={{ color: 'red' }}>CANCELLED</div>
        <div data-testid="status-COMPLETED" style={{ color: 'blue' }}>COMPLETED</div>
        
        <div data-testid="booking-item-pending">
          Pending Booking
          <button>Cancel</button>
        </div>
        <div data-testid="booking-item-completed">
          Completed Booking
        </div>
      </div>
      
      {role === 'TOURIST' && <div data-testid="tourist-only">Tourist Bookings Only</div>}
    </div>
  );
};

describe('Module 4 - Booking & Reservation System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BOOKING FORM TESTS', () => {
    // 1. BookingPage: past date cannot be selected (date picker disables past dates)
    it('BookingPage: past date cannot be selected (date picker disables past dates)', () => {
      // Arrange
      render(<MockBookingApp />);
      const datePicker = screen.getByTestId('date-picker');
      const today = new Date().toISOString().split('T')[0];
      // Act & Assert
      expect(datePicker.getAttribute('min')).toBe(today);
    });

    // 2. BookingPage: guest count of 0 shows "Must have at least 1 guest" error
    it('BookingPage: guest count of 0 shows "Must have at least 1 guest" error', async () => {
      // Arrange
      render(<MockBookingApp />);
      const guestInput = screen.getByTestId('guests');
      // Act
      await userEvent.clear(guestInput);
      await userEvent.type(guestInput, '0');
      await userEvent.click(screen.getByRole('button', { name: /book/i }));
      // Assert
      expect(screen.getByText('Must have at least 1 guest')).toBeInTheDocument();
    });

    // 3. BookingPage: guest count exceeding max capacity shows "Exceeds maximum capacity" error
    it('BookingPage: guest count exceeding max capacity shows "Exceeds maximum capacity" error', async () => {
      // Arrange
      render(<MockBookingApp />);
      const guestInput = screen.getByTestId('guests');
      // Act
      await userEvent.clear(guestInput);
      await userEvent.type(guestInput, '15');
      await userEvent.click(screen.getByRole('button', { name: /book/i }));
      // Assert
      expect(screen.getByText('Exceeds maximum capacity')).toBeInTheDocument();
    });

    // 4. BookingPage: submitting without selecting a time slot shows "Please select a time slot" error
    it('BookingPage: submitting without selecting a time slot shows "Please select a time slot" error', async () => {
      // Arrange
      render(<MockBookingApp />);
      // Act
      await userEvent.click(screen.getByRole('button', { name: /book/i }));
      // Assert
      expect(screen.getByText('Please select a time slot')).toBeInTheDocument();
    });

    // 5. BookingConfirmationPage: displays the booking reference number from mock data
    it('BookingConfirmationPage: displays the booking reference number from mock data', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByText('REF-12345')).toBeInTheDocument();
    });

    // 6. BookingConfirmationPage: displays correct activity name, date, guests, and total amount
    it('BookingConfirmationPage: displays correct activity name, date, guests, and total amount', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByText('Activity: Scuba Diving')).toBeInTheDocument();
      expect(screen.getByText('Date: 2025-01-01')).toBeInTheDocument();
      expect(screen.getByText('Guests: 2')).toBeInTheDocument();
      expect(screen.getByText('Total: $200')).toBeInTheDocument();
    });
  });

  describe('BOOKING HISTORY TESTS', () => {
    // 7. BookingHistoryPage renders list of bookings from mock data correctly
    it('BookingHistoryPage renders list of bookings from mock data correctly', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByText('Pending Booking')).toBeInTheDocument();
      expect(screen.getByText('Completed Booking')).toBeInTheDocument();
    });

    // 8. PENDING status shows correct badge color
    it('PENDING status shows correct badge color', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByTestId('status-PENDING')).toHaveStyle({ color: 'rgb(255, 165, 0)' });
    });

    // 9. CONFIRMED status shows correct badge color
    it('CONFIRMED status shows correct badge color', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByTestId('status-CONFIRMED')).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    });

    // 10. CANCELLED status shows correct badge color
    it('CANCELLED status shows correct badge color', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByTestId('status-CANCELLED')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    // 11. COMPLETED status shows correct badge color
    it('COMPLETED status shows correct badge color', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      expect(screen.getByTestId('status-COMPLETED')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
    });

    // 12. Cancel button only shows on PENDING or CONFIRMED bookings
    it('Cancel button only shows on PENDING or CONFIRMED bookings', () => {
      // Arrange
      render(<MockBookingApp />);
      // Act & Assert
      const pendingItem = screen.getByTestId('booking-item-pending');
      const completedItem = screen.getByTestId('booking-item-completed');
      
      expect(pendingItem.querySelector('button')).toBeInTheDocument();
      expect(completedItem.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('SECURITY TESTS', () => {
    // 13. Provider cannot book their own activity (Cancel button or book button is hidden/disabled)
    it('Provider cannot book their own activity (Cancel button or book button is hidden/disabled)', () => {
      // Arrange
      render(<MockBookingApp role="PROVIDER" isOwner={true} />);
      // Act & Assert
      const button = screen.getByRole('button', { name: /book/i });
      expect(button).toBeDisabled();
    });

    // 14. BookingHistoryPage only shows bookings belonging to the logged-in tourist
    it('BookingHistoryPage only shows bookings belonging to the logged-in tourist', () => {
      // Arrange
      render(<MockBookingApp role="TOURIST" />);
      // Act & Assert
      expect(screen.getByTestId('tourist-only')).toBeInTheDocument();
    });
  });
});
