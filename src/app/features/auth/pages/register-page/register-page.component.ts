import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

function matchPasswords(control: AbstractControl): ValidationErrors | null {
  const pw = control.get('password')?.value;
  const conf = control.get('password_confirmation')?.value;
  return pw && conf && pw !== conf ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-3">{{ 'auth.register.title' | translate }}</h1>
        <p class="text-gray-500 text-lg">{{ 'auth.register.subtitle' | translate }}</p>
      </div>

      @if (error()) {
        <div class="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{{ error() }}</div>
      }

      <!-- Individual / Professional toggle -->
      <div class="flex overflow-hidden rounded-lg border border-gray-200 mb-6 bg-gray-100">
        <button type="button"
          [class]="userCategory === 'individual'
            ? 'flex-1 py-2.5 text-sm font-medium bg-white text-gray-900 flex items-center justify-center gap-2 transition-colors shadow-sm'
            : 'flex-1 py-2.5 text-sm font-medium bg-transparent text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors'"
          (click)="setUserCategory('individual')">
          <mat-icon class="text-base leading-none">person</mat-icon>
          {{ 'auth.register.individual' | translate }}
        </button>
        <button type="button"
          [class]="userCategory === 'professional'
            ? 'flex-1 py-2.5 text-sm font-medium bg-white text-gray-900 flex items-center justify-center gap-2 transition-colors shadow-sm'
            : 'flex-1 py-2.5 text-sm font-medium bg-transparent text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors'"
          (click)="setUserCategory('professional')">
          <mat-icon class="text-base leading-none">business</mat-icon>
          {{ 'auth.register.professional' | translate }}
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <!-- First + Last name row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.firstName' | translate }} *</label>
            <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
              <input matInput formControlName="first_name" placeholder="John" />
            </mat-form-field>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.lastName' | translate }} *</label>
            <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
              <input matInput formControlName="last_name" placeholder="Doe" />
            </mat-form-field>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.email' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
            <input matInput type="email" formControlName="email" placeholder="{{ 'auth.register.emailPlaceholder' | translate }}" autocomplete="username" />
          </mat-form-field>
        </div>

        <!-- Confirm email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.confirmEmail' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
            <input matInput type="email" formControlName="email_confirmation" placeholder="{{ 'auth.register.confirmEmailPlaceholder' | translate }}" autocomplete="email" />
          </mat-form-field>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.password' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
            <input matInput [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="{{ 'auth.register.passwordPlaceholder' | translate }}" autocomplete="new-password" />
            <button mat-icon-button matSuffix type="button" (click)="showPw = !showPw" tabindex="-1">
              <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- Confirm password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.register.confirmPassword' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
            <input matInput [type]="showConfirmPw ? 'text' : 'password'" formControlName="password_confirmation" placeholder="{{ 'auth.register.confirmPasswordPlaceholder' | translate }}" autocomplete="new-password" />
            <button mat-icon-button matSuffix type="button" (click)="showConfirmPw = !showConfirmPw" tabindex="-1">
              <mat-icon>{{ showConfirmPw ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          @if (form.hasError('passwordMismatch') && form.get('password_confirmation')?.touched) {
            <p class="mt-1 text-xs text-red-600">{{ 'auth.register.passwordMismatch' | translate }}</p>
          }
        </div>

        <!-- Checkboxes -->
        <div class="space-y-2 pt-2">
          <mat-checkbox formControlName="twofa" color="primary">
            <span class="text-sm text-gray-700">{{ 'auth.register.twofa' | translate }}</span>
          </mat-checkbox>
          <mat-checkbox formControlName="newsletter" color="primary">
            <span class="text-sm text-gray-700">{{ 'auth.register.newsletter' | translate }}</span>
          </mat-checkbox>
          <mat-checkbox formControlName="terms" color="primary">
            <span class="text-sm text-gray-700">
              {{ 'auth.register.termsPrefix' | translate }}
              <a routerLink="/terms" class="text-primary hover:underline">{{ 'auth.register.terms' | translate }}</a>
              {{ 'auth.register.termsAnd' | translate }}
              <a routerLink="/privacy" class="text-primary hover:underline">{{ 'auth.register.privacy' | translate }}</a> *
            </span>
          </mat-checkbox>
        </div>

        <button type="submit" class="w-full h-12 mt-2 rounded-lg bg-[#ef1d5e] text-white text-base font-semibold transition-colors hover:bg-[#d91854] disabled:opacity-50"
          [disabled]="form.invalid || loading()">
          @if (loading()) { <mat-icon class="animate-spin text-base align-middle">refresh</mat-icon> }
          {{ 'auth.register.submit' | translate }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ 'auth.register.hasAccount' | translate }}
        <a routerLink="/auth/login" class="text-[#ef1d5e] hover:underline ml-1 font-medium">{{ 'auth.register.logIn' | translate }}</a>
      </p>
    </div>
  `,
})
export class RegisterPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  showPw = false;
  showConfirmPw = false;
  userCategory: 'individual' | 'professional' = 'individual';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      email_confirmation: ['', [Validators.required, Validators.email]],
      user_type: ['buyer_renter', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      twofa: [false],
      newsletter: [true],
      terms: [false, Validators.requiredTrue],
    },
    { validators: matchPasswords },
  );

  setUserCategory(category: 'individual' | 'professional'): void {
    this.userCategory = category;
    this.form.patchValue({
      user_type: category === 'professional' ? 'agent' : 'buyer_renter',
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.error.set(null);
    this.loading.set(true);
    const { password_confirmation, email_confirmation, twofa, newsletter, terms, ...payload } = this.form.getRawValue();
    this.authService.register({ ...payload, preferred_language: this.translate.currentLang }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err?.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
