import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  cart = inject(CartService);

  get img() {
    return this.product.images?.[0] || 'https://placehold.co/400x500/f2ead0/8B0020?text=NOOR';
  }

  addToCart(event?: Event) {
    if (event) event.preventDefault();
    this.cart.addItem(this.product);
  }
}
