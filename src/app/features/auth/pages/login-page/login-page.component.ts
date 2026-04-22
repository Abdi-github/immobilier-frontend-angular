import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 mb-3">{{ 'auth.login.title' | translate }}</h1>
        <p class="text-gray-600 text-lg">{{ 'auth.login.subtitle' | translate }}</p>
      </div>

      @if (error()) {
        <div class="mb-4 rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">{{ 'auth.login.email' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full [&_.mat-mdc-form-field-subscript-wrapper]:hidden">
            <input matInput type="email" formControlName="email" [placeholder]="'auth.login.emailPlaceholder' | translate" autocomplete="username" />
          </mat-form-field>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700">{{ 'auth.login.password' | translate }} *</label>
          <mat-form-field appearance="outline" class="w-full [&_.mat-mdc-form-field-subscript-wrapper]:hidden">
            <input matInput [type]="showPw ? 'text' : 'password'" formControlName="password" [placeholder]="'auth.login.passwordPlaceholder' | translate" autocomplete="current-password" />
            <button mat-icon-button matSuffix type="button" (click)="showPw = !showPw">
              <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <button type="submit" class="w-full h-12 rounded-lg bg-[#ef1d5e] text-white text-base font-medium transition-colors hover:bg-[#d91854] disabled:opacity-50" [disabled]="form.invalid || loading()">
          @if (loading()) { <mat-icon class="animate-spin text-base align-middle">refresh</mat-icon> }
          {{ 'auth.login.submit' | translate }}
        </button>

        <div class="flex justify-center">
          <a routerLink="/auth/forgot-password" class="text-sm text-[#ef1d5e] hover:underline">
            {{ 'auth.login.forgotPassword' | translate }}
          </a>
        </div>

        <div class="relative flex items-center gap-4 py-1">
          <div class="flex-1 border-t border-gray-200"></div>
          <span class="text-xs text-gray-400 uppercase tracking-wide">{{ 'auth.login.or' | translate }}</span>
          <div class="flex-1 border-t border-gray-200"></div>
        </div>

        <p class="text-center text-sm text-gray-600">
          {{ 'auth.login.noAccount' | translate }}
          <a routerLink="/auth/register" class="text-[#ef1d5e] font-semibold hover:underline">
            {{ 'auth.login.register' | translate }}
          </a>
        </p>
      </form>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  showPw = false;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.error.set(null);
    this.loading.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
