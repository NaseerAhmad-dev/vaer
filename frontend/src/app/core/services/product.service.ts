import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(params?: any) {
    return this.http.get<{ products: Product[]; pages: number; page: number }>('/api/products', { params });
  }

  getFeatured() { return this.http.get<Product[]>('/api/products/featured'); }
  getOne(id: string) { return this.http.get<Product>(`/api/products/${id}`); }
  create(data: Partial<Product>) { return this.http.post<Product>('/api/products', data); }
  update(id: string, data: Partial<Product>) { return this.http.put<Product>(`/api/products/${id}`, data); }
  remove(id: string) { return this.http.delete<void>(`/api/products/${id}`); }
}
