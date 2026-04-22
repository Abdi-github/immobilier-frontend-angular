import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { User } from '@core/models';
import { DashboardService } from '../../dashboard.service';
import { AuthStore } from '@state/auth.store';

@Component({
  selector: 'app-profile-page',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="max-w-xl">
      <h1 class="text-2xl font-bold mb-6">{{ 'dashboard.profile.title' | translate }}</h1>

      @if (saved()) {
        <div class="mb-4 rounded-lg bg-green-50 text-green-700 px-4 py-3 text-sm border border-green-200">
          {{ 'dashboard.profile.saved' | translate }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'dashboard.profile.firstName' | translate }}</mat-label>
            <input matInput formControlName="first_name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'dashboard.profile.lastName' | translate }}</mat-label>
            <input matInput formControlName="last_name" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'dashboard.profile.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'dashboard.profile.phone' | translate }}</mat-label>
          <input matInput formControlName="phone" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'dashboard.profile.language' | translate }}</mat-label>
          <mat-select formControlName="preferred_language">
            <mat-option value="en">English</mat-option>
            <mat-option value="fr">Français</mat-option>
            <mat-option value="de">Deutsch</mat-option>
            <mat-option value="it">Italiano</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          {{ 'dashboard.profile.save' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly saved = signal(false);

  form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    preferred_language: ['en'],
  });

  ngOnInit(): void {
    const user = this.authStore.user();
    if (user) {
      this.form.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone ?? '',
        preferred_language: user.preferred_language ?? 'en',
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.saved.set(false);
    this.dashboardService.updateProfile(this.form.getRawValue() as Partial<import('@core/models').User>).subscribe({
      next: (user) => {
        this.authStore.updateUser(user);
        this.saved.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
