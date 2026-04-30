import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Property, Category, Canton, City, Pagination } from '@core/models';
import { PropertyService } from '../../property.service';
import { SearchStore, PropertyFilters } from '@state/search.store';
import { PropertyCardComponent } from '@shared/components/property-card/property-card.component';
import { PropertyMapComponent } from '@shared/components/property-map/property-map.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';

@Component({
  selector: 'app-property-list-page',
  imports: [
    TranslateModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    RouterLink,
    PropertyCardComponent,
    PropertyMapComponent,
    SkeletonComponent,
    PaginationComponent,
    LocalizedFieldPipe,
  ],
  template: `
    <div class="min-h-screen bg-gray-50">

      <!-- Top filter bar (immobilier.ch style) -->
      <div class="border-b bg-white">
        <div class="mx-auto max-w-7xl px-4 py-4">
          <div class="flex flex-wrap items-center gap-3">

            <!-- Rent / Buy toggle -->
            <div class="flex overflow-hidden rounded-full border border-gray-300">
              <button
                type="button"
                [class]="filters.transaction_type === 'rent'
                  ? 'px-6 py-2 text-sm font-medium bg-[#1a1a2e] text-white transition-colors'
                  : 'px-6 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors'"
                (click)="setTransactionType('rent')">
                {{ 'properties.filters.rent' | translate }}
              </button>
              <button
                type="button"
                [class]="filters.transaction_type === 'buy'
                  ? 'px-6 py-2 text-sm font-medium bg-[#1a1a2e] text-white transition-colors'
                  : 'px-6 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors'"
                (click)="setTransactionType('buy')">
                {{ 'properties.filters.buy' | translate }}
              </button>
            </div>

            <!-- Property type -->
            <mat-form-field appearance="outline" class="property-toolbar-field w-40 shrink-0" subscriptSizing="dynamic">
              <mat-label>{{ 'properties.filters.propertyType' | translate }}</mat-label>
              <mat-select [(ngModel)]="filters.category_id" (ngModelChange)="applyFilters()">
                <mat-option value="">{{ 'properties.filters.allCategories' | translate }}</mat-option>
                @for (cat of categories(); track cat.id) {
                  <mat-option [value]="cat.id">{{ cat.name | localizedField }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <!-- Location (Canton) -->
            <mat-form-field appearance="outline" class="property-toolbar-field w-44 shrink-0" subscriptSizing="dynamic">
              <mat-label>{{ 'properties.filters.location' | translate }}</mat-label>
              <mat-select [(ngModel)]="selectedCantonIdsModel" (ngModelChange)="onCantonChange($event)" multiple>
                @for (canton of cantons(); track canton.id) {
                  <mat-option [value]="canton.id">{{ canton.name | localizedField }} ({{ canton.code }})</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="property-toolbar-field w-44 shrink-0" subscriptSizing="dynamic">
              <mat-label>{{ 'properties.filters.city' | translate }}</mat-label>
              <mat-select [(ngModel)]="selectedCityIdsModel" (ngModelChange)="onCityChange($event)" [disabled]="selectedCantonIds().length === 0" multiple>
                @for (city of cities(); track city.id) {
                  <mat-option [value]="city.id">{{ city.name | localizedField }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <!-- Price -->
            <mat-form-field appearance="outline" class="property-toolbar-field w-40 shrink-0" subscriptSizing="dynamic">
              <mat-label>
                {{ filters.transaction_type === 'buy' ? ('properties.filters.price' | translate) : ('properties.filters.rentAmount' | translate) }}
              </mat-label>
              <mat-select [(ngModel)]="priceRange" (ngModelChange)="onPriceRangeChange($event)">
                <mat-option value="">{{ 'properties.filters.anyPrice' | translate }}</mat-option>
                @for (opt of priceOptions; track opt.label) {
                  <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <!-- Rooms -->
            <mat-form-field appearance="outline" class="property-toolbar-field w-32 shrink-0" subscriptSizing="dynamic">
              <mat-label>{{ 'properties.filters.rooms' | translate }}</mat-label>
              <mat-select [(ngModel)]="filters.rooms_min" (ngModelChange)="applyFilters()">
                <mat-option [value]="undefined">{{ 'properties.filters.anyRooms' | translate }}</mat-option>
                <mat-option [value]="1">1+</mat-option>
                <mat-option [value]="2">2+</mat-option>
                <mat-option [value]="3">3+</mat-option>
                <mat-option [value]="4">4+</mat-option>
                <mat-option [value]="5">5+</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Surface -->
            <mat-form-field appearance="outline" class="property-toolbar-field w-36 shrink-0" subscriptSizing="dynamic">
              <mat-label>{{ 'properties.filters.surface' | translate }}</mat-label>
              <mat-select [(ngModel)]="surfaceRange" (ngModelChange)="onSurfaceRangeChange($event)">
                <mat-option value="">{{ 'properties.filters.anySurface' | translate }}</mat-option>
                <mat-option value="max-50">< 50 m²</mat-option>
                <mat-option value="max-80">< 80 m²</mat-option>
                <mat-option value="max-120">< 120 m²</mat-option>
                <mat-option value="min-50">50+ m²</mat-option>
                <mat-option value="min-100">100+ m²</mat-option>
                <mat-option value="min-200">200+ m²</mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Create alert button -->
            <a routerLink="/auth/login"
              class="ml-auto shrink-0 hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <mat-icon class="text-base leading-none">notifications_active</mat-icon>
              {{ 'properties.filters.createAlert' | translate }}
            </a>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="mx-auto max-w-7xl px-4 py-6">
        <div class="grid gap-8" [class.lg:grid-cols-[minmax(0,1fr)_360px]]="showDesktopMap()">
          <div>
            <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
              <p class="text-sm text-gray-600">
                @if (!loading() && pagination()) {
                  {{ 'properties.list.countRange' | translate : {
                    from: (filters.page - 1) * filters.limit + 1,
                    to: (filters.page - 1) * filters.limit + properties().length,
                    total: pagination()?.total ?? 0
                  } }}
                }
              </p>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <button type="button" (click)="viewMode = 'grid'"
                    class="flex items-center gap-1 transition-colors"
                    [class.text-primary]="viewMode === 'grid'"
                    [class.font-medium]="viewMode === 'grid'">
                    <mat-icon class="text-base leading-none">list</mat-icon> List
                  </button>
                  <span class="text-gray-300">|</span>
                  @if (showDesktopMap()) {
                    <span class="flex items-center gap-1 font-medium text-primary">
                      <mat-icon class="text-base leading-none">map</mat-icon> Map
                    </span>
                  } @else {
                    <button type="button"
                      class="flex items-center gap-1 cursor-not-allowed text-gray-400 transition-colors" disabled>
                      <mat-icon class="text-base leading-none">map</mat-icon> Map
                    </button>
                  }
                </div>

                <div class="flex items-center gap-1 text-sm text-gray-600">
                  <span>Sort:</span>
                  <mat-form-field appearance="outline" class="property-toolbar-field property-toolbar-field--sort w-36" subscriptSizing="dynamic">
                    <mat-select [(ngModel)]="filters.sort_by" (ngModelChange)="applyFilters()">
                      <mat-option value="published_at">{{ 'properties.filters.sortNewest' | translate }}</mat-option>
                      <mat-option value="price_asc">{{ 'properties.filters.sortPriceAsc' | translate }}</mat-option>
                      <mat-option value="price_desc">{{ 'properties.filters.sortPriceDesc' | translate }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <h1 class="mb-6 text-2xl font-bold">
              @if (filters.transaction_type === 'buy') {
                {{ 'properties.list.buyTitle' | translate }}
              } @else {
                {{ 'properties.list.rentTitle' | translate }}
              }
            </h1>

            @if (loading()) {
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                @for (n of [1,2,3,4,5,6]; track n) { <app-skeleton variant="property-card" /> }
              </div>
            } @else if (properties().length === 0) {
              <div class="py-16 text-center text-gray-400">
                <mat-icon class="text-5xl opacity-30">search_off</mat-icon>
                <p class="mt-3 text-lg font-medium text-gray-600">{{ 'properties.list.noResults' | translate }}</p>
                <p class="mt-1 text-sm">{{ 'properties.list.noResultsHint' | translate }}</p>
              </div>
            } @else {
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                @for (property of properties(); track property.id) {
                  <app-property-card [property]="property" />
                }
              </div>

              <app-pagination
                [currentPage]="filters.page"
                [totalPages]="totalPages()"
                (pageChange)="onPageChange($event)"
              />
            }
          </div>

          @if (showDesktopMap()) {
            <aside class="hidden lg:block">
              <div class="sticky top-24 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div class="mb-4">
                  <h2 class="text-lg font-semibold text-gray-900">
                    @if (selectedCity(); as city) {
                      {{ city.name | localizedField }}
                    } @else if (selectedCanton(); as canton) {
                      {{ canton.name | localizedField }}
                    } @else {
                      {{ 'properties.detail.map' | translate }}
                    }
                  </h2>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ 'properties.list.countRange' | translate : {
                      from: (filters.page - 1) * filters.limit + 1,
                      to: (filters.page - 1) * filters.limit + properties().length,
                      total: pagination()?.total ?? 0
                    } }}
                  </p>
                  <p class="mt-2 text-sm text-rose-700">
                    {{ 'properties.map.redPins' | translate }}
                  </p>
                  @if (approximateMarkerCount() > 0) {
                    <p class="mt-1 text-sm text-rose-700">
                      {{ approximateCountLabel() }}
                    </p>
                  }
                </div>

                <app-property-map
                  [lat]="mapCenter().lat"
                  [lng]="mapCenter().lng"
                  [zoom]="11"
                  [height]="'560px'"
                  [markers]="mapMarkers()"
                />
              </div>
            </aside>
          }
        </div>
      </div>
    </div>
  `,
})
export class PropertyListPageComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);
  private readonly searchStore = inject(SearchStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly properties = signal<Property[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly cantons = signal<Canton[]>([]);
  readonly allCities = signal<City[]>([]);
  readonly cities = signal<City[]>([]);
  readonly pagination = signal<Pagination | null>(null);
  readonly loading = signal(true);

  viewMode: 'grid' | 'list' = 'grid';
  priceRange = '';
  surfaceRange = '';
  selectedCantonIdsModel: string[] = [];
  selectedCityIdsModel: string[] = [];

  readonly priceOptions = [
    { label: '< CHF 500', value: 'max-500' },
    { label: '< CHF 1000', value: 'max-1000' },
    { label: '< CHF 1500', value: 'max-1500' },
    { label: '< CHF 2000', value: 'max-2000' },
    { label: '< CHF 3000', value: 'max-3000' },
    { label: '> CHF 1000', value: 'min-1000' },
    { label: '> CHF 2000', value: 'min-2000' },
    { label: '> CHF 500k', value: 'min-500000' },
    { label: '> CHF 1M', value: 'min-1000000' },
  ];

  // Local copy of filters for two-way binding in the template
  filters: Partial<PropertyFilters> & { page: number; limit: number } = {
    page: 1,
    limit: 21,
    transaction_type: 'rent',
    sort_by: 'published_at',
    sort_order: 'desc',
  };

  get totalPages(): () => number {
    return () => {
      const p = this.pagination();
      if (!p) return 1;
      return p.totalPages ?? 1;
    };
  }

  ngOnInit(): void {
    // Merge any query params from direct URL navigation
    this.route.queryParams.subscribe((params) => {
      const cantonIds = this.parseMultiValue(params['canton_id']);
      const cityIds = this.parseMultiValue(params['city_id']);
      this.selectedCantonIdsModel = cantonIds;
      this.selectedCityIdsModel = cityIds;

      this.filters = {
        ...this.filters,
        ...params,
        canton_id: cantonIds.length > 0 ? cantonIds.join(',') : undefined,
        city_id: cityIds.length > 0 ? cityIds.join(',') : undefined,
        page: Number(params['page'] || 1),
      };

      this.updateAvailableCities();
      this.loadProperties();
    });

    this.propertyService.getCategories().subscribe((cats) => this.categories.set(cats));
    this.propertyService.getCantons().subscribe((cantons) => this.cantons.set(cantons));
    this.propertyService.getCities().subscribe((cities) => {
      this.allCities.set(cities);
      this.updateAvailableCities();
    });
  }

  loadProperties(): void {
    this.loading.set(true);
    this.propertyService.getProperties(this.filters as PropertyFilters).subscribe({
      next: ({ items, pagination }) => {
        this.properties.set(items);
        this.pagination.set(pagination);
        this.loading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => this.loading.set(false),
    });
  }

  setTransactionType(type: 'rent' | 'buy'): void {
    this.filters.transaction_type = type;
    this.filters.price_min = undefined;
    this.filters.price_max = undefined;
    this.priceRange = '';
    this.applyFilters();
  }

  onPriceRangeChange(value: string): void {
    this.filters.price_min = undefined;
    this.filters.price_max = undefined;
    if (value.startsWith('max-')) {
      this.filters.price_max = parseInt(value.split('-')[1]);
    } else if (value.startsWith('min-')) {
      this.filters.price_min = parseInt(value.split('-')[1]);
    }
    this.applyFilters();
  }

  onSurfaceRangeChange(value: string): void {
    (this.filters as any).surface_min = undefined;
    (this.filters as any).surface_max = undefined;
    if (value.startsWith('max-')) {
      (this.filters as any).surface_max = parseInt(value.split('-')[1]);
    } else if (value.startsWith('min-')) {
      (this.filters as any).surface_min = parseInt(value.split('-')[1]);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.syncQueryParams();
    this.loadProperties();
  }

  onCantonChange(cantonIds: string[] | string): void {
    this.selectedCantonIdsModel = this.parseMultiValue(cantonIds);
    this.updateAvailableCities();
    this.filters.canton_id = this.selectedCantonIdsModel.length > 0 ? this.selectedCantonIdsModel.join(',') : undefined;
    this.applyFilters();
  }

  onCityChange(cityIds: string[] | string): void {
    this.selectedCityIdsModel = this.parseMultiValue(cityIds);
    this.filters.city_id = this.selectedCityIdsModel.length > 0 ? this.selectedCityIdsModel.join(',') : undefined;
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.syncQueryParams();
    this.loadProperties();
  }

  resetFilters(): void {
    this.filters = { page: 1, limit: 21, transaction_type: 'rent', sort_by: 'published_at', sort_order: 'desc' };
    this.priceRange = '';
    this.selectedCantonIdsModel = [];
    this.selectedCityIdsModel = [];
    this.cities.set([]);
    this.searchStore.resetFilters();
    this.syncQueryParams();
    this.loadProperties();
  }

  showDesktopMap(): boolean {
    return (this.selectedCantonIds().length > 0 || this.selectedCityIds().length > 0) && this.mappableProperties().length > 0;
  }

  selectedCanton(): Canton | undefined {
    const selectedId = this.selectedCantonIds()[0];
    if (!selectedId) {
      return undefined;
    }

    return this.cantons().find((canton) => canton.id === selectedId)
      ?? this.properties().find((property) => property.canton_id === selectedId)?.canton;
  }

  selectedCity(): City | undefined {
    const selectedId = this.selectedCityIds()[0];
    if (!selectedId) {
      return undefined;
    }

    return this.cities().find((city) => city.id === selectedId)
      ?? this.properties().find((property) => property.city_id === selectedId)?.city;
  }

  approximateMarkerCount(): number {
    return this.mappableProperties().filter(
      (property) => property.location_precision === 'postal_code'
        || property.location_precision === 'city'
        || property.location_precision === 'canton',
    ).length;
  }

  approximateCountLabel(): string {
    const count = this.approximateMarkerCount();
    const key = count === 1
      ? 'properties.map.approximateCount_one'
      : 'properties.map.approximateCount_other';

    return this.translate.instant(key, { count });
  }

  mapCenter(): { lat: number; lng: number } {
    const properties = this.mappableProperties();

    if (properties.length === 1) {
      return {
        lat: properties[0].latitude!,
        lng: properties[0].longitude!,
      };
    }

    const total = properties.reduce(
      (acc, property) => ({
        lat: acc.lat + (property.latitude ?? 0),
        lng: acc.lng + (property.longitude ?? 0),
      }),
      { lat: 0, lng: 0 },
    );

    return {
      lat: total.lat / properties.length,
      lng: total.lng / properties.length,
    };
  }

  mapMarkers(): Array<{ lat: number; lng: number; title?: string }> {
    return this.mappableProperties().map((property) => ({
      lat: property.latitude!,
      lng: property.longitude!,
      title: typeof property.title === 'string' && property.title.trim().length > 0 ? property.title : property.address,
    }));
  }

  private mappableProperties(): Property[] {
    return this.properties().filter(
      (property) => typeof property.latitude === 'number' && typeof property.longitude === 'number',
    );
  }

  selectedCantonIds(): string[] {
    return this.selectedCantonIdsModel;
  }

  selectedCityIds(): string[] {
    return this.selectedCityIdsModel;
  }

  private parseMultiValue(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }

    return [];
  }

  private updateAvailableCities(): void {
    const selectedCantonIds = this.selectedCantonIds();

    if (selectedCantonIds.length === 0) {
      this.cities.set([]);
      this.selectedCityIdsModel = [];
      this.filters.city_id = undefined;
      return;
    }

    const availableCities = this.allCities().filter((city) => selectedCantonIds.includes(city.canton_id));
    this.cities.set(availableCities);

    const validCityIds = this.selectedCityIdsModel.filter((cityId) =>
      availableCities.some((city) => city.id === cityId),
    );

    this.selectedCityIdsModel = validCityIds;
    this.filters.city_id = validCityIds.length > 0 ? validCityIds.join(',') : undefined;
  }

  private syncQueryParams(): void {
    const params: Record<string, string | number> = {};
    Object.entries(this.filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params[k] = v as string | number;
    });
    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }
}
