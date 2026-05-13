import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>VAER</span>
        <div className={styles.divider}><span>✦</span></div>
        <h2 className={styles.title}>Welcome back</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={submit} className={styles.form}>
          <input name="email"    type="email"    placeholder="Email"    value={form.email}    onChange={handle} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required />
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.link}>No account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}
