import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  readonly auth  = inject(AuthService);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = signal(false);
  error   = signal('');

  submit(): void {
    if (this.form.invalid) return;
    this.error.set('');
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigateByUrl(res?.user?.role === 'admin' ? '/admin' : '/');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Login failed');
      },
    });
  }

  demoLogin(): void {
    this.auth.demoLogin();
    this.router.navigateByUrl('/admin');
  }
}
