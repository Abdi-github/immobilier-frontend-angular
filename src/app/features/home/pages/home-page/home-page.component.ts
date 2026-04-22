import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Canton, Property, PopularCity, TransactionType } from '@core/models';
import { HomeService } from '../../home.service';
import { PropertyCardComponent } from '@shared/components/property-card/property-card.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';
import { SearchStore } from '@state/search.store';

@Component({
  selector: 'app-home-page',
  imports: [
    TranslateModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    PropertyCardComponent,
    SkeletonComponent,
    LocalizedFieldPipe,
  ],
  template: `
    <div class="min-h-screen bg-white">
      <section class="bg-gradient-to-b from-[#f8f9fa] to-white py-12 md:py-16">
        <div class="mx-auto max-w-7xl px-4">
          <div class="mx-auto max-w-3xl">
            <h1 class="mb-8 text-center text-3xl font-bold text-[#1a1a2e] md:text-4xl lg:text-5xl">
              {{ 'home.hero.title' | translate }}
            </h1>

            <div class="rounded-xl bg-white p-4 shadow-lg md:p-6">
              <div class="mb-4 flex justify-center border-b border-gray-200">
                <button
                  type="button"
                  class="relative -mb-px border-b-2 border-transparent px-6 py-3 text-sm font-medium transition-colors"
                  [class.text-primary]="selectedSection === 'residential'"
                  [class.text-gray-500]="selectedSection !== 'residential'"
                  [class.border-primary]="selectedSection === 'residential'"
                  (click)="selectedSection = 'residential'">
                  {{ 'home.hero.tabResidential' | translate }}
                </button>
                <button
                  type="button"
                  class="relative -mb-px border-b-2 border-transparent px-6 py-3 text-sm font-medium transition-colors"
                  [class.text-primary]="selectedSection === 'commercial'"
                  [class.text-gray-500]="selectedSection !== 'commercial'"
                  [class.border-primary]="selectedSection === 'commercial'"
                  (click)="selectedSection = 'commercial'">
                  {{ 'home.hero.tabCommercial' | translate }}
                </button>
                <button type="button" class="relative -mb-px border-b-2 border-transparent px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700">
                  {{ 'home.hero.tabEstimate' | translate }}
                </button>
              </div>

              <div class="mb-4 flex items-center justify-center gap-6">
                <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="transactionType"
                    [checked]="transactionType === 'buy'"
                    (change)="transactionType = 'buy'"
                    class="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                  <span>{{ 'home.hero.labelBuy' | translate }}</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="transactionType"
                    [checked]="transactionType === 'rent'"
                    (change)="transactionType = 'rent'"
                    class="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
                  <span>{{ 'home.hero.labelRent' | translate }}</span>
                </label>
              </div>

              <div class="flex gap-2">
                <div class="relative flex-1">
                  <mat-icon class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400">location_on</mat-icon>
                  <select
                    [(ngModel)]="selectedCantonId"
                    class="home-hero-select h-12 w-full appearance-none rounded-md border border-gray-300 bg-white pl-10 pr-10 text-left text-sm text-[#1a1a2e] shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option value="">All locations</option>
                    @for (canton of cantons(); track canton.id) {
                      <option [value]="canton.id">{{ canton.name | localizedField }} ({{ canton.code }})</option>
                    }
                  </select>
                  <mat-icon class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">expand_more</mat-icon>
                </div>

                <button
                  type="button"
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-white transition-colors hover:bg-primary-hover"
                  (click)="search()"
                  [attr.aria-label]="'home.hero.cta' | translate">
                  <mat-icon>search</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-12">
            <h2 class="mb-6 text-center text-lg font-semibold text-gray-600">
              {{ 'home.services.title' | translate }}
            </h2>
            <div class="grid gap-4 md:grid-cols-3">
              <a
                routerLink="/auth/register"
                class="group rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-white shadow-md transition-transform hover:scale-[1.02]">
                <div class="mb-2 text-xl font-bold">{{ 'home.services.estimate.title' | translate }}</div>
                <div class="text-sm opacity-90">{{ 'home.services.estimate.subtitle' | translate }}</div>
                <div class="mt-1 text-xs font-semibold uppercase">{{ 'home.services.estimate.tag' | translate }}</div>
                <mat-icon class="mt-4 transition-transform group-hover:translate-x-1">arrow_forward</mat-icon>
              </a>

              <a
                routerLink="/auth/login"
                class="group rounded-2xl bg-gradient-to-br from-[#4a90d9] to-[#3a7bc8] p-6 text-white shadow-md transition-transform hover:scale-[1.02]">
                <div class="mb-2 text-xl font-bold">{{ 'home.services.eTenant.title' | translate }}</div>
                <div class="text-sm opacity-90">{{ 'home.services.eTenant.subtitle' | translate }}</div>
                <div class="mt-1 text-xs font-semibold uppercase">{{ 'home.services.eTenant.tag' | translate }}</div>
                <mat-icon class="mt-4 transition-transform group-hover:translate-x-1">arrow_forward</mat-icon>
              </a>

              <a
                routerLink="/agencies"
                class="group rounded-2xl bg-gradient-to-br from-[#2d3748] to-[#1a202c] p-6 text-white shadow-md transition-transform hover:scale-[1.02]">
                <div class="mb-2 text-xl font-bold">{{ 'home.services.findAgency.title' | translate }}</div>
                <div class="text-sm opacity-90">{{ 'home.services.findAgency.subtitle' | translate }}</div>
                <mat-icon class="mt-4 transition-transform group-hover:translate-x-1">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
        <section class="bg-white py-12">
          <div class="container mx-auto px-4">
            <div class="mb-8 text-center">
              <h2 class="text-2xl font-bold text-[#1a1a2e] md:text-3xl">{{ 'home.cityListings.title' | translate }}</h2>
              <p class="mt-2 text-gray-600">{{ 'home.cityListings.subtitle' | translate }}</p>
            </div>

            <div class="flex flex-col gap-4">
              @for (row of cityRows(); track $index; let rowIndex = $index) {
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  @for (city of row; track city.id; let cityIndex = $index) {
                    <article
                      class="group relative block h-[220px] overflow-hidden rounded-xl"
                      [class.md:col-span-1]="rowIndex % 2 === 0 ? cityIndex === 0 : cityIndex === 1"
                      [class.md:col-span-2]="rowIndex % 2 === 0 ? cityIndex === 1 : cityIndex === 0">
                      <a
                        [routerLink]="['/properties']"
                        [queryParams]="{ city_id: city.id }"
                        class="absolute inset-0 z-0"
                        [attr.aria-label]="(city.name | localizedField) + ' properties'">
                      </a>
                      <img
                        [src]="city.image_url || fallbackCityImage"
                        [alt]="city.name | localizedField"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                      <div class="absolute inset-0 z-10 flex h-full flex-col justify-end p-5">
                        <h3 class="text-xl font-bold text-white md:text-2xl">{{ city.name | localizedField }}</h3>
                        <span class="text-sm text-white/80">{{ city.canton_name | localizedField }} ({{ city.canton_code }})</span>

                        <div class="mt-3 flex flex-wrap gap-3">
                          @if (city.rent_count > 0) {
                            <a
                              [routerLink]="['/properties']"
                              [queryParams]="{ city_id: city.id, transaction_type: 'rent' }"
                              class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                              {{ city.rent_count }} {{ 'home.cityListings.toRent' | translate }}
                            </a>
                          }
                          @if (city.buy_count > 0) {
                            <a
                              [routerLink]="['/properties']"
                              [queryParams]="{ city_id: city.id, transaction_type: 'buy' }"
                              class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                              {{ city.buy_count }} {{ 'home.cityListings.toBuy' | translate }}
                            </a>
                          }
                        </div>
                      </div>
                    </article>
                  }
                </div>
              }
            </div>

            @if (!showAllCities && popularCities().length > cityPreviewCount) {
              <div class="mt-8 text-center">
                <button type="button" mat-stroked-button (click)="showAllCities = true">
                  {{ 'home.cityListings.seeMore' | translate }}
                  <mat-icon>expand_more</mat-icon>
                </button>
              </div>
            }
          </div>
        </section>

        <section class="bg-[#1a1a2e] py-16">
          <div class="container mx-auto px-4">
            <div class="mb-8 text-center">
              <h2 class="text-2xl font-bold text-white md:text-3xl">{{ 'home.buyOrRent.title' | translate }}</h2>
              <p class="mt-2 text-white/70">{{ 'home.buyOrRent.subtitle' | translate }}</p>
            </div>

            <div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
              <a [routerLink]="['/properties']" [queryParams]="{ transaction_type: 'buy' }" class="flex items-center gap-4 rounded-lg bg-white/10 p-6 transition-all hover:bg-white/20">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <mat-icon>home</mat-icon>
                </span>
                <span class="text-lg font-semibold text-white">{{ 'home.buyOrRent.wantToBuy' | translate }}</span>
              </a>

              <a [routerLink]="['/properties']" [queryParams]="{ transaction_type: 'rent' }" class="flex items-center gap-4 rounded-lg bg-white/10 p-6 transition-all hover:bg-white/20">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <mat-icon>key</mat-icon>
                </span>
                <span class="text-lg font-semibold text-white">{{ 'home.buyOrRent.wantToRent' | translate }}</span>
              </a>

              <a routerLink="/agencies" class="flex items-center gap-4 rounded-lg bg-white/10 p-6 transition-all hover:bg-white/20">
                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <mat-icon>business</mat-icon>
                </span>
                <span class="text-lg font-semibold text-white">{{ 'home.buyOrRent.lookingForAgency' | translate }}</span>
              </a>
            </div>
          </div>
        </section>

        <section class="bg-white py-12">
          <div class="container mx-auto px-4">
            <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 class="text-2xl font-bold text-[#1a1a2e]">{{ 'home.featured.title' | translate }}</h2>
                <p class="mt-1 text-gray-600">{{ 'home.featured.subtitle' | translate }}</p>
              </div>
              <a [routerLink]="['/properties']" class="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover">
                {{ 'home.featured.viewAll' | translate }}
                <mat-icon class="text-base">arrow_forward</mat-icon>
              </a>
            </div>

            @if (loadingProperties()) {
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @for (n of [1,2,3,4,5,6]; track n) {
                  <app-skeleton variant="property-card" />
                }
              </div>
            } @else if (featuredProperties().length === 0) {
              <div class="rounded-lg border border-gray-200 bg-white p-12 text-center text-gray-600">
                {{ 'home.featured.noProperties' | translate }}
              </div>
            } @else {
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @for (property of featuredProperties(); track property.id) {
                  <app-property-card [property]="property" />
                }
              </div>
            }
          </div>
        </section>

        <section class="bg-gray-50 py-12">
          <div class="container mx-auto px-4">
            <h2 class="mb-6 text-xl font-bold text-[#1a1a2e]">{{ 'home.info.title' | translate }}</h2>
            <div class="max-w-none text-sm text-gray-600">
              <p>{{ 'home.info.paragraph1' | translate }}</p>
              <p class="mt-4">{{ 'home.info.paragraph2' | translate }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class HomePageComponent implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly searchStore = inject(SearchStore);
  private readonly router = inject(Router);

  readonly featuredProperties = signal<Property[]>([]);
  readonly popularCities = signal<PopularCity[]>([]);
  readonly cantons = signal<Canton[]>([]);
  readonly loadingProperties = signal(true);

  readonly cityPreviewCount = 6;
  readonly fallbackCityImage = 'https://res.cloudinary.com/dzyyygr1x/image/upload/v1770906733/Gen%C3%A8ve_t33k2z.jpg';

  selectedSection: 'residential' | 'commercial' = 'residential';
  selectedCantonId = '';
  showAllCities = false;
  transactionType: TransactionType = 'rent';

  ngOnInit(): void {
    this.homeService.getFeaturedProperties().subscribe({
      next: (properties) => {
        this.featuredProperties.set(properties);
        this.loadingProperties.set(false);
      },
      error: () => this.loadingProperties.set(false),
    });

    this.homeService.getCantons().subscribe((cantons) => this.cantons.set(cantons));
    this.homeService.getPopularCities().subscribe((cities) => this.popularCities.set(cities));
  }

  cityRows(): PopularCity[][] {
    const cities = this.showAllCities ? this.popularCities() : this.popularCities().slice(0, this.cityPreviewCount);
    const rows: PopularCity[][] = [];

    for (let index = 0; index < cities.length; index += 2) {
      rows.push(cities.slice(index, index + 2));
    }

    return rows;
  }

  search(): void {
    this.searchStore.setFilters({
      search: undefined,
      canton_id: this.selectedCantonId || undefined,
      transaction_type: this.transactionType,
    });
    this.router.navigate(['/properties'], {
      queryParams: {
        transaction_type: this.transactionType,
        ...(this.selectedCantonId ? { canton_id: this.selectedCantonId } : {}),
        ...(this.selectedSection === 'commercial' ? { section: 'commercial' } : {}),
      },
    });
  }
}
