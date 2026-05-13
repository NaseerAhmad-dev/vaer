import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const img = product.images?.[0] || 'https://placehold.co/400x500/13131c/c9a84c?text=VAER';

  return (
    <div className={styles.card}>
      <Link to={`/products/${product._id}`} className={styles.imgWrap}>
        <img src={img} alt={product.name} className={styles.img} loading="lazy" />
        {product.stock === 0 && <span className={styles.outOfStock}>Out of Stock</span>}
        <div className={styles.quickAdd}>
          <button
            className={styles.quickAddBtn}
            onClick={e => { e.preventDefault(); addItem(product); }}
            disabled={product.stock === 0}
          >
            Quick Add
          </button>
        </div>
      </Link>
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <Link to={`/products/${product._id}`} className={styles.name}>{product.name}</Link>
        <div className={styles.bottom}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            className={styles.addBtn}
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id:      PropTypes.string.isRequired,
    name:     PropTypes.string.isRequired,
    price:    PropTypes.number.isRequired,
    stock:    PropTypes.number.isRequired,
    category: PropTypes.string,
    images:   PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
