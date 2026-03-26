import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export default function LoginScreen() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="brand-mark">TF</span>
            <span className="brand-name">TaskFlow</span>
          </div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Enter any email and password to continue</p>
        </div>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label className="field-label" htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" className="field-input"
              value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="field-input"
              value={formData.password} onChange={handleChange} placeholder="password123" required />
          </div>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}