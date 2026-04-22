import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Favorite } from '@core/models';
import { DashboardService } from '../../dashboard.service';
import { PropertyCardComponent } from '@shared/components/property-card/property-card.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-favorites-page',
  imports: [TranslateModule, MatIconModule, MatButtonModule, PropertyCardComponent, SkeletonComponent],
  template: `
    <div class="max-w-5xl">
      <h1 class="text-2xl font-bold mb-6">{{ 'dashboard.favorites.title' | translate }}</h1>

      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (n of [1,2,3]; track n) { <app-skeleton variant="property-card" /> }
        </div>
      } @else if (favorites().length === 0) {
        <div class="text-center py-16 text-muted-foreground">
          <mat-icon class="text-5xl opacity-30">favorite_border</mat-icon>
          <p class="mt-3">{{ 'dashboard.favorites.empty' | translate }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (fav of favorites(); track fav.id) {
            @if (fav.property) {
              <app-property-card [property]="fav.property" />
            }
          }
        </div>
      }
    </div>
  `,
})
export class FavoritesPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly favorites = signal<Favorite[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.dashboardService.getFavorites().subscribe({
      next: (favs) => { this.favorites.set(favs); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
