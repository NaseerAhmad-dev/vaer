import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className={styles.empty}>
      <p>Your cart is empty.</p>
      <Link to="/products" className={styles.shopBtn}>Continue Shopping</Link>
    </div>
  );

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Cart</h1>
      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(item => (
            <div key={item._id} className={styles.item}>
              <img src={item.images?.[0] || 'https://placehold.co/80x80/13131c/c9a84c?text=V'} alt={item.name} className={styles.img} />
              <div className={styles.info}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>${item.price.toFixed(2)}</p>
              </div>
              <div className={styles.qty}>
                <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item._id)} className={styles.remove}>✕</button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          {shipping > 0 && <p className={styles.freeNote}>Add ${(100 - subtotal).toFixed(2)} more for free shipping</p>}
          <div className={`${styles.summaryRow} ${styles.total}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button
            className={styles.checkoutBtn}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
