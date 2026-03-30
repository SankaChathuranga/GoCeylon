import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Analytics, Review, User, ApiResponse } from '../../types';

/**
 * ============================================
 * MEMBER 6 – Review System & Admin Panel
 * Student ID: IT24103280
 * ============================================
 */
export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [flagged, setFlagged] = useState<Review[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'moderation'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, uRes, fRes] = await Promise.all([
        api.get<ApiResponse<Analytics>>('/admin/analytics'),
        api.get<ApiResponse<User[]>>('/admin/users'),
        api.get<ApiResponse<Review[]>>('/admin/flagged'),
      ]);
      setAnalytics(aRes.data.data);
      setUsers(uRes.data.data || []);
      setFlagged(fRes.data.data || []);
    } catch {}
    setLoading(false);
  };

  const toggleUserStatus = async (id: number, active: boolean) => {
    try { await api.put(`/admin/users/${id}/status?active=${active}`); load(); } catch {}
  };

  const removeReview = async (id: number) => {
    try {
      await api.post('/admin/moderate', { actionType: 'REVIEW_REMOVED', targetType: 'REVIEW', targetId: id, reason: 'Inappropriate content' });
      load();
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-text-secondary mb-8">Platform management and analytics</p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface-light border border-white/5 mb-8 max-w-md">
          {(['overview', 'users', 'moderation'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
                tab === t ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'
              }`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: analytics.totalUsers, icon: '👥', color: 'from-primary/20 to-primary/5' },
                { label: 'Tourists', value: analytics.totalTourists, icon: '🧳', color: 'from-accent/20 to-accent/5' },
                { label: 'Providers', value: analytics.totalProviders, icon: '🏠', color: 'from-secondary/20 to-secondary/5' },
                { label: 'Activities', value: analytics.totalActivities, icon: '🎯', color: 'from-primary/20 to-primary/5' },
                { label: 'Events', value: analytics.totalEvents, icon: '🎪', color: 'from-secondary/20 to-secondary/5' },
                { label: 'Total Bookings', value: analytics.totalBookings, icon: '📅', color: 'from-accent/20 to-accent/5' },
                { label: 'Pending Bookings', value: analytics.pendingBookings, icon: '⏳', color: 'from-warning/20 to-warning/5' },
                { label: 'Completed', value: analytics.completedBookings, icon: '✅', color: 'from-success/20 to-success/5' },
                { label: 'Total Reviews', value: analytics.totalReviews, icon: '⭐', color: 'from-secondary/20 to-secondary/5' },
                { label: 'Flagged', value: analytics.flaggedReviews, icon: '🚩', color: 'from-danger/20 to-danger/5' },
                { label: 'Avg Rating', value: analytics.averageRating, icon: '⭐', color: 'from-secondary/20 to-secondary/5' },
              ].map(s => (
                <div key={s.label} className={`p-5 rounded-2xl bg-gradient-to-br ${s.color} border border-white/5`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm text-text-secondary mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="p-4 rounded-xl bg-surface-light border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-bold text-sm">
                    {u.firstName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-sm text-text-secondary">{u.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary-light">{u.role}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button onClick={() => toggleUserStatus(u.id, !u.isActive)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    u.isActive ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'bg-success/10 text-success hover:bg-success/20'
                  }`}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'moderation' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Flagged Reviews ({flagged.length})</h3>
            {flagged.length === 0 ? (
              <div className="text-center py-10"><p className="text-text-secondary">No flagged content 🎉</p></div>
            ) : (
              <div className="space-y-3">
                {flagged.map(r => (
                  <div key={r.id} className="p-4 rounded-xl bg-surface-light border border-danger/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{r.touristName}</span>
                          <span className="text-secondary">{'★'.repeat(r.rating)}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-danger/10 text-danger">Flagged</span>
                        </div>
                        <p className="text-text-secondary text-sm">{r.comment}</p>
                        <p className="text-xs text-text-secondary mt-1">Activity: {r.activityTitle}</p>
                      </div>
                      <button onClick={() => removeReview(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-sm hover:bg-danger/20 transition-all">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
