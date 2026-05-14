import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  private router = inject(Router);

  dropdownOpen = signal(false);
  mobileOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.mobileOpen.set(false);
      this.dropdownOpen.set(false);
    });
    effect(() => {
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    });
  }

  firstName() { return this.auth.user()?.name?.split(' ')[0] ?? ''; }
  toggleDropdown() { this.dropdownOpen.update(v => !v); }
  closeDropdown() { this.dropdownOpen.set(false); }
  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }
  logout() { this.auth.logout(); }
}
