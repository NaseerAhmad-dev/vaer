import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getProfile() { return this.http.get<User>('/api/users/profile'); }
  updateProfile(data: any) { return this.http.put<User>('/api/users/profile', data); }
  getAll() { return this.http.get<any[]>('/api/users'); }
}
