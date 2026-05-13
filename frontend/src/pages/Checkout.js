import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import styles from './Checkout.module.css';

const STEPS = ['Shipping', 'Review', 'Confirm'];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', zip: '', country: '',
  });

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await orderAPI.create({
        items: items.map(i => ({ product: i._id, qty: i.qty, price: i.price })),
        shippingAddress: { ...form },
        total,
      });
      setOrderId(res.data._id);
      clearCart();
      setStep(2);
    } catch {
      alert('Order failed. Please try again.');
    }
    setPlacing(false);
  };

  if (items.length === 0 && step !== 2) return (
    <div className={styles.empty}>
      <span>◈</span>
      <h2>Your cart is empty</h2>
      <Link to="/products" className={styles.emptyBtn}>Continue Shopping</Link>
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Progress */}
      <div className={styles.progress}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`${styles.progressStep} ${i <= step ? styles.progressActive : ''}`}>
              <div className={styles.progressDot}>{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`${styles.progressLine} ${i < step ? styles.progressLineDone : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0 — Shipping */}
      {step === 0 && (
        <div className={styles.layout}>
          <div className={styles.formWrap}>
            <h2 className={styles.stepTitle}>Shipping Address</h2>
            <form className={styles.form} onSubmit={e => { e.preventDefault(); setStep(1); }}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handle} placeholder="John" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handle} placeholder="Doe" required />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Street Address</label>
                <input name="address" value={form.address} onChange={handle} placeholder="123 Main St" required />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>City</label>
                  <input name="city" value={form.city} onChange={handle} placeholder="New York" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>ZIP Code</label>
                  <input name="zip" value={form.zip} onChange={handle} placeholder="10001" required />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input name="country" value={form.country} onChange={handle} placeholder="United States" required />
              </div>
              <button type="submit" className={styles.nextBtn}>Continue to Review →</button>
            </form>
          </div>
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      )}

      {/* Step 1 — Review */}
      {step === 1 && (
        <div className={styles.layout}>
          <div className={styles.formWrap}>
            <h2 className={styles.stepTitle}>Review Order</h2>
            <div className={styles.reviewAddress}>
              <p className={styles.reviewLabel}>Shipping to</p>
              <p>{form.firstName} {form.lastName}</p>
              <p>{form.address}, {form.city} {form.zip}</p>
              <p>{form.country}</p>
              <button className={styles.editBtn} onClick={() => setStep(0)}>Edit</button>
            </div>
            <div className={styles.reviewNote}>
              <p className={styles.reviewLabel}>Payment</p>
              <p>Cash on Delivery (COD)</p>
            </div>
            <div className={styles.reviewActions}>
              <button className={styles.backBtn} onClick={() => setStep(0)}>← Back</button>
              <button className={styles.placeBtn} onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </div>
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      )}

      {/* Step 2 — Confirmed */}
      {step === 2 && (
        <div className={styles.confirmed}>
          <div className={styles.confirmedIcon}>✦</div>
          <h2 className={styles.confirmedTitle}>Order Confirmed!</h2>
          <p className={styles.confirmedSub}>
            Thank you for your order. We'll send a confirmation to <strong>{form.email}</strong>.
          </p>
          {orderId && (
            <p className={styles.confirmedId}>
              Order ID: <span>#{orderId.slice(-8).toUpperCase()}</span>
            </p>
          )}
          <div className={styles.confirmedActions}>
            <Link to="/orders" className={styles.ordersBtn}>View My Orders</Link>
            <Link to="/products" className={styles.shopMoreBtn}>Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <aside className={styles.summary}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>
      <div className={styles.summaryItems}>
        {items.map(item => (
          <div key={item._id} className={styles.summaryItem}>
            <img
              src={item.images?.[0] || 'https://placehold.co/44x44/13131c/c9a84c?text=V'}
              alt={item.name} className={styles.summaryImg}
            />
            <div className={styles.summaryItemInfo}>
              <p className={styles.summaryItemName}>{item.name}</p>
              <p className={styles.summaryItemQty}>×{item.qty}</p>
            </div>
            <p className={styles.summaryItemPrice}>${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
    </aside>
  );
}
