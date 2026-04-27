import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Booking, Payment, ApiResponse } from '../../types';

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    paymentMethod: 'CREDIT_CARD', cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (bookingId) {
      api.get<ApiResponse<Booking>>(`/bookings/${bookingId}`).then(r => setBooking(r.data.data)).catch(() => navigate('/bookings'));
    }
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    if (form.paymentMethod === 'CREDIT_CARD' || form.paymentMethod === 'DEBIT_CARD') {
      const cardClean = form.cardNumber.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cardClean)) {
        setError('Card number must be 16 digits'); //validations
        setLoading(false);
        return;
      }
      if (form.cardHolderName.trim().length < 3) {
        setError('Card holder name must be at least 3 characters');
        setLoading(false);
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(form.expiryDate)) {
        setError('Expiry date must be in MM/YY format');
        setLoading(false);
        return;
      }
      if (!/^\d{3,4}$/.test(form.cvv)) {
        setError('CVV must be 3 or 4 digits');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.post<ApiResponse<Payment>>('/payments', {
        bookingId: parseInt(bookingId!),
        paymentMethod: form.paymentMethod,
        cardNumber: form.cardNumber, cardHolderName: form.cardHolderName,
        expiryDate: form.expiryDate, cvv: form.cvv,
      });
      setPayment(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  if (!booking) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>;

  if (payment) return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="p-8 rounded-2xl bg-surface-light border border-white/5">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold mb-2 text-success">Payment Successful!</h2>
          <div className="space-y-2 text-sm my-6">
            <p className="text-text-secondary">Transaction: <span className="text-white font-mono">{payment.transactionId}</span></p>
            <p className="text-text-secondary">Amount: <span className="text-secondary font-bold text-lg">${payment.amount}</span></p>
            <p className="text-text-secondary">Booking: <span className="text-white">{payment.bookingReference}</span></p>
            <p className="text-text-secondary">Method: <span className="text-white">{payment.paymentMethod.replace('_', ' ')}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/transactions" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium">View Transactions</Link>
            <Link to="/bookings" className="px-6 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-white">My Bookings</Link>
          </div>
        </div>
      </div>
    </div>
  );

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all";

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Payment</h1>
        <p className="text-text-secondary mb-8">Complete your booking for {booking.activityTitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} autoComplete="off" className="md:col-span-2 p-6 rounded-2xl bg-surface-light border border-white/5 space-y-5">
            {error && <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

            <div >
              
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className={inputClass}>
                <option value="CREDIT_CARD">💳 Credit Card</option>
                <option value="DEBIT_CARD">💳 Debit Card</option>
                <option value="BANK_TRANSFER">🏦 Bank Transfer</option>
                <option value="DIGITAL_WALLET">📱 Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Card Number</label>
              <input type="text" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} className={inputClass} placeholder="4242 4242 4242 4242" autoComplete="off" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Card Holder</label>
              <input type="text" value={form.cardHolderName} onChange={e => setForm({ ...form, cardHolderName: e.target.value })} className={inputClass} placeholder="John Doe" autoComplete="off" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Expiry</label>
                <input type="text" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className={inputClass} placeholder="MM/YY" autoComplete="off" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">CVV</label>
                <input type="text" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} className={inputClass} placeholder="123" autoComplete="off" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-secondary to-secondary-light text-surface font-semibold hover:shadow-lg hover:shadow-secondary/25 transition-all disabled:opacity-50">
              {loading ? 'Processing...' : `Pay $${booking.totalPrice}`}
            </button>
          </form>

          <div className="p-5 rounded-2xl bg-surface-light border border-white/5 h-fit">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Booking</span><span className="font-mono text-xs">{booking.referenceNumber}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Activity</span><span>{booking.activityTitle}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Date</span><span>{booking.bookingDate}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Participants</span><span>{booking.numParticipants}</span></div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-secondary">${booking.totalPrice}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
