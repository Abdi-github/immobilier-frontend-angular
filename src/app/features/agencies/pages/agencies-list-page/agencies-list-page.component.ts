import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Agency, Pagination, Canton, City, TranslatedField } from '@core/models';
import { AgencyService } from '../../agency.service';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';

type AgencyLocationResult = {
  id: string;
  name: string;
  type: 'canton' | 'city';
  cantonCode?: string;
  cantonName?: string;
};

@Component({
  selector: 'app-agencies-list-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    SkeletonComponent,
    PaginationComponent,
    LocalizedFieldPipe,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">

      <div
        class="relative overflow-hidden bg-cover bg-center"
        style="background-image: linear-gradient(rgba(26,26,46,0.7), rgba(26,26,46,0.8)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')"
        [style.min-height]="hasSearchCriteria() ? '220px' : '420px'"
      >
        <div class="mx-auto max-w-4xl px-4 py-12 text-white">
          @if (!hasSearchCriteria()) {
            <h1 class="mb-8 text-center text-3xl font-bold md:text-4xl">{{ 'agencies.list.heroTitle' | translate }}</h1>
          }

          <div class="flex flex-col gap-3 md:flex-row md:gap-4">
            <div class="relative flex-1">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">location_on</mat-icon>
              <input
                type="text"
                [ngModel]="locationQuery"
                (ngModelChange)="onLocationQueryChange($event)"
                (focus)="onLocationFocus()"
                (blur)="closeLocationResults()"
                (keydown.enter)="$event.preventDefault()"
                [placeholder]="'agencies.filters.locationPlaceholder' | translate"
                class="h-12 w-full rounded-lg border border-white/20 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-white/40"
              />

              @if (locationResultsOpen() && locationQuery.trim().length >= 2 && filteredLocationResults().length > 0) {
                <div class="absolute left-0 right-0 top-full z-40 mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                  @for (result of filteredLocationResults(); track result.type + '-' + result.id) {
                    <button
                      type="button"
                      (mousedown)="$event.preventDefault()"
                      (click)="selectLocation(result)"
                      class="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div class="flex items-center gap-3 text-gray-800">
                        <mat-icon class="text-base leading-none" [class.text-blue-500]="result.type === 'canton'" [class.text-gray-400]="result.type === 'city'">
                          {{ result.type === 'canton' ? 'location_on' : 'business' }}
                        </mat-icon>
                        <div>
                          <span class="font-medium">{{ result.name }}</span>
                          @if (result.type === 'city' && result.cantonName) {
                            <span class="ml-2 text-sm text-gray-500">- {{ result.cantonName }}</span>
                          }
                        </div>
                      </div>
                      <span
                        class="rounded px-2 py-0.5 text-xs"
                        [class.bg-blue-100]="result.type === 'canton'"
                        [class.text-blue-700]="result.type === 'canton'"
                        [class.bg-gray-100]="result.type === 'city'"
                        [class.text-gray-600]="result.type === 'city'"
                      >
                        {{ result.type === 'canton' ? ('agencies.search.canton' | translate) : ('agencies.search.city' | translate) }}
                      </span>
                    </button>
                  }
                </div>
              } @else if (locationResultsOpen() && locationQuery.trim().length >= 2) {
                <div class="absolute left-0 right-0 top-full z-40 mt-1 rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-xl">
                  {{ 'agencies.search.noResults' | translate }}
                </div>
              }
            </div>

            <div class="relative flex-1">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">business</mat-icon>
              <input
                type="text"
                [(ngModel)]="agencyNameQuery"
                (keydown.enter)="submitAgencySearch()"
                [placeholder]="'agencies.filters.namePlaceholder' | translate"
                class="h-12 w-full rounded-lg border border-white/20 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-white/40"
              />
            </div>

            <button
              type="button"
              (click)="submitAgencySearch()"
              class="flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-[#ef1d5e] px-6 text-white transition-colors hover:bg-[#d91854] md:w-auto"
              [disabled]="loading()"
            >
              <mat-icon>search</mat-icon>
            </button>
          </div>

          @if (!hasSearchCriteria()) {
            <p class="mt-4 text-center text-sm text-white/80">{{ 'agencies.list.heroHint' | translate }}</p>
          }
        </div>
      </div>

      @if (hasSearchCriteria()) {
        <div class="mx-auto max-w-5xl px-4 py-8">
          <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <a routerLink="/" class="hover:text-primary">{{ 'common.nav.home' | translate }}</a>
            <mat-icon class="text-base leading-none">chevron_right</mat-icon>
            <button type="button" (click)="clearSearch()" class="hover:text-primary">{{ 'agencies.detail.breadcrumb' | translate }}</button>
            @if (selectedLocation()) {
              <mat-icon class="text-base leading-none">chevron_right</mat-icon>
              <span class="text-gray-900">{{ selectedLocation()!.name }}</span>
            }
          </nav>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900">{{ resultTitle() }}</h2>
            @if (pagination()) {
              <p class="mt-2 text-sm text-gray-600">{{ 'agencies.results.showing' | translate : countRange() }}</p>
            }
          </div>

          @if (loading()) {
            <div class="space-y-4">
              @for (n of [1,2,3,4,5]; track n) {
                <div class="flex gap-4 rounded-xl border border-gray-200 bg-white p-5">
                  <app-skeleton variant="block" class="h-20 w-20 rounded-lg" />
                  <div class="flex-1 space-y-2">
                    <app-skeleton variant="text" class="h-5 w-48" />
                    <app-skeleton variant="text" class="h-4 w-72" />
                    <app-skeleton variant="text" class="h-4 w-36" />
                  </div>
                </div>
              }
            </div>
          } @else if (agencies().length === 0) {
            <div class="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <mat-icon class="text-5xl text-gray-300">business</mat-icon>
              <p class="mt-4 text-lg font-medium text-gray-900">{{ 'agencies.list.noResults' | translate }}</p>
              <p class="mt-2 text-sm text-gray-500">{{ 'agencies.results.noResultsHint' | translate }}</p>
              <button type="button" (click)="clearSearch()" class="mt-4 inline-flex h-10 items-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                {{ 'agencies.results.clearSearch' | translate }}
              </button>
            </div>
          } @else {
            <div class="space-y-4">
              @for (agency of agencies(); track agency.id) {
                <div class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row">
                  <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                    @if (agency.logo_url) {
                      <img [src]="agency.logo_url" [alt]="agency.name" class="h-full w-full rounded-lg object-contain p-1" />
                    } @else {
                      <mat-icon class="text-4xl text-gray-400">business</mat-icon>
                    }
                  </div>

                  <div class="flex min-w-0 flex-1 flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-gray-900">{{ agency.name }}</h3>
                      @if (agency.is_verified) {
                        <span class="inline-flex items-center gap-1 text-sm text-green-600">
                          <mat-icon class="text-base leading-none">verified</mat-icon>
                          {{ 'agencies.card.verified' | translate }}
                        </span>
                      }
                    </div>

                    <div class="flex items-start gap-2 text-sm text-gray-600">
                      <mat-icon class="mt-0.5 text-base leading-none">location_on</mat-icon>
                      <span>
                        {{ agency.address }}
                        <br />
                        @if (agency.postal_code || agency.city) {
                          {{ agency.postal_code }} {{ agency.city?.name | localizedField }}
                        }
                      </span>
                    </div>

                    @if (agency.phone) {
                      <div class="flex items-center gap-2 text-sm text-gray-600">
                        <mat-icon class="text-base leading-none">call</mat-icon>
                        <a [href]="'tel:' + agency.phone" class="hover:text-primary">{{ agency.phone }}</a>
                      </div>
                    }

                    @if (agency.description) {
                      <p class="text-sm text-gray-500 line-clamp-2">{{ agency.description | localizedField }}</p>
                    }

                    @if (agency.total_properties > 0) {
                      <p class="text-sm text-gray-500">{{ 'agencies.card.properties' | translate : { count: agency.total_properties } }}</p>
                    }
                  </div>

                  <div class="flex shrink-0 flex-row gap-2 sm:flex-col">
                    <a
                      [routerLink]="['/agencies', agency.id]"
                      class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {{ 'agencies.card.viewProfile' | translate }}
                    </a>

                    @if (agency.website) {
                      <a
                        [href]="agency.website.startsWith('http') ? agency.website : 'https://' + agency.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {{ 'agencies.detail.website' | translate }}
                      </a>
                    }

                    @if (agency.email || agency.phone) {
                      <a
                        [href]="agency.email ? 'mailto:' + agency.email : 'tel:' + agency.phone"
                        class="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {{ 'agencies.detail.contact' | translate }}
                      </a>
                    }
                  </div>
                </div>
              }
            </div>

            @if (totalPages() > 1) {
              <app-pagination [currentPage]="page" [totalPages]="totalPages()" (pageChange)="onPageChange($event)" />
            }
          }
        </div>
      } @else {
        <div class="mx-auto max-w-5xl px-4 py-12">
          <div class="text-center">
            <mat-icon class="text-6xl text-gray-300">business</mat-icon>
            <h2 class="mt-6 text-2xl font-semibold text-gray-900">{{ 'agencies.list.emptyTitle' | translate }}</h2>
            <p class="mx-auto mt-4 max-w-lg text-gray-600">{{ 'agencies.list.emptyHint' | translate }}</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class AgenciesListPageComponent implements OnInit {
  private readonly agencyService = inject(AgencyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly agencies = signal<Agency[]>([]);
  readonly cantons = signal<Canton[]>([]);
  readonly cities = signal<City[]>([]);
  readonly loading = signal(false);
  readonly pagination = signal<Pagination | null>(null);
  readonly hasSearchCriteria = signal(false);
  readonly selectedLocation = signal<AgencyLocationResult | null>(null);
  readonly locationResultsOpen = signal(false);
  locationQuery = '';
  agencyNameQuery = '';
  page = 1;
  private selectedLocationType: 'canton' | 'city' | null = null;
  private selectedLocationId: string | null = null;

  totalPages = () => {
    const p = this.pagination();
    return p ? (p.totalPages ?? 1) : 1;
  };

  ngOnInit(): void {
    forkJoin({
      cantons: this.agencyService.getCantons(),
      cities: this.agencyService.getCities(),
    }).subscribe({
      next: ({ cantons, cities }) => {
        this.cantons.set(cantons);
        this.cities.set(cities);
        this.route.queryParamMap.subscribe((params) => {
          this.page = Number(params.get('page') || '1');
          this.agencyNameQuery = params.get('search') || '';
          this.selectedLocationId = params.get('city_id') || params.get('canton_id');
          this.selectedLocationType = params.get('city_id') ? 'city' : params.get('canton_id') ? 'canton' : null;
          this.selectedLocation.set(this.resolveSelectedLocation());
          this.locationQuery = '';

          const hasCriteria = Boolean(this.selectedLocationId || this.agencyNameQuery);
          this.hasSearchCriteria.set(hasCriteria);

          if (!hasCriteria) {
            this.agencies.set([]);
            this.pagination.set(null);
            this.loading.set(false);
            return;
          }

          this.load();
        });
      },
    });
  }

  load(): void {
    this.loading.set(true);
    this.agencyService.getAgencies({
      page: this.page,
      limit: 20,
      search: this.agencyNameQuery || undefined,
      canton_id: this.selectedLocationType === 'canton' ? this.selectedLocationId ?? undefined : undefined,
      city_id: this.selectedLocationType === 'city' ? this.selectedLocationId ?? undefined : undefined,
    }).subscribe({
      next: ({ items, pagination }) => {
        this.agencies.set(items);
        this.pagination.set(pagination);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  filteredLocationResults(): AgencyLocationResult[] {
    const query = this.locationQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    const results: AgencyLocationResult[] = [];

    for (const canton of this.cantons()) {
      const name = this.localizedName(canton.name);
      if (name.toLowerCase().includes(query)) {
        results.push({
          id: canton.id,
          name,
          type: 'canton',
          cantonCode: canton.code,
        });
      }
    }

    for (const city of this.cities()) {
      const name = this.localizedName(city.name);
      if (!name.toLowerCase().includes(query)) continue;
      const canton = this.cantons().find((item) => item.id === city.canton_id);
      results.push({
        id: city.id,
        name,
        type: 'city',
        cantonName: canton ? this.localizedName(canton.name) : undefined,
        cantonCode: canton?.code,
      });
    }

    return results
      .sort((left, right) => {
        const leftExact = left.name.toLowerCase() === query;
        const rightExact = right.name.toLowerCase() === query;
        if (leftExact && !rightExact) return -1;
        if (!leftExact && rightExact) return 1;
        if (left.type === 'canton' && right.type === 'city') return -1;
        if (left.type === 'city' && right.type === 'canton') return 1;
        return left.name.localeCompare(right.name);
      })
      .slice(0, 10);
  }

  onLocationQueryChange(value: string): void {
    this.locationQuery = value;
    this.selectedLocation.set(null);
    this.selectedLocationId = null;
    this.selectedLocationType = null;
    this.locationResultsOpen.set(value.trim().length >= 2);
  }

  onLocationFocus(): void {
    if (this.locationQuery.trim().length >= 2) {
      this.locationResultsOpen.set(true);
    }
  }

  closeLocationResults(): void {
    setTimeout(() => this.locationResultsOpen.set(false), 150);
  }

  selectLocation(result: AgencyLocationResult): void {
    this.selectedLocation.set(result);
    this.selectedLocationId = result.id;
    this.selectedLocationType = result.type;
    this.locationQuery = '';
    this.locationResultsOpen.set(false);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: 1,
        search: this.agencyNameQuery || null,
        canton_id: result.type === 'canton' ? result.id : null,
        city_id: result.type === 'city' ? result.id : null,
      },
    });
  }

  submitAgencySearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: 1,
        search: this.agencyNameQuery || null,
        canton_id: this.selectedLocationType === 'canton' ? this.selectedLocationId : null,
        city_id: this.selectedLocationType === 'city' ? this.selectedLocationId : null,
      },
    });
  }

  clearSearch(): void {
    this.locationQuery = '';
    this.agencyNameQuery = '';
    this.selectedLocation.set(null);
    this.selectedLocationId = null;
    this.selectedLocationType = null;
    this.locationResultsOpen.set(false);
    this.router.navigate(['/agencies']);
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page,
        search: this.agencyNameQuery || null,
        canton_id: this.selectedLocationType === 'canton' ? this.selectedLocationId : null,
        city_id: this.selectedLocationType === 'city' ? this.selectedLocationId : null,
      },
    }).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  locationResultLabel(result: AgencyLocationResult): string {
    return result.type === 'city' && result.cantonName ? `${result.name} - ${result.cantonName}` : result.name;
  }

  resultTitle(): string {
    const location = this.selectedLocation();
    if (location) {
      return location.type === 'canton'
        ? this.translate.instant('agencies.results.titleCanton', { name: location.name })
        : this.translate.instant('agencies.results.titleCity', { name: location.name });
    }

    if (this.agencyNameQuery) {
      return this.translate.instant('agencies.results.titleSearch', { search: this.agencyNameQuery });
    }

    return this.translate.instant('agencies.results.titleAll');
  }

  countRange(): { from: number; to: number; total: number } {
    const pagination = this.pagination();
    const total = pagination?.total ?? 0;
    if (!total) {
      return { from: 0, to: 0, total: 0 };
    }

    return {
      from: (this.page - 1) * 20 + 1,
      to: Math.min(this.page * 20, total),
      total,
    };
  }

  private resolveSelectedLocation(): AgencyLocationResult | null {
    if (!this.selectedLocationId || !this.selectedLocationType) {
      return null;
    }

    if (this.selectedLocationType === 'city') {
      const city = this.cities().find((item) => item.id === this.selectedLocationId);
      if (!city) return null;
      const canton = this.cantons().find((item) => item.id === city.canton_id);
      return {
        id: city.id,
        name: this.localizedName(city.name),
        type: 'city',
        cantonName: canton ? this.localizedName(canton.name) : undefined,
        cantonCode: canton?.code,
      };
    }

    const canton = this.cantons().find((item) => item.id === this.selectedLocationId);
    if (!canton) return null;

    return {
      id: canton.id,
      name: this.localizedName(canton.name),
      type: 'canton',
      cantonCode: canton.code,
    };
  }

  private localizedName(field?: TranslatedField | string): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    const current = this.translate.currentLang || 'en';
    return field[current as keyof TranslatedField]
      ?? field.en
      ?? field.fr
      ?? field.de
      ?? field.it
      ?? '';
  }
}
