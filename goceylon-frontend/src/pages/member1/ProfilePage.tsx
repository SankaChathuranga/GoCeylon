import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { User, ApiResponse } from '../../types';

/**
 * ============================================
 * MEMBER 1 – User Management & Authentication
 * Student ID: IT24103772
 * ============================================
 */
export default function ProfilePage() {
  const { user, fetchProfile, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', bio: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get<ApiResponse<User>>('/users/profile');
      setProfile(res.data.data);
      setForm({
        firstName: res.data.data.firstName,
        lastName: res.data.data.lastName,
        phone: res.data.data.phone || '',
        bio: res.data.data.bio || '',
      });
    } catch {}
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      const res = await api.put<ApiResponse<User>>('/users/profile', form);
      setProfile(res.data.data);
      setEditing(false);
      setMsg('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg('');
    try {
      await api.put('/users/password', pwForm);
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPwMsg(err.response?.data?.message || 'Password change failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    if (!window.confirm('Are you strictly sure you want to deactivate your account? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${profile.id}`);
      logout();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
    }
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* Profile Card */}
        <div className="p-8 rounded-2xl bg-surface-light border border-white/5">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-3xl font-bold">
              {profile.firstName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-text-secondary">{profile.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary-light">{profile.role}</span>
                {profile.isVerified && <span className="px-2 py-0.5 text-xs rounded-full bg-success/10 text-success">Verified</span>}
              </div>
            </div>
          </div>

          {msg && <div className="p-3 mb-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm">{msg}</div>}
          {error && <div className="p-3 mb-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                  <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                  <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium hover:shadow-lg transition-all">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-white transition-all">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Phone:</span>
                <span>{profile.phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Bio:</span>
                <span className="text-right max-w-xs">{profile.bio || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Member since:</span>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <button onClick={() => setEditing(true)}
                className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white font-medium hover:shadow-lg transition-all">
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="p-8 rounded-2xl bg-surface-light border border-white/5">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          {pwMsg && <div className="p-3 mb-4 rounded-lg bg-primary/10 border border-primary/20 text-primary-light text-sm">{pwMsg}</div>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Current Password</label>
              <input type="password" required value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">New Password</label>
              <input type="password" required value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-white outline-none focus:border-primary-light transition-all"
                placeholder="Min 8 chars, uppercase, lowercase, digit, special" />
            </div>
            <button type="submit"
              className="px-6 py-2 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:border-primary-light transition-all">
              Update Password
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="p-8 rounded-2xl bg-danger/5 border border-danger/10">
          <h3 className="text-lg font-semibold text-danger mb-2">Danger Zone</h3>
          <p className="text-sm text-text-secondary mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={handleDeleteAccount}
            className="px-6 py-2 rounded-lg bg-danger/10 text-danger font-medium hover:bg-danger/20 transition-all border border-danger/20">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
