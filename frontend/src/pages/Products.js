import React, { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Products.module.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Decor', 'Food', 'Beauty', 'Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, category]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <p className={styles.titleLabel}>Browse</p>
            <h1 className={styles.title}>Collection</h1>
          </div>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>Search</button>
          </form>
        </div>
        <div className={styles.cats}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { setCategory(c === 'All' ? '' : c); setPage(1); }}
              className={`${styles.catBtn} ${(category === c || (c === 'All' && !category)) ? styles.active : ''}`}
            >{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
            <div className={styles.loadingDot} />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>No products found.</div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {pages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`${styles.pageBtn} ${page === i + 1 ? styles.activePage : ''}`}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
