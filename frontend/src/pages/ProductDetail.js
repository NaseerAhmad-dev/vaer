import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    productAPI.getOne(id)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingDots}>
        <div /><div /><div />
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images?.length ? product.images : ['https://placehold.co/600x700/13131c/c9a84c?text=VAER'];

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/products">Collection</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImg}>
            <img src={images[activeImg]} alt={product.name} />
            {product.stock === 0 && (
              <div className={styles.outOfStock}>Out of Stock</div>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={img}
                  className={`${styles.thumb} ${i === activeImg ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>

          <div className={styles.divider} />

          <p className={styles.desc}>{product.description || 'No description available.'}</p>

          <div className={styles.divider} />

          <div className={styles.stockRow}>
            <span className={product.stock > 0 ? styles.inStock : styles.outOfStockText}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyControl}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <Link to="/cart" className={styles.cartLink}>View Cart →</Link>
          </div>

          <div className={styles.meta}>
            {[
              { label: 'SKU',      value: `VEL-${product._id?.slice(-6).toUpperCase()}` },
              { label: 'Category', value: product.category },
            ].map(m => (
              <div key={m.label} className={styles.metaRow}>
                <span className={styles.metaLabel}>{m.label}</span>
                <span className={styles.metaValue}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
