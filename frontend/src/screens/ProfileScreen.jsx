import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { usersAPI } from '../api/client';

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [saving,  setSaving]  = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username.trim() || !formData.email.trim()) {
      setError('Username and email are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await usersAPI.update(user.id, {
        username: formData.username.trim(),
        email: formData.email.trim(),
      });
      updateUser(res.data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Update your account information</p>
        </div>
      </header>

      <div className="form-panel" style={{ maxWidth: 480 }}>
        <div className="form-panel-header">
          <h2 className="form-panel-title">Account details</h2>
        </div>

        {error   && <div className="form-error">{error}</div>}
        {success && (
          <div className="form-error" style={{ background: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="field">
            <label className="field-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="field-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="yourname"
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="field-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>

        <div style={{ padding: '0 0 16px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
          <p className="field-label" style={{ marginTop: 16 }}>Member since</p>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-CA')
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
