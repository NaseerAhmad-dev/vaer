import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { AdminService } from '../../core/services/admin.service';
import { OrderService, Order } from '../../core/services/order.service';
import { ProductService, Product } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';

import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
type OrderStatus = typeof STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  pending:    '#C4882A',
  processing: '#378ADD',
  shipped:    '#9F7AEA',
  delivered:  '#48BB78',
  cancelled:  '#e05252',
};

const CATEGORIES = [
  'Dry Fruits', 'Saffron & Spices', 'Honey & Herbal Teas', 'Pashmina & Shawls',
  'Handicrafts', 'Carpets & Rugs', 'Attar & Natural Oils', 'Sports Goods',
  'Fashion & Clothing', 'Home & Kitchen', 'Beauty & Skincare', 'Electronics & Accessories',
];

const PER_PAGE = 10;

const EMPTY_FORM = {
  name: '', description: '', price: '' as string | number, category: CATEGORIES[0],
  stock: '' as string | number, images: '', tags: '', isFeatured: false,
};

const STATUS_TAB_OPTIONS = [
  { label: 'All', value: 'all' },
  ...STATUSES.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
];

type ActiveTab = 'dashboard' | 'orders' | 'products' | 'inventory' | 'customers';

const TAB_TITLES: Record<ActiveTab, string> = {
  dashboard: 'Dashboard',
  orders: 'Order Management',
  products: 'Products',
  inventory: 'Inventory',
  customers: 'Customers',
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    TableModule,
    TagModule,
    CardModule,
    Select,
    ButtonModule,
    InputTextModule,
    DialogModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  private adminService   = inject(AdminService);
  private orderService   = inject(OrderService);
  private productService = inject(ProductService);
  private userService    = inject(UserService);

  // ── Tab state ──────────────────────────────────────────────────────────────
  activeTab = signal<ActiveTab>('dashboard');

  // ── Data ───────────────────────────────────────────────────────────────────
  analytics   = signal<any>(null);
  orders      = signal<Order[]>([]);
  products    = signal<Product[]>([]);
  customers   = signal<any[]>([]);
  loading     = signal(true);

  // ── Search / filter state ──────────────────────────────────────────────────
  orderSearch    = signal('');
  orderStatus    = signal<string>('all');
  orderPage      = signal(1);
  productSearch  = signal('');
  productPage    = signal(1);
  customerSearch = signal('');
  invSearch      = signal('');

  // ── Modal state ────────────────────────────────────────────────────────────
  showProductModal = signal(false);
  showDeleteModal  = signal(false);
  isEditMode       = signal(false);
  editId           = signal<string | null>(null);
  deleteId         = signal<string | null>(null);
  deleteProductName = signal('');
  saving           = signal(false);
  formErr          = signal('');

  // ── Inline stock editing ───────────────────────────────────────────────────
  editingStock = signal<string | null>(null);
  newStock     = signal('');

  // ── Product form ───────────────────────────────────────────────────────────
  form = signal({ ...EMPTY_FORM });

  // ── Readonly constants exposed to template ─────────────────────────────────
  readonly statuses     = [...STATUSES];
  readonly categories   = CATEGORIES;
  readonly tabTitles    = TAB_TITLES;
  readonly statusColors = STATUS_COLORS;
  readonly statusTabOptions = STATUS_TAB_OPTIONS;
  readonly perPage = PER_PAGE;

  // ── Status Select options ──────────────────────────────────────────────────
  readonly statusSelectOptions = STATUSES.map(s => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s,
  }));

  // ── Charts ─────────────────────────────────────────────────────────────────
  revenueChartData  = signal<any>(null);
  revenueChartOptions = signal<any>(null);
  statusChartData   = signal<any>(null);
  statusChartOptions = signal<any>(null);
  topProductsChartData  = signal<any>(null);
  topProductsChartOptions = signal<any>(null);

  // ── Today's date ───────────────────────────────────────────────────────────
  readonly todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── Computed: filtered / paged data ───────────────────────────────────────
  filteredOrders = computed(() => {
    const q = this.orderSearch().toLowerCase();
    const s = this.orderStatus();
    return this.orders().filter(o => {
      const matchQ = !q || o._id.slice(-6).toLowerCase().includes(q) || (o.user?.name || '').toLowerCase().includes(q);
      const matchS = s === 'all' || o.status === s;
      return matchQ && matchS;
    });
  });

  pagedOrders = computed(() => {
    const page = this.orderPage();
    return this.filteredOrders().slice((page - 1) * PER_PAGE, page * PER_PAGE);
  });

  orderTotalPages = computed(() => Math.ceil(this.filteredOrders().length / PER_PAGE));

  filteredProducts = computed(() => {
    const q = this.productSearch().toLowerCase();
    return this.products().filter(p =>
      !q || p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
    );
  });

  pagedProducts = computed(() => {
    const page = this.productPage();
    return this.filteredProducts().slice((page - 1) * PER_PAGE, page * PER_PAGE);
  });

  productTotalPages = computed(() => Math.ceil(this.filteredProducts().length / PER_PAGE));

  filteredCustomers = computed(() => {
    const q = this.customerSearch().toLowerCase();
    return this.customers().filter(c =>
      !q || (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q)
    );
  });

  filteredInventory = computed(() => {
    const q = this.invSearch().toLowerCase();
    return this.products()
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => a.stock - b.stock);
  });

  // ── Inventory KPI counts ───────────────────────────────────────────────────
  inStock  = computed(() => this.products().filter(p => p.stock > 10).length);
  lowStock = computed(() => this.products().filter(p => p.stock > 0 && p.stock <= 10).length);
  outStock = computed(() => this.products().filter(p => p.stock === 0).length);

  // ── Order count / spend maps ───────────────────────────────────────────────
  orderCountMap = computed(() => {
    return this.orders().reduce((acc: Record<string, number>, o) => {
      const uid = o.user?._id || o.user;
      if (uid) acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {});
  });

  spendMap = computed(() => {
    return this.orders().reduce((acc: Record<string, number>, o) => {
      if (o.status === 'cancelled') return acc;
      const uid = o.user?._id || o.user;
      if (uid) acc[uid] = (acc[uid] || 0) + o.total;
      return acc;
    }, {});
  });

  // ── Status count helper (for tabs) ────────────────────────────────────────
  statusCount(s: string): number {
    if (s === 'all') return this.orders().length;
    return this.orders().filter(o => o.status === s).length;
  }

  // ── Page range for paginator ───────────────────────────────────────────────
  pageRange(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // ── Tab helpers ────────────────────────────────────────────────────────────
  setTab(tab: ActiveTab): void { this.activeTab.set(tab); }
  get currentTabTitle(): string { return TAB_TITLES[this.activeTab()]; }

  // ── Data loading ───────────────────────────────────────────────────────────
  ngOnInit(): void {
    forkJoin({
      analytics: this.adminService.getAnalytics(),
      orders:    this.orderService.getAll(),
      products:  this.productService.getAll({ limit: 999 }),
      users:     this.userService.getAll(),
    }).subscribe({
      next: ({ analytics, orders, products, users }) => {
        this.analytics.set(analytics);
        this.orders.set(Array.isArray(orders) ? orders : []);
        this.products.set((products as any)?.products || []);
        this.customers.set((Array.isArray(users) ? users : []).filter((u: any) => u.role === 'customer'));
        this.buildCharts();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // ── Chart builders ─────────────────────────────────────────────────────────
  private buildCharts(): void {
    const analytics = this.analytics();

    // Revenue line chart
    const revenueByMonth: { month: string; revenue: number }[] = analytics?.revenueByMonth || [];
    this.revenueChartData.set({
      labels: revenueByMonth.map(r => r.month),
      datasets: [{
        label: 'Revenue',
        data: revenueByMonth.map(r => r.revenue),
        borderColor: '#8B0020',
        backgroundColor: 'rgba(139,0,32,0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#8B0020',
      }],
    });
    this.revenueChartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: 'rgba(139,0,32,0.08)' }, ticks: { color: 'rgba(90,50,25,0.55)', font: { size: 11 } } },
        y: { grid: { color: 'rgba(139,0,32,0.08)' }, ticks: { color: 'rgba(90,50,25,0.55)', font: { size: 11 }, callback: (v: number) => `$${v}` } },
      },
    });

    // Order Status doughnut chart
    const statusData: any = analytics?.ordersByStatus || {};
    const statusLabels = Object.keys(statusData);
    const statusValues = statusLabels.map(k => statusData[k]);
    this.statusChartData.set({
      labels: statusLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{
        data: statusValues,
        backgroundColor: statusLabels.map(l => STATUS_COLORS[l] || '#888'),
        borderWidth: 2,
        borderColor: 'transparent',
        hoverOffset: 6,
      }],
    });
    this.statusChartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { color: 'rgba(90,50,25,0.7)', font: { size: 11 }, padding: 14 } },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}` } },
      },
    });

    // Top Products bar chart
    const topProducts: { name: string; revenue: number; orders: number }[] = analytics?.topProducts || [];
    this.topProductsChartData.set({
      labels: topProducts.map(p => p.name),
      datasets: [{
        label: 'Revenue',
        data: topProducts.map(p => p.revenue),
        backgroundColor: '#C4882A',
        borderRadius: 4,
        maxBarThickness: 60,
      }],
    });
    this.topProductsChartOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` $${ctx.parsed.y.toFixed(2)}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(90,50,25,0.55)', font: { size: 10 }, maxRotation: 20 } },
        y: { grid: { color: 'rgba(139,0,32,0.08)' }, ticks: { color: 'rgba(90,50,25,0.55)', font: { size: 11 }, callback: (v: number) => `$${v}` } },
      },
    });
  }

  // ── Order handlers ─────────────────────────────────────────────────────────
  setOrderStatus(id: string, status: string): void {
    this.orderService.setStatus(id, status).subscribe({
      next: () => {
        this.orders.update(prev => prev.map(o => o._id === id ? { ...o, status: status as any } : o));
      },
      error: () => {},
    });
  }

  setOrderStatusChange(id: string, event: any): void {
    const status = event?.value ?? event;
    if (status) this.setOrderStatus(id, status);
  }

  getOrderStatusValue(order: Order): string { return order.status; }

  // ── Product modal handlers ─────────────────────────────────────────────────
  openAdd(): void {
    this.form.set({ ...EMPTY_FORM });
    this.formErr.set('');
    this.editId.set(null);
    this.isEditMode.set(false);
    this.showProductModal.set(true);
  }

  openEdit(p: Product): void {
    this.form.set({
      name:        p.name,
      description: p.description || '',
      price:       p.price,
      category:    p.category || CATEGORIES[0],
      stock:       p.stock,
      images:      (p.images || []).join(', '),
      tags:        (p.tags   || []).join(', '),
      isFeatured:  p.isFeatured || false,
    });
    this.formErr.set('');
    this.editId.set(p._id);
    this.isEditMode.set(true);
    this.showProductModal.set(true);
  }

  closeProductModal(): void { this.showProductModal.set(false); }

  saveProduct(): void {
    const f = this.form();
    if (!f.name.toString().trim() || !f.price || !f.category || f.stock === '') {
      this.formErr.set('Name, price, category and stock are required.');
      return;
    }
    this.saving.set(true);
    this.formErr.set('');

    const imagesRaw = f.images.toString();
    const tagsRaw   = f.tags.toString();

    const payload: Partial<Product> = {
      name:        f.name.toString().trim(),
      description: f.description.toString().trim(),
      price:       Number(f.price),
      category:    f.category,
      stock:       Number(f.stock),
      isFeatured:  f.isFeatured,
      images:      imagesRaw ? imagesRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags:        tagsRaw   ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean)   : [],
    };

    if (!this.isEditMode()) {
      this.productService.create(payload).subscribe({
        next: (p) => {
          this.products.update(prev => [p, ...prev]);
          this.saving.set(false);
          this.showProductModal.set(false);
        },
        error: (err) => {
          this.formErr.set(err?.error?.message || 'Save failed. Please try again.');
          this.saving.set(false);
        },
      });
    } else {
      const id = this.editId()!;
      this.productService.update(id, payload).subscribe({
        next: (p) => {
          this.products.update(prev => prev.map(x => x._id === id ? p : x));
          this.saving.set(false);
          this.showProductModal.set(false);
        },
        error: (err) => {
          this.formErr.set(err?.error?.message || 'Save failed. Please try again.');
          this.saving.set(false);
        },
      });
    }
  }

  // ── Delete handlers ────────────────────────────────────────────────────────
  openDelete(p: Product): void {
    this.deleteId.set(p._id);
    this.deleteProductName.set(p.name);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void { this.showDeleteModal.set(false); }

  confirmDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.productService.remove(id).subscribe({
      next: () => {
        this.products.update(prev => prev.filter(p => p._id !== id));
        this.showDeleteModal.set(false);
      },
      error: () => this.showDeleteModal.set(false),
    });
  }

  // ── Inline stock edit ──────────────────────────────────────────────────────
  startEditStock(p: Product): void {
    this.editingStock.set(p._id);
    this.newStock.set(String(p.stock));
  }

  cancelEditStock(): void { this.editingStock.set(null); }

  saveStock(productId: string): void {
    const stock = Number(this.newStock());
    if (isNaN(stock) || stock < 0) return;
    this.productService.update(productId, { stock }).subscribe({
      next: () => {
        this.products.update(prev => prev.map(p => p._id === productId ? { ...p, stock } : p));
        this.editingStock.set(null);
      },
      error: () => this.editingStock.set(null),
    });
  }

  // ── Form field helper ──────────────────────────────────────────────────────
  setField(key: keyof typeof EMPTY_FORM, val: any): void {
    this.form.update(f => ({ ...f, [key]: val }));
  }

  // ── Status severity (PrimeNG Tag) ──────────────────────────────────────────
  getSeverity(status: string): 'warn' | 'info' | 'secondary' | 'success' | 'danger' | undefined {
    const map: Record<string, 'warn' | 'info' | 'secondary' | 'success' | 'danger'> = {
      pending:    'warn',
      processing: 'info',
      shipped:    'secondary',
      delivered:  'success',
      cancelled:  'danger',
    };
    return map[status];
  }

  // ── Stock level label ──────────────────────────────────────────────────────
  stockLabel(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  }

  stockColor(stock: number): string {
    if (stock === 0) return '#e05252';
    if (stock <= 10) return '#C4882A';
    return '#48BB78';
  }

  stockClass(stock: number): string {
    if (stock === 0) return 'stockOut';
    if (stock <= 10) return 'stockLow';
    return 'stockOk';
  }

  stockPct(stock: number): number {
    return Math.min(100, stock);
  }

  // ── Inventory KPI cards ────────────────────────────────────────────────────
  readonly invKpis = computed(() => [
    { label: 'Total SKUs',   value: this.products().length, color: 'var(--gold)'   },
    { label: 'In Stock',     value: this.inStock(),         color: '#48BB78'       },
    { label: 'Low Stock',    value: this.lowStock(),        color: '#C4882A'       },
    { label: 'Out of Stock', value: this.outStock(),        color: '#e05252'       },
  ]);

  // ── Dashboard KPI cards ───────────────────────────────────────────────────
  readonly dashKpis = computed(() => {
    const ov = this.analytics()?.overview || {};
    return [
      { label: 'Total Revenue', value: `$${(ov.totalRevenue || 0).toFixed(2)}`, icon: 'pi pi-dollar'    },
      { label: 'Total Orders',  value: ov.totalOrders   || 0,                   icon: 'pi pi-file-edit'  },
      { label: 'Products',      value: ov.totalProducts || 0,                   icon: 'pi pi-box'        },
      { label: 'Customers',     value: ov.totalCustomers || 0,                  icon: 'pi pi-users'      },
    ];
  });

  // ── Pagination helpers ─────────────────────────────────────────────────────
  prevOrderPage(): void  { this.orderPage.update(p => Math.max(1, p - 1)); }
  nextOrderPage(): void  { this.orderPage.update(p => Math.min(this.orderTotalPages(), p + 1)); }
  goOrderPage(n: number): void { this.orderPage.set(n); }

  prevProductPage(): void  { this.productPage.update(p => Math.max(1, p - 1)); }
  nextProductPage(): void  { this.productPage.update(p => Math.min(this.productTotalPages(), p + 1)); }
  goProductPage(n: number): void { this.productPage.set(n); }

  onOrderSearchChange(val: string): void { this.orderSearch.set(val); this.orderPage.set(1); }
  onOrderStatusFilter(val: string): void { this.orderStatus.set(val); this.orderPage.set(1); }
  onProductSearchChange(val: string): void { this.productSearch.set(val); this.productPage.set(1); }

  // ── Utility ───────────────────────────────────────────────────────────────
  formatDate(d: string): string {
    return new Date(d).toLocaleDateString();
  }

  formatCurrency(n: number): string {
    return `$${Number(n).toFixed(2)}`;
  }

  orderId(id: string): string {
    return '#' + id.slice(-6).toUpperCase();
  }

  customerInitial(name: string): string {
    return (name?.[0] || '?').toUpperCase();
  }

  getOrderStatusModel(order: Order): { label: string; value: string } {
    return { label: order.status.charAt(0).toUpperCase() + order.status.slice(1), value: order.status };
  }

  trackById(_: number, item: any): string { return item._id; }
}
