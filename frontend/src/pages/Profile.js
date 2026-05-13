import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('info');

  const handleInfo = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      await userAPI.updateProfile({ name: form.name, email: form.email });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setError('');
    if (passwords.next !== passwords.confirm) { setError('Passwords do not match'); return; }
    if (passwords.next.length < 6) { setError('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      await userAPI.updateProfile({ password: passwords.next });
      setSaved(true); setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.headerLabel}>Account</p>
        <h1 className={styles.title}>Profile</h1>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <nav className={styles.sideNav}>
            {[
              { key: 'info',     label: 'Personal Info' },
              { key: 'password', label: 'Change Password' },
            ].map(t => (
              <button
                key={t.key}
                className={`${styles.sideNavBtn} ${tab === t.key ? styles.sideNavActive : ''}`}
                onClick={() => { setTab(t.key); setError(''); setSaved(false); }}
              >{t.label}</button>
            ))}
          </nav>
        </aside>

        {/* Form area */}
        <div className={styles.formArea}>
          {error && <div className={styles.error}>{error}</div>}
          {saved && <div className={styles.success}>✓ Changes saved successfully</div>}

          {tab === 'info' && (
            <form onSubmit={handleInfo} className={styles.form}>
              <h2 className={styles.formTitle}>Personal Information</h2>
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Account Role</label>
                <input value={user?.role || 'customer'} readOnly className={styles.readOnly} />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={handlePassword} className={styles.form}>
              <h2 className={styles.formTitle}>Change Password</h2>
              <div className={styles.field}>
                <label className={styles.label}>New Password</label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repeat new password"
                  required
                />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
