import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ============================================
 * MEMBER 1 – User Management & Authentication
 * Student ID: IT24103772
 * ============================================
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '', role: 'TOURIST' as 'TOURIST' | 'PROVIDER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') {
        setError(Object.values(data.data).join('. '));
      } else {
        setError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🌴</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">GoCeylon</span>
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-text-secondary mt-2">Join the GoCeylon community</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface-light border border-white/5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(['TOURIST', 'PROVIDER'] as const).map(role => (
                <button key={role} type="button" onClick={() => setForm({ ...form, role })}
                  className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                    form.role === role
                      ? 'border-primary-light bg-primary/10 text-primary-light'
                      : 'border-white/10 text-text-secondary hover:border-white/20'
                  }`}>
                  <div className="text-xl mb-1">{role === 'TOURIST' ? '🧳' : '🏠'}</div>
                  <div className="text-sm font-medium">{role === 'TOURIST' ? 'Tourist' : 'Provider'}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">First Name</label>
              <input id="register-firstName" type="text" required value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none
                         focus:border-primary-light focus:ring-1 focus:ring-primary-light/50 transition-all"
                placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Last Name</label>
              <input id="register-lastName" type="text" required value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none
                         focus:border-primary-light focus:ring-1 focus:ring-primary-light/50 transition-all"
                placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input id="register-email" type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none
                       focus:border-primary-light focus:ring-1 focus:ring-primary-light/50 transition-all"
              placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <input id="register-password" type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none
                       focus:border-primary-light focus:ring-1 focus:ring-primary-light/50 transition-all"
              placeholder="Min 8 chars, uppercase, lowercase, digit, special" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone (Optional)</label>
            <input id="register-phone" type="tel" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none
                       focus:border-primary-light focus:ring-1 focus:ring-primary-light/50 transition-all"
              placeholder="+94 7X XXX XXXX" />
          </div>

          <button id="register-submit" type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-semibold
                     hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-light hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
