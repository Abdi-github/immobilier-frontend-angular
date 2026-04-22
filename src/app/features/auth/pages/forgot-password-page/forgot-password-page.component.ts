import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [RouterLink, TranslateModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div>
      <h2 class="text-2xl font-bold mb-1">{{ 'auth.forgotPassword.title' | translate }}</h2>
      <p class="text-muted-foreground text-sm mb-6">{{ 'auth.forgotPassword.subtitle' | translate }}</p>

      @if (sent()) {
        <div class="py-8 text-center">
          <p class="text-green-600 font-medium">{{ 'auth.forgotPassword.sent' | translate }}</p>
          <a routerLink="/auth/login" mat-button class="mt-4">{{ 'auth.forgotPassword.backToLogin' | translate }}</a>
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'auth.forgotPassword.email' | translate }}</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" class="w-full h-12" [disabled]="form.invalid || loading()">
            {{ 'auth.forgotPassword.submit' | translate }}
          </button>
        </form>
        <p class="mt-4 text-center text-sm">
          <a routerLink="/auth/login" class="text-primary hover:underline">{{ 'auth.forgotPassword.backToLogin' | translate }}</a>
        </p>
      }
    </div>
  `,
})
export class ForgotPasswordPageComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly loading = signal(false);
  readonly sent = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: () => { this.sent.set(true); this.loading.set(false); },
      error: () => { this.sent.set(true); this.loading.set(false); }, // always show success (security)
    });
  }
}
