import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Payout, ApiResponse } from '../../types';

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
export default function ProviderEarningsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Payout[]>>('/payouts/provider');
      setPayouts(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  const totalEarned = payouts.reduce((sum, p) => p.status === 'COMPLETED' ? sum + p.amount : sum, 0);
  const pendingAmount = payouts.reduce((sum, p) => p.status === 'PENDING' ? sum + p.amount : sum, 0);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Earnings & Payouts</h1>
        <p className="text-text-secondary mb-8">Track your revenue and scheduled payouts</p>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-3xl">💰</div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Earned</p>
              <h2 className="text-3xl font-bold text-success">${totalEarned.toFixed(2)}</h2>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center text-3xl">⏳</div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Pending Payouts</p>
              <h2 className="text-3xl font-bold text-warning">${pendingAmount.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>
        ) : payouts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💸</div>
            <p className="text-text-secondary">No recorded payouts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Payout History</h3>
            {payouts.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-surface-light border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${p.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {p.status === 'COMPLETED' ? '✔️' : '⌛'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">${p.amount.toFixed(2)}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Created: {new Date(p.createdAt).toLocaleDateString()}
                      {p.payoutDate && ` • Paid: ${new Date(p.payoutDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
