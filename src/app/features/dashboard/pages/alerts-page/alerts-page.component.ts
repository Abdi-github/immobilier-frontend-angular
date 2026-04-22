import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Alert } from '@core/models';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-alerts-page',
  imports: [TranslateModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">{{ 'dashboard.alerts.title' | translate }}</h1>

      @if (loading()) {
        <div class="space-y-3">
          @for (n of [1,2,3]; track n) {
            <div class="h-16 rounded-xl bg-muted animate-pulse"></div>
          }
        </div>
      } @else if (alerts().length === 0) {
        <div class="text-center py-16 text-muted-foreground">
          <mat-icon class="text-5xl opacity-30">notifications_none</mat-icon>
          <p class="mt-3">{{ 'dashboard.alerts.empty' | translate }}</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (alert of alerts(); track alert.id) {
            <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div>
                <p class="font-medium">{{ alert.name }}</p>
                <div class="flex flex-wrap gap-1 mt-2">
                  @if (alert.criteria.transaction_type) {
                    <mat-chip>{{ alert.criteria.transaction_type }}</mat-chip>
                  }
                  @if (alert.criteria.price_max) {
                    <mat-chip>max CHF {{ alert.criteria.price_max }}</mat-chip>
                  }
                </div>
              </div>
              <button mat-icon-button color="warn" (click)="deleteAlert(alert.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AlertsPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly alerts = signal<Alert[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getAlerts().subscribe({
      next: (alerts) => { this.alerts.set(alerts); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  deleteAlert(id: string): void {
    this.dashboardService.deleteAlert(id).subscribe(() => {
      this.alerts.update((list) => list.filter((a) => a.id !== id));
    });
  }
}
