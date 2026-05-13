import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logo}>VAER</span>
        <div className={styles.divider}><span>✦</span></div>
        <h2 className={styles.title}>Create account</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={submit} className={styles.form}>
          <input name="name"     type="text"     placeholder="Full Name" value={form.name}     onChange={handle} required />
          <input name="email"    type="email"    placeholder="Email"     value={form.email}    onChange={handle} required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handle} required />
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.link}>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
