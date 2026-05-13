import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>VAER</Link>

        <div className={styles.links}>
          <Link to="/products">Shop</Link>
          {isAdmin && <Link to="/admin">Dashboard</Link>}
        </div>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn}>
            <span>Cart</span>
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <button onClick={() => setDropdownOpen(o => !o)} className={styles.userBtn}>
                {user.name.split(' ')[0]}
              </button>
              {dropdownOpen && (
                <>
                  <button aria-label="Close menu" className={styles.dropdownBackdrop} onClick={() => setDropdownOpen(false)} />
                  <div className={styles.dropdown}>
                    <Link to="/orders"  onClick={() => setDropdownOpen(false)}>My Orders</Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>

        <div className={styles.mobileRight}>
          <Link to="/cart" className={styles.mobileCartBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuInner}>
          <nav className={styles.mobileLinks}>
            <Link to="/products" className={styles.mobileLink}>Shop</Link>
            {isAdmin && <Link to="/admin" className={styles.mobileLink}>Dashboard</Link>}
            {user && <Link to="/orders"  className={styles.mobileLink}>My Orders</Link>}
            {user && <Link to="/profile" className={styles.mobileLink}>Profile</Link>}
          </nav>
          <div className={styles.mobileDivider} />
          <div className={styles.mobileAuth}>
            {user ? (
              <>
                <p className={styles.mobileUserName}>{user.name}</p>
                <button onClick={handleLogout} className={styles.mobileSignOut}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className={styles.mobilePrimaryBtn}>Sign In</Link>
                <Link to="/register" className={styles.mobileGhostBtn}>Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
      {mobileOpen && <button aria-label="Close mobile menu" className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </>
  );
}
