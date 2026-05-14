import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

const DEMO_USER: User = { _id: 'demo', name: 'Demo Admin', email: 'admin@noor.com', role: 'admin' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');
  readonly loading = signal(true);

  constructor() { this.init(); }

  private init() {
    if (localStorage.getItem('noor_demo')) {
      this.userSignal.set(DEMO_USER);
      this.loading.set(false);
      return;
    }
    const token = localStorage.getItem('noor_token');
    if (token) {
      this.http.get<User>('/api/auth/me').subscribe({
        next: u => { this.userSignal.set(u); this.loading.set(false); },
        error: () => { localStorage.removeItem('noor_token'); this.loading.set(false); }
      });
    } else {
      this.loading.set(false);
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: User }>('/api/auth/login', { email, password }).pipe(
      tap(res => { localStorage.setItem('noor_token', res.token); this.userSignal.set(res.user); })
    );
  }

  register(name: string, email: string, password: string) {
    return this.http.post<{ token: string; user: User }>('/api/auth/register', { name, email, password }).pipe(
      tap(res => { localStorage.setItem('noor_token', res.token); this.userSignal.set(res.user); })
    );
  }

  demoLogin() {
    localStorage.setItem('noor_demo', '1');
    this.userSignal.set(DEMO_USER);
  }

  logout() {
    localStorage.removeItem('noor_token');
    localStorage.removeItem('noor_demo');
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }
}
