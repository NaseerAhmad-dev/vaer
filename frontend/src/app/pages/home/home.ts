import { Component, OnInit, signal, inject, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';
import { Product } from '../../core/services/product.service';

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
  { name: 'Dry Fruits',                emoji: '◉', desc: 'Walnuts, almonds, apricots & more from the valley' },
  { name: 'Saffron & Spices',          emoji: '✦', desc: 'Pure Kashmiri saffron and hand-ground spices' },
  { name: 'Honey & Herbal Teas',       emoji: '◇', desc: 'Wild mountain honey and Kashmiri kahwa blends' },
  { name: 'Pashmina & Shawls',         emoji: '◈', desc: 'Authentic handwoven Pashmina from local artisans' },
  { name: 'Handicrafts',               emoji: '✿', desc: 'Traditional papier-mâché, woodwork & copperware' },
  { name: 'Carpets & Rugs',            emoji: '❖', desc: 'Hand-knotted silk and wool carpets' },
  { name: 'Attar & Natural Oils',      emoji: '◎', desc: 'Pure botanical attars and essential oils' },
  { name: 'Sports Goods',              emoji: '◬', desc: 'Kashmir-made cricket bats and sporting gear' },
  { name: 'Fashion & Clothing',        emoji: '◆', desc: 'Kurtis, pherans, and contemporary Kashmiri wear' },
  { name: 'Home & Kitchen',            emoji: '⬡', desc: 'Copper samovar sets and handcrafted homeware' },
  { name: 'Beauty & Skincare',         emoji: '✧', desc: 'Saffron creams, walnut scrubs & natural care' },
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
    text: 'Noor has completely changed how I source décor. The quality is impeccable and I love that I know exactly who is behind every order. Feels personal in the best way.',
    stars: 5,
  },
  {
    name: 'James Holloway',
    role: 'Tech Enthusiast',
    avatar: 'JH',
    text: "I've ordered from Noor three times now. Every product has been exactly as described — great packaging, fast shipping, zero hassle returns. Will keep coming back.",
    stars: 5,
  },
  {
    name: 'Layla Noor',
    role: 'Fashion Blogger',
    avatar: 'LN',
    text: 'The curation feels so intentional. You can tell someone with real taste picked every item. My followers keep asking where I shop — and I always say Noor.',
    stars: 5,
  },
];

const CONTACT_DETAILS = [
  { icon: '✉', label: 'Email',   value: 'hello@noor.store' },
  { icon: '◎', label: 'Support', value: 'Mon – Fri, 9am – 6pm' },
  { icon: '◈', label: 'Returns', value: '30-day hassle-free policy' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  @ViewChild('contactSection') contactSection!: ElementRef<HTMLElement>;

  featured = signal<Product[]>([]);
  contactSent = signal(false);
  newsletterSent = signal(false);

  contactForm = signal({ name: '', email: '', message: '' });
  newsletterEmail = signal('');

  readonly marqueeItems = MARQUEE_ITEMS;
  readonly values = VALUES;
  readonly categories = CATEGORIES;
  readonly stats = STATS;
  readonly testimonials = TESTIMONIALS;
  readonly contactDetails = CONTACT_DETAILS;

  ngOnInit(): void {
    this.productService.getFeatured().subscribe({
      next: (products) => this.featured.set(products),
      error: () => {},
    });
  }

  starsString(count: number): string {
    return '★'.repeat(count);
  }

  scrollToContact(): void {
    this.contactSection?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  updateContactField(field: 'name' | 'email' | 'message', value: string): void {
    this.contactForm.update(f => ({ ...f, [field]: value }));
  }

  handleContact(event: Event): void {
    event.preventDefault();
    this.contactSent.set(true);
    this.contactForm.set({ name: '', email: '', message: '' });
  }

  handleNewsletter(event: Event): void {
    event.preventDefault();
    this.newsletterSent.set(true);
    this.newsletterEmail.set('');
  }

  resetContact(): void {
    this.contactSent.set(false);
  }

  encodeCategoryName(name: string): string {
    return encodeURIComponent(name);
  }
}
