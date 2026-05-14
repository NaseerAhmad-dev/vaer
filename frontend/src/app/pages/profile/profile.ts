import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

type Tab = 'info' | 'password';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const next    = control.get('next');
  const confirm = control.get('confirm');
  if (!next || !confirm) return null;
  return next.value !== confirm.value ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private fb          = inject(FormBuilder);
  readonly auth       = inject(AuthService);
  private userService = inject(UserService);

  activeTab = signal<Tab>('info');
  saving    = signal(false);
  saved     = signal(false);
  error     = signal('');

  infoForm = this.fb.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group(
    {
      next:    ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    },
    { validators: passwordsMatchValidator }
  );

  initials = computed(() => {
    const name = this.auth.user()?.name ?? '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  });

  ngOnInit(): void {
    const user = this.auth.user();
    if (user) {
      this.infoForm.patchValue({ name: user.name, email: user.email });
    }
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.error.set('');
    this.saved.set(false);
  }

  saveInfo(): void {
    if (this.infoForm.invalid) return;
    this.error.set('');
    this.saving.set(true);
    const { name, email } = this.infoForm.getRawValue();
    this.userService.updateProfile({ name, email }).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Update failed');
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('passwordsMismatch')) {
        this.error.set('Passwords do not match');
      }
      return;
    }
    this.error.set('');
    this.saving.set(true);
    const { next } = this.passwordForm.getRawValue();
    this.userService.updateProfile({ password: next }).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.passwordForm.reset();
        setTimeout(() => this.saved.set(false), 2500);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message || 'Update failed');
      },
    });
  }
}
