import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Order {
  _id: string;
  items: { product: string; name: string; price: number; qty: number; image?: string }[];
  shippingAddress: { firstName: string; lastName: string; email: string; address: string; city: string; zip: string; country: string };
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  user?: any;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  create(data: any) { return this.http.post<Order>('/api/orders', data); }
  myOrders() { return this.http.get<Order[]>('/api/orders/myorders'); }
  getOne(id: string) { return this.http.get<Order>(`/api/orders/${id}`); }
  getAll() { return this.http.get<Order[]>('/api/orders'); }
  setStatus(id: string, status: string) { return this.http.put<Order>(`/api/orders/${id}/status`, { status }); }
}
