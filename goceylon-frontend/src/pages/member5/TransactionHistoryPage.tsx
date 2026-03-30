import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Payment, ApiResponse } from '../../types';

/**
 * ============================================
 * MEMBER 5 – Payment Processing & Financial Management
 * Student ID: IT24103022
 * ============================================
 */
export default function TransactionHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Payment[]>>('/payments/history').then(r => setPayments(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-text-secondary mb-8">View all your payment records</p>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16"><div className="text-5xl mb-4">💳</div><p className="text-text-secondary">No transactions yet</p></div>
        ) : (
          <div className="space-y-4">
            {payments.map(p => (
              <div key={p.id} className="p-5 rounded-2xl bg-surface-light border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-text-secondary">{p.transactionId}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === 'COMPLETED' ? 'bg-success/10 text-success' : p.status === 'FAILED' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                  }`}>{p.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Booking: <span className="text-white">{p.bookingReference}</span></p>
                    <p className="text-xs text-text-secondary mt-1">{p.paymentMethod.replace('_', ' ')} • {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'Pending'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-secondary">${p.amount}</p>
                    <p className="text-xs text-text-secondary">Commission: ${p.commission}</p>
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
