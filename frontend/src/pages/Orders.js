import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import styles from './Orders.module.css';

const STATUS_CONFIG = {
  pending:    { color: '#c9a84c', label: 'Pending' },
  processing: { color: '#378ADD', label: 'Processing' },
  shipped:    { color: '#9F7AEA', label: 'Shipped' },
  delivered:  { color: '#5cb88a', label: 'Delivered' },
  cancelled:  { color: '#e05252', label: 'Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.myOrders()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingDots}><div /><div /><div /></div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.headerLabel}>Account</p>
        <h1 className={styles.title}>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>◈</span>
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here.</p>
          <Link to="/products" className={styles.shopBtn}>Start Shopping</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <div>
                    <p className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={styles.statusBadge} style={{ color: cfg.color, borderColor: cfg.color + '40' }}>
                    {cfg.label}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.items?.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <img
                        src={item.product?.images?.[0] || 'https://placehold.co/56x56/13131c/c9a84c?text=V'}
                        alt={item.product?.name || 'Product'}
                        className={styles.itemImg}
                      />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.product?.name || 'Product'}</p>
                        <p className={styles.itemQty}>Qty: {item.qty}</p>
                      </div>
                      <p className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderProgress}>
                    {['pending','processing','shipped','delivered'].map((s, i) => {
                      const steps = ['pending','processing','shipped','delivered'];
                      const current = steps.indexOf(order.status);
                      const done = i <= current && order.status !== 'cancelled';
                      return (
                        <React.Fragment key={s}>
                          <div className={`${styles.step} ${done ? styles.stepDone : ''}`}>
                            <div className={styles.stepDot} />
                            <span>{STATUS_CONFIG[s]?.label}</span>
                          </div>
                          {i < 3 && <div className={`${styles.stepLine} ${i < current && order.status !== 'cancelled' ? styles.stepLineDone : ''}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <p className={styles.orderTotal}>
                    Total: <strong>${order.total?.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
