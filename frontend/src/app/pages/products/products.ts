import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

const CATEGORIES = [
  'All',
  'Dry Fruits',
  'Saffron & Spices',
  'Honey & Herbal Teas',
  'Pashmina & Shawls',
  'Handicrafts',
  'Carpets & Rugs',
  'Attar & Natural Oils',
  'Sports Goods',
  'Fashion & Clothing',
  'Home & Kitchen',
  'Beauty & Skincare',
  'Electronics & Accessories',
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;

  products = signal<Product[]>([]);
  loading = signal(true);
  search = signal('');
  category = signal('');
  page = signal(1);
  pages = signal(1);

  ngOnInit(): void {
    const cat = this.route.snapshot.queryParamMap.get('category');
    if (cat) {
      this.category.set(cat);
    }
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading.set(true);
    const params: Record<string, string | number> = { page: this.page(), limit: 12 };
    if (this.search()) params['search'] = this.search();
    if (this.category() && this.category() !== 'All') params['category'] = this.category();

    this.productService.getAll(params).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.pages.set(res.pages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  handleSearch(event: Event): void {
    event.preventDefault();
    this.page.set(1);
    this.fetchProducts();
  }

  selectCategory(cat: string): void {
    this.category.set(cat === 'All' ? '' : cat);
    this.page.set(1);
    this.fetchProducts();
  }

  isCategoryActive(cat: string): boolean {
    return this.category() === cat || (cat === 'All' && !this.category());
  }

  setPage(p: number): void {
    this.page.set(p);
    this.fetchProducts();
  }

  pageRange(): number[] {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  }
}
