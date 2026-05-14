import { Component, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);

  readonly shipping = computed(() => (this.cart.subtotal() > 100 ? 0 : 9.99));
  readonly total = computed(() => this.cart.subtotal() + this.shipping());
  readonly amountToFreeShipping = computed(() => +(100 - this.cart.subtotal()).toFixed(2));

  updateQty(id: string, qty: number) {
    this.cart.updateQty(id, qty);
  }

  removeItem(id: string) {
    this.cart.removeItem(id);
  }

  proceedToCheckout() {
    if (this.auth.user()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  itemImage(images?: string[]): string {
    return images?.[0] ?? 'https://placehold.co/80x80/13131c/c9a84c?text=V';
  }
}
