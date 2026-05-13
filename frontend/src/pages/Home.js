import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const MARQUEE_ITEMS = [
  'Handpicked for You', 'Rooted in Kashmir', 'Fast Delivery',
  'Easy Returns', 'Secure Checkout', 'Real People, Real Products',
  'Handpicked for You', 'Rooted in Kashmir', 'Fast Delivery',
  'Easy Returns', 'Secure Checkout', 'Real People, Real Products',
];

const VALUES = [
  { icon: '✦', title: 'Handpicked Quality', desc: 'Every item personally selected — nothing gets listed unless it earns its place.' },
  { icon: '◈', title: 'Fast Delivery',       desc: 'Shipped straight from our home, right to yours.' },
  { icon: '◇', title: 'Easy Returns',        desc: 'Not happy? We make returns simple, no questions asked.' },
];

const CATEGORIES = [
  { name: 'Dry Fruits',             emoji: '◉', desc: 'Walnuts, almonds, apricots & more from the valley' },
  { name: 'Saffron & Spices',       emoji: '✦', desc: 'Pure Kashmiri saffron and hand-ground spices' },
  { name: 'Honey & Herbal Teas',    emoji: '◇', desc: 'Wild mountain honey and Kashmiri kahwa blends' },
  { name: 'Pashmina & Shawls',      emoji: '◈', desc: 'Authentic handwoven Pashmina from local artisans' },
  { name: 'Handicrafts',            emoji: '✿', desc: 'Traditional papier-mâché, woodwork & copperware' },
  { name: 'Carpets & Rugs',         emoji: '❖', desc: 'Hand-knotted silk and wool carpets' },
  { name: 'Attar & Natural Oils',   emoji: '◎', desc: 'Pure botanical attars and essential oils' },
  { name: 'Sports Goods',           emoji: '◬', desc: 'Kashmir-made cricket bats and sporting gear' },
  { name: 'Fashion & Clothing',     emoji: '◆', desc: 'Kurtis, pherans, and contemporary Kashmiri wear' },
  { name: 'Home & Kitchen',         emoji: '⬡', desc: 'Copper samovar sets and handcrafted homeware' },
  { name: 'Beauty & Skincare',      emoji: '✧', desc: 'Saffron creams, walnut scrubs & natural care' },
  { name: 'Electronics & Accessories', emoji: '⚡', desc: 'Everyday tech and smart accessories' },
];

const STATS = [
  { value: '12K+', label: 'Happy Customers' },
  { value: '800+', label: 'Curated Products' },
  { value: '99%',  label: 'Satisfaction Rate' },
  { value: '4.9★', label: 'Average Rating' },
];

const TESTIMONIALS = [
  {
    name: 'Amara Singh',
    role: 'Interior Designer',
    avatar: 'AS',
    text: 'Vaer has completely changed how I source décor. The quality is impeccable and I love that I know exactly who is behind every order. Feels personal in the best way.',
    stars: 5,
  },
  {
    name: 'James Holloway',
    role: 'Tech Enthusiast',
    avatar: 'JH',
    text: "I've ordered from Vaer three times now. Every product has been exactly as described — great packaging, fast shipping, zero hassle returns. Will keep coming back.",
    stars: 5,
  },
  {
    name: 'Layla Noor',
    role: 'Fashion Blogger',
    avatar: 'LN',
    text: 'The curation feels so intentional. You can tell someone with real taste picked every item. My followers keep asking where I shop — and I always say Vaer.',
    stars: 5,
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    productAPI.getFeatured().then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  return (
    <main>
      {/* ── HERO ───────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroRing} />
        <div className={styles.heroRing} />
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Kashmir · India · Worldwide</p>
          <h1 className={styles.heroTitle}>VAER</h1>
          <p className={styles.heroTagline}>Your valley, your store.</p>
          <p className={styles.heroDesc}>
            A home-grown marketplace founded by Naseer Ahmad — bringing you handpicked products with the warmth and trust of a neighbour.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/products" className={styles.heroBtn}>Explore the Store</Link>
            <button
              className={styles.heroBtnGhost}
              onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >Get in Touch</button>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <div className={styles.heroScrollLine} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────── */}
      <div className={styles.marqueeStrip}>
        <div className={styles.marqueeInner}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ───────────────────────────────────── */}
      <section className={styles.statsSection}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ──────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionLabel}>Browse by</p>
            <h2 className={styles.sectionTitle}>Categories</h2>
          </div>
          <Link to="/products" className={styles.seeAll}>View All →</Link>
        </div>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryEmoji}>{cat.emoji}</span>
              <h3 className={styles.categoryName}>{cat.name}</h3>
              <p className={styles.categoryDesc}>{cat.desc}</p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>Handpicked for you</p>
              <h2 className={styles.sectionTitle}>Featured</h2>
            </div>
            <Link to="/products" className={styles.seeAll}>View All →</Link>
          </div>
          <div className={styles.grid}>
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── VALUE PROPS ─────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.valueGrid}>
          {VALUES.map(v => (
            <div key={v.title} className={styles.valueCard}>
              <div className={styles.valueIconWrap}>
                <span className={styles.valueIcon}>{v.icon}</span>
              </div>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className={styles.testimonialsSection}>
        <div className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>What people say</p>
              <h2 className={styles.sectionTitle}>Testimonials</h2>
            </div>
          </div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.stars)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.testimonialName}>{t.name}</p>
                    <p className={styles.testimonialRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────── */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterInner}>
          <p className={styles.newsletterLabel}>Stay connected</p>
          <h2 className={styles.newsletterTitle}>Join the Vaer Community</h2>
          <p className={styles.newsletterDesc}>
            Be the first to hear about new arrivals, exclusive deals, and stories from our valley — straight to your inbox.
          </p>
          {newsletterSent ? (
            <p className={styles.newsletterSuccess}>✦ Welcome to the community — you're in.</p>
          ) : (
            <form onSubmit={handleNewsletter} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterBtn}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────── */}
      <section className={styles.section} ref={contactRef} id="contact">
        <div className={styles.contactLayout}>
          <div className={styles.contactInfo}>
            <p className={styles.sectionLabel}>Get in touch</p>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.contactDesc}>
              Vaer is a home-grown store founded by Naseer Ahmad. Questions? Reach us at hello@vaer.store
            </p>
            <div className={styles.contactDetails}>
              {[
                { icon: '✉', label: 'Email',   value: 'hello@vaer.store' },
                { icon: '◎', label: 'Support', value: 'Mon – Fri, 9am – 6pm' },
                { icon: '◈', label: 'Returns', value: '30-day hassle-free policy' },
              ].map(d => (
                <div key={d.label} className={styles.contactDetail}>
                  <span className={styles.contactIcon}>{d.icon}</span>
                  <div>
                    <p className={styles.contactDetailLabel}>{d.label}</p>
                    <p className={styles.contactDetailValue}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactFormWrap}>
            {contactSent ? (
              <div className={styles.contactSuccess}>
                <span className={styles.contactSuccessIcon}>✦</span>
                <h3>Message received</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button onClick={() => setContactSent(false)} className={styles.contactSuccessBtn}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className={styles.contactForm}>
                <div className={styles.contactRow}>
                  <div className={styles.contactField}>
                    <label className={styles.fieldLabel}>Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.contactField}>
                    <label className={styles.fieldLabel}>Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className={styles.contactField}>
                  <label className={styles.fieldLabel}>Message</label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={styles.contactSubmit}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
