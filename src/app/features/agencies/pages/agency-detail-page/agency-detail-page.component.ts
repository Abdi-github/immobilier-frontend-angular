import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Agency, Property, Pagination } from '@core/models';
import { AgencyService } from '../../agency.service';
import { PropertyCardComponent } from '@shared/components/property-card/property-card.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';

@Component({
  selector: 'app-agency-detail-page',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    PropertyCardComponent,
    PaginationComponent,
    SkeletonComponent,
    LocalizedFieldPipe,
  ],
  template: `
    @if (loading()) {
      <div class="container mx-auto px-4 py-10 space-y-6">
        <app-skeleton variant="block" class="h-32 rounded-xl" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (n of [1,2,3]; track n) { <app-skeleton variant="property-card" /> }
        </div>
      </div>
    } @else if (agency()) {
      <!-- Agency hero -->
      <div class="border-b border-border bg-card">
        <div class="container mx-auto px-4 py-8 flex items-center gap-6">
          @if (agency()!.logo_url) {
            <img [src]="agency()!.logo_url" [alt]="agency()!.name" class="w-20 h-20 object-contain rounded-xl border border-border" />
          }
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2">
              {{ agency()!.name }}
              @if (agency()!.is_verified) {
                <mat-icon class="text-green-500">verified</mat-icon>
              }
            </h1>
            @if (agency()!.address) {
              <p class="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                <mat-icon class="text-sm">location_on</mat-icon>{{ agency()!.address }}
              </p>
            }
            @if (agency()!.website) {
              <a [href]="agency()!.website" target="_blank" rel="noopener" class="text-primary text-sm hover:underline mt-1 inline-block">
                {{ agency()!.website }}
              </a>
            }
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        @if (agency()!.description) {
          <p class="text-muted-foreground max-w-2xl mb-6">{{ agency()!.description | localizedField }}</p>
          <mat-divider class="mb-6" />
        }

        <h2 class="text-xl font-semibold mb-6">{{ 'agencies.detail.properties' | translate }}</h2>

        @if (loadingProperties()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (n of [1,2,3]; track n) { <app-skeleton variant="property-card" /> }
          </div>
        } @else if (properties().length === 0) {
          <p class="text-muted-foreground">{{ 'agencies.detail.noProperties' | translate }}</p>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (property of properties(); track property.id) {
              <app-property-card [property]="property" />
            }
          </div>

          <app-pagination [currentPage]="page" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
        }
      </div>
    }
  `,
})
export class AgencyDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly agencyService = inject(AgencyService);

  readonly agency = signal<Agency | null>(null);
  readonly properties = signal<Property[]>([]);
  readonly pagination = signal<Pagination | null>(null);
  readonly loading = signal(true);
  readonly loadingProperties = signal(true);
  page = 1;

  totalPages = () => {
    const p = this.pagination();
    return p ? (p.totalPages ?? 1) : 1;
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.agencyService.getAgencyById(id).subscribe({
      next: (agency) => {
        this.agency.set(agency);
        this.loading.set(false);
        this.loadProperties(id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadProperties(agencyId: string): void {
    this.loadingProperties.set(true);
    this.agencyService.getAgencyProperties(agencyId, { page: this.page, limit: 9 }).subscribe({
      next: ({ items, pagination }) => {
        this.properties.set(items);
        this.pagination.set(pagination);
        this.loadingProperties.set(false);
      },
      error: () => this.loadingProperties.set(false),
    });
  }

  onPageChange(p: number): void {
    this.page = p;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadProperties(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
