import React, { useEffect, useState } from 'react';
import { productAPI, orderAPI, userAPI } from '../services/api';
import styles from './Admin.module.css';

export default function Admin() {
  const [stats, setStats]     = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [orders, setOrders]   = useState([]);
  const [tab, setTab]         = useState('overview');

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 1 }),
      orderAPI.getAll(),
      userAPI.getAll()
    ]).then(([pRes, oRes, uRes]) => {
      const revenue = oRes.data.reduce((s, o) => s + o.total, 0);
      setStats({
        products: pRes.data.total,
        orders:   oRes.data.length,
        users:    uRes.data.length,
        revenue
      });
      setOrders(oRes.data);
    }).catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    await orderAPI.setStatus(id, status);
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
  };

  const STATUS_COLORS = {
    pending: '#c9a84c', processing: '#378ADD', shipped: '#9F7AEA',
    delivered: '#48BB78', cancelled: '#e05252'
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.tabs}>
          {['overview', 'orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`${styles.tab} ${tab === t ? styles.activeTab : ''}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <div className={styles.statGrid}>
            {[
              { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}` },
              { label: 'Total Orders',  value: stats.orders },
              { label: 'Products',      value: stats.products },
              { label: 'Customers',     value: stats.users },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <p className={styles.statLabel}>{s.label}</p>
                <p className={styles.statValue}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className={styles.recentOrders}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <table className={styles.table}>
              <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o._id}>
                    <td className={styles.mono}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>{o.user?.name || '—'}</td>
                    <td>${o.total.toFixed(2)}</td>
                    <td><span className={styles.badge} style={{ color: STATUS_COLORS[o.status] }}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div className={styles.recentOrders}>
          <h2 className={styles.sectionTitle}>All Orders</h2>
          <table className={styles.table}>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td className={styles.mono}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td>{o.user?.name || '—'}</td>
                  <td>${o.total.toFixed(2)}</td>
                  <td><span className={styles.badge} style={{ color: STATUS_COLORS[o.status] }}>{o.status}</span></td>
                  <td>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      {['pending','processing','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
