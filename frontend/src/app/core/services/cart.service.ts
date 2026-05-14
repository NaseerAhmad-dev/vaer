import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  qty: number;
  stock: number;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);
  readonly items = this.itemsSignal.asReadonly();

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, i) => sum + i.price * i.qty, 0)
  );

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((sum, i) => sum + i.qty, 0)
  );

  addItem(product: any, qty = 1) {
    this.itemsSignal.update(items => {
      const existing = items.find(i => i._id === product._id);
      if (existing) return items.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...items, { ...product, qty }];
    });
  }

  removeItem(id: string) {
    this.itemsSignal.update(items => items.filter(i => i._id !== id));
  }

  updateQty(id: string, qty: number) {
    if (qty < 1) { this.removeItem(id); return; }
    this.itemsSignal.update(items => items.map(i => i._id === id ? { ...i, qty } : i));
  }

  clearCart() { this.itemsSignal.set([]); }
}
