import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  year = new Date().getFullYear();

  linkGroups = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', path: '/products', params: null },
        { label: 'Dry Fruits', path: '/products', params: { category: 'Dry Fruits' } },
        { label: 'Saffron & Spices', path: '/products', params: { category: 'Saffron & Spices' } },
        { label: 'Pashmina & Shawls', path: '/products', params: { category: 'Pashmina & Shawls' } },
      ]
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', path: '/login', params: null },
        { label: 'Create Account', path: '/register', params: null },
        { label: 'My Orders', path: '/orders', params: null },
        { label: 'Profile', path: '/profile', params: null },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/', params: null },
        { label: 'Returns Policy', path: '/', params: null },
        { label: 'Shipping Info', path: '/', params: null },
        { label: 'FAQ', path: '/', params: null },
      ]
    }
  ];
}
