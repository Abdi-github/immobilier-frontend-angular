import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../dashboard.service';
import { DashboardStats } from '@core/models';
import { AuthStore } from '@state/auth.store';


interface StatCard {
  labelKey: string;
  icon: string;
  value: () => string | number;
  color: string;
}

@Component({
  selector: 'app-overview-page',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule],
  template: `
    <div class="max-w-4xl">
      <h1 class="text-2xl font-bold mb-1">{{ 'dashboard.overview.title' | translate }}</h1>
      <p class="text-muted-foreground mb-8">
        {{ 'dashboard.overview.greeting' | translate : { name: authStore.fullName() } }}
      </p>

      @if (stats()) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          @for (card of statCards; track card.labelKey) {
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="flex items-center gap-3 mb-2">
                <div [class]="'p-2 rounded-lg ' + card.color">
                  <mat-icon class="text-white text-lg leading-none">{{ card.icon }}</mat-icon>
                </div>
              </div>
              <p class="text-2xl font-bold">{{ card.value() }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ card.labelKey | translate }}</p>
            </div>
          }
        </div>
      }

      <!-- Quick actions -->
      <h2 class="text-lg font-semibold mb-4">{{ 'dashboard.overview.quickActions' | translate }}</h2>
      <div class="flex flex-wrap gap-3">
        <a routerLink="/properties" mat-stroked-button>
          <mat-icon>search</mat-icon> {{ 'common.nav.properties' | translate }}
        </a>
        <a routerLink="/dashboard/favorites" mat-stroked-button>
          <mat-icon>favorite</mat-icon> {{ 'dashboard.nav.favorites' | translate }}
        </a>
        <a routerLink="/dashboard/alerts" mat-stroked-button>
          <mat-icon>notifications</mat-icon> {{ 'dashboard.nav.alerts' | translate }}
        </a>
        @if (authStore.isOwnerOrAgent()) {
          <a routerLink="/dashboard/properties" mat-flat-button color="primary">
            <mat-icon>add</mat-icon> {{ 'dashboard.properties.addNew' | translate }}
          </a>
        }
      </div>
    </div>
  `,
})
export class OverviewPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly authStore = inject(AuthStore);
  readonly stats = signal<DashboardStats | null>(null);

  readonly statCards: StatCard[] = [
    {
      labelKey: 'dashboard.overview.totalFavorites',
      icon: 'favorite',
      value: () => this.stats()?.total_favorites ?? 0,
      color: 'bg-red-500',
    },
    {
      labelKey: 'dashboard.overview.totalAlerts',
      icon: 'notifications',
      value: () => this.stats()?.total_alerts ?? 0,
      color: 'bg-blue-500',
    },
    {
      labelKey: 'dashboard.overview.totalProperties',
      icon: 'home_work',
      value: () => this.stats()?.total_properties ?? 0,
      color: 'bg-green-500',
    },
    {
      labelKey: 'dashboard.overview.totalInquiries',
      icon: 'mail',
      value: () => this.stats()?.total_inquiries ?? 0,
      color: 'bg-purple-500',
    },
  ];

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe((s) => this.stats.set(s));
  }
}
