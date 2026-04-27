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
  const [invoiceMsg, setInvoiceMsg] = useState('');

  useEffect(() => {
    api.get<ApiResponse<Payment[]>>('/payments/history').then(r => setPayments(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDownloadInvoice = async (id: number) => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setInvoiceMsg(`Invoice ${res.data.data.invoiceNumber} downloaded successfully!`);
      setTimeout(() => setInvoiceMsg(''), 3000);
    } catch {
      setInvoiceMsg('Failed to download invoice.');
      setTimeout(() => setInvoiceMsg(''), 3000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-text-secondary mb-8">View all your payment records</p>
        
        {invoiceMsg && <div className="p-3 mb-6 rounded-lg bg-primary/10 text-primary-light border border-primary/20">{invoiceMsg}</div>}

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
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xl font-bold text-secondary">${p.amount}</p>
                    <p className="text-xs text-text-secondary mb-2">Commission: ${p.commission}</p>
                    {p.status === 'COMPLETED' && (
                      <button onClick={() => handleDownloadInvoice(p.id)} className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/10">
                        📄 Invoice
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
