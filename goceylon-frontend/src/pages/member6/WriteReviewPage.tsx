import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
export default function WriteReviewPage() {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId');
  const navigate = useNavigate();
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityId) { setError('Activity ID is required'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/reviews', {
        activityId: parseInt(activityId),
        rating: form.rating,
        comment: form.comment || null,
      });
      navigate(`/activities/${activityId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link to={activityId ? `/activities/${activityId}` : '/activities'}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6">← Back</Link>
        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
        <p className="text-text-secondary mb-8">Share your experience</p>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface-light border border-white/5 space-y-5">
          {error && <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all duration-200 ${
                    n <= form.rating ? 'bg-secondary/20 text-secondary scale-110' : 'bg-surface text-text-secondary hover:scale-105'
                  }`}>★</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Comment (optional)</label>
            <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={4}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all resize-none"
              placeholder="Tell us about your experience..." />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
