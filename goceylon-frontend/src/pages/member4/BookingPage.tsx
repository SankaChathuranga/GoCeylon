import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Activity, ApiResponse, Booking } from '../../types';

/**
 * ============================================
 * MEMBER 4 – Booking & Reservation System
 * Student ID: IT24103207
 * ============================================
 */
export default function BookingPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [form, setForm] = useState({ bookingDate: '', timeSlot: '', numParticipants: '1', notes: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);

  useEffect(() => {
    if (activityId) {
      api.get<ApiResponse<Activity>>(`/activities/${activityId}`).then(r => setActivity(r.data.data)).catch(() => navigate('/activities'));
    }
  }, [activityId]);

  const totalPrice = activity ? activity.price * parseInt(form.numParticipants || '1') : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post<ApiResponse<Booking>>('/bookings', {
        activityId: parseInt(activityId!),
        bookingDate: form.bookingDate,
        timeSlot: form.timeSlot || null,
        numParticipants: parseInt(form.numParticipants),
        notes: form.notes || null,
      });
      setSuccess(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  if (!activity) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>;

  if (success) return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="p-8 rounded-2xl bg-surface-light border border-white/5">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Booking Created!</h2>
          <p className="text-text-secondary mb-6">Your reference number is:</p>
          <div className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary-light text-xl font-mono font-bold mb-6">
            {success.referenceNumber}
          </div>
          <div className="text-sm text-text-secondary space-y-1 mb-6">
            <p>Activity: {success.activityTitle}</p>
            <p>Date: {success.bookingDate}</p>
            <p>Status: <span className="text-secondary">{success.status}</span></p>
            <p>Total: <span className="text-secondary font-bold">${success.totalPrice}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/bookings" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium">View Bookings</Link>
            <Link to="/activities" className="px-6 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-white">Browse More</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to={`/activities/${activityId}`} className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6">← Back</Link>
        <h1 className="text-3xl font-bold mb-2">Book Activity</h1>
        <p className="text-text-secondary mb-8">{activity.title}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="md:col-span-2 p-6 rounded-2xl bg-surface-light border border-white/5 space-y-5">
            {error && <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Date *</label>
              <input type="date" required value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Preferred Time Slot</label>
              <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all">
                <option value="">Any time</option>
                <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Participants *</label>
              <input type="number" required min="1" max={activity.maxParticipants || 100}
                value={form.numParticipants} onChange={e => setForm({ ...form, numParticipants: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all resize-none"
                placeholder="Any special requirements?" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Confirm Booking'}
            </button>
          </form>

          {/* Summary */}
          <div className="p-5 rounded-2xl bg-surface-light border border-white/5 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Activity</span><span>{activity.title}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Price/person</span><span>${activity.price}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Participants</span><span>{form.numParticipants}</span></div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-secondary">${totalPrice.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
