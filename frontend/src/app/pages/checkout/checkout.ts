import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';

export const STEPS = ['Shipping', 'Review', 'Confirm'];

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);

  readonly steps = STEPS;
  readonly step = signal(0);
  readonly placing = signal(false);
  readonly orderId = signal<string | null>(null);

  readonly shipping = computed(() => (this.cart.subtotal() > 100 ? 0 : 9.99));
  readonly total = computed(() => this.cart.subtotal() + this.shipping());

  shippingForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    address:   ['', Validators.required],
    city:      ['', Validators.required],
    zip:       ['', Validators.required],
    country:   ['', Validators.required],
  });

  get f() { return this.shippingForm.controls; }

  submitShipping() {
    if (this.shippingForm.valid) {
      this.step.set(1);
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }

  goBack() {
    this.step.set(0);
  }

  placeOrder() {
    this.placing.set(true);
    const addr = this.shippingForm.value;
    this.orderService.create({
      items: this.cart.items().map(i => ({ product: i._id, qty: i.qty, price: i.price })),
      shippingAddress: { ...addr },
      total: this.total(),
    }).subscribe({
      next: (order) => {
        this.orderId.set(order._id);
        this.cart.clearCart();
        this.step.set(2);
        this.placing.set(false);
      },
      error: () => {
        alert('Order failed. Please try again.');
        this.placing.set(false);
      },
    });
  }

  itemImage(images?: string[]): string {
    return images?.[0] ?? 'https://placehold.co/44x44/13131c/c9a84c?text=V';
  }

  shortOrderId(id: string): string {
    return '#' + id.slice(-8).toUpperCase();
  }
}
