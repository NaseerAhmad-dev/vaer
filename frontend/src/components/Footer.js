import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const LINKS = {
  Shop:    [{ label: 'All Products', to: '/products' }, { label: 'Electronics', to: '/products?category=Electronics' }, { label: 'Fashion', to: '/products?category=Fashion' }, { label: 'Home & Decor', to: '/products?category=Home+%26+Decor' }],
  Account: [{ label: 'Sign In', to: '/login' }, { label: 'Create Account', to: '/register' }, { label: 'My Orders', to: '/orders' }, { label: 'Profile', to: '/profile' }],
  Support: [{ label: 'Contact Us', to: '/#contact' }, { label: 'Returns Policy', to: '/#contact' }, { label: 'Shipping Info', to: '/#contact' }, { label: 'FAQ', to: '/#contact' }],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>VAER</Link>
          <p className={styles.tagline}>Your valley, your store.</p>
          <p className={styles.copy}>A home-grown marketplace rooted in Kashmir — curated with love by Naseer Ahmad.</p>
          <p className={styles.meaning}>
            <span className={styles.meaningWord}>وإر</span>
            {' '}· Kashmiri for <em>marketplace</em>
          </p>
        </div>

        {Object.entries(LINKS).map(([group, links]) => (
          <div key={group} className={styles.col}>
            <h4 className={styles.colTitle}>{group}</h4>
            <ul className={styles.colList}>
              {links.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className={styles.colLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Vaer. Made with care in Kashmir.</p>
        <div className={styles.bottomLinks}>
          <span>Privacy Policy</span>
          <span>·</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
