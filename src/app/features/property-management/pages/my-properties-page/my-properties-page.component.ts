import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Property } from '@core/models';
import { DashboardService } from '@features/dashboard/dashboard.service';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';
import { CurrencyChfPipe } from '@shared/pipes/currency-chf.pipe';

@Component({
  selector: 'app-my-properties-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    LocalizedFieldPipe,
    CurrencyChfPipe,
  ],
  template: `
    <div class="max-w-5xl">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">{{ 'dashboard.properties.title' | translate }}</h1>
        <a routerLink="/dashboard/properties/new" mat-flat-button color="primary">
          <mat-icon>add</mat-icon> {{ 'dashboard.properties.addNew' | translate }}
        </a>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (n of [1,2,3]; track n) { <div class="h-20 rounded-xl bg-muted animate-pulse"></div> }
        </div>
      } @else if (properties().length === 0) {
        <div class="text-center py-16 text-muted-foreground">
          <mat-icon class="text-5xl opacity-30">home_work</mat-icon>
          <p class="mt-3">{{ 'dashboard.properties.empty' | translate }}</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (property of properties(); track property.id) {
            <div class="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              @if (property.images?.[0]) {
                <img [src]="property.images![0].url" [alt]="property.title | localizedField" class="w-16 h-16 object-cover rounded-lg shrink-0" />
              } @else {
                <div class="w-16 h-16 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                  <mat-icon class="text-muted-foreground">home</mat-icon>
                </div>
              }
              <div class="flex-1 min-w-0">
                <p class="font-medium truncate">{{ property.title | localizedField }}</p>
                <p class="text-sm text-muted-foreground">{{ property.price | currencyChf }}</p>
              </div>
              <span [class]="statusClass(property.status)" class="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full font-medium">
                {{ property.status }}
              </span>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <a mat-menu-item [routerLink]="['/dashboard/properties', property.id, 'edit']">
                  <mat-icon>edit</mat-icon> {{ 'common.buttons.edit' | translate }}
                </a>
                <a mat-menu-item [routerLink]="['/properties', property.id]">
                  <mat-icon>open_in_new</mat-icon> {{ 'common.buttons.view' | translate }}
                </a>
              </mat-menu>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MyPropertiesPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly properties = signal<Property[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getMyProperties().subscribe({
      next: (props) => { this.properties.set(props); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PUBLISHED: 'bg-green-100 text-green-700',
      DRAFT: 'bg-yellow-100 text-yellow-700',
      ARCHIVED: 'bg-gray-100 text-gray-600',
      PENDING_REVIEW: 'bg-blue-100 text-blue-700',
    };
    return map[status] ?? 'bg-muted text-muted-foreground';
  }
}
