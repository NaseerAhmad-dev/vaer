import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<Product | null>(null);
  loading = signal(true);
  activeImg = signal(0);
  qty = signal(1);
  added = signal(false);

  images = computed<string[]>(() => {
    const p = this.product();
    return p?.images?.length
      ? p.images
      : ['https://placehold.co/600x700/13131c/c9a84c?text=NOOR'];
  });

  sku = computed(() => {
    const p = this.product();
    if (!p) return '';
    return `VEL-${p._id?.slice(-6).toUpperCase()}`;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }
    this.productService.getOne(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.router.navigate(['/products']);
      },
    });
  }

  setActiveImg(index: number): void {
    this.activeImg.set(index);
  }

  decreaseQty(): void {
    this.qty.update(q => Math.max(1, q - 1));
  }

  increaseQty(): void {
    const stock = this.product()?.stock ?? 1;
    this.qty.update(q => Math.min(stock, q + 1));
  }

  handleAdd(): void {
    const product = this.product();
    if (!product) return;
    this.cartService.addItem(product, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }
}
