import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';

export interface Order {
  _id: string;
  items: {
    product?: { name?: string; images?: string[] };
    qty: number;
    price: number;
  }[];
  shippingAddress: unknown;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending:    { color: '#C4882A', label: 'Pending' },
  processing: { color: '#2563EB', label: 'Processing' },
  shipped:    { color: '#7C3AED', label: 'Shipped' },
  delivered:  { color: '#16A34A', label: 'Delivered' },
  cancelled:  { color: '#DC2626', label: 'Cancelled' },
};

const TIMELINE_STEPS = ['pending', 'processing', 'shipped', 'delivered'] as const;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders  = signal<Order[]>([]);
  loading = signal(true);

  readonly timelineSteps = TIMELINE_STEPS;
  readonly statusConfig  = STATUS_CONFIG;

  ngOnInit(): void {
    this.orderService.myOrders().subscribe({
      next: (data) => {
        this.orders.set(data as Order[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getStatusConfig(status: string) {
    return STATUS_CONFIG[status] ?? STATUS_CONFIG['pending'];
  }

  getStatusBadgeStyle(status: string): Record<string, string> {
    const cfg = this.getStatusConfig(status);
    return { color: cfg.color, borderColor: cfg.color + '40' };
  }

  isStepDone(order: Order, stepIndex: number): boolean {
    if (order.status === 'cancelled') return false;
    const currentIndex = TIMELINE_STEPS.indexOf(order.status as (typeof TIMELINE_STEPS)[number]);
    return stepIndex <= currentIndex;
  }

  isLineDone(order: Order, lineIndex: number): boolean {
    if (order.status === 'cancelled') return false;
    const currentIndex = TIMELINE_STEPS.indexOf(order.status as (typeof TIMELINE_STEPS)[number]);
    return lineIndex < currentIndex;
  }

  formatOrderId(id: string): string {
    return id.slice(-8).toUpperCase();
  }

  getItemImage(item: Order['items'][number]): string {
    return item.product?.images?.[0] ?? 'https://placehold.co/56x56/13131c/c9a84c?text=V';
  }
}
