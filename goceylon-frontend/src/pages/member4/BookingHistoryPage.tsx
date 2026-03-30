import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Booking, ApiResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 */
export default function BookingHistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    const url = user?.role === 'PROVIDER' ? '/bookings/provider' : '/bookings';
    api.get<ApiResponse<Booking[]>>(url).then(r => setBookings(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const confirmBooking = async (id: number) => {
    try { await api.put(`/bookings/${id}/confirm`); load(); } catch {}
  };

  const cancelBooking = async (id: number) => {
    try { await api.put(`/bookings/${id}/cancel`); load(); } catch {}
  };

  const statusColor: Record<string, string> = {
    PENDING: 'text-warning bg-warning/10',
    CONFIRMED: 'text-primary-light bg-primary/10',
    CANCELLED: 'text-danger bg-danger/10',
    COMPLETED: 'text-success bg-success/10',
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{user?.role === 'PROVIDER' ? 'Received Bookings' : 'My Bookings'}</h1>
        <p className="text-text-secondary mb-8">{user?.role === 'PROVIDER' ? 'Manage booking requests' : 'View your booking history'}</p>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-text-secondary">No bookings yet</p>
            {user?.role !== 'PROVIDER' && <Link to="/activities" className="inline-block mt-4 text-primary-light hover:underline">Browse Activities</Link>}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="p-5 rounded-2xl bg-surface-light border border-white/5 hover:border-white/10 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-primary-light">{b.referenceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span>
                    </div>
                    <h3 className="font-semibold">{b.activityTitle}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-secondary">
                      <span>📅 {b.bookingDate}</span>
                      {b.timeSlot && <span>⏰ {b.timeSlot}</span>}
                      <span>👥 {b.numParticipants}</span>
                      <span className="text-secondary font-bold">${b.totalPrice}</span>
                    </div>
                    {user?.role === 'PROVIDER' && <p className="text-sm text-text-secondary mt-1">Tourist: {b.touristName}</p>}
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'PROVIDER' && b.status === 'PENDING' && (
                      <button onClick={() => confirmBooking(b.id)}
                        className="px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-all">
                        Confirm
                      </button>
                    )}
                    {b.status === 'CONFIRMED' && user?.role !== 'PROVIDER' && (
                      <Link to={`/pay/${b.id}`}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-secondary to-secondary-light text-surface text-sm font-medium hover:shadow-lg transition-all">
                        Pay Now
                      </Link>
                    )}
                    {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                      <button onClick={() => cancelBooking(b.id)}
                        className="px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-all">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
