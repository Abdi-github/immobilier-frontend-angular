import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Property, PropertyImage } from '@core/models';
import { PropertyService } from '../../property.service';
import { PropertyGalleryComponent } from '@shared/components/property-gallery/property-gallery.component';
import { PropertyMapComponent } from '@shared/components/property-map/property-map.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';
import { CurrencyChfPipe } from '@shared/pipes/currency-chf.pipe';
import { AreaPipe } from '@shared/pipes/area.pipe';
import { RoomsPipe } from '@shared/pipes/rooms.pipe';
import { AuthStore } from '@state/auth.store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-property-detail-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    PropertyGalleryComponent,
    PropertyMapComponent,
    SkeletonComponent,
    LocalizedFieldPipe,
    CurrencyChfPipe,
  ],
  template: `
    @if (loading()) {
      <div class="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <app-skeleton variant="block" class="h-72 rounded-xl" />
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <app-skeleton variant="text" />
            <app-skeleton variant="text" />
          </div>
        </div>
      </div>
    } @else if (property()) {
      <!-- Breadcrumb -->
      <nav class="mx-auto max-w-7xl px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
        <a routerLink="/" class="hover:text-gray-900">{{ 'common.nav.home' | translate }}</a>
        <mat-icon class="text-base text-gray-400">chevron_right</mat-icon>
        <a routerLink="/properties" class="hover:text-gray-900">{{ 'common.nav.properties' | translate }}</a>
        <mat-icon class="text-base text-gray-400">chevron_right</mat-icon>
        <span class="text-gray-900 truncate">{{ property()!.title | localizedField }}</span>
      </nav>

      <!-- Title + badges -->
      <div class="mx-auto max-w-7xl px-4 pb-4">
        <div class="flex items-start justify-between gap-4 mb-2">
          <div class="flex flex-wrap gap-2">
            <span class="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-primary text-white capitalize">
              {{ 'properties.filters.' + property()!.transaction_type | translate }}
            </span>
            @if (property()!.category?.name) {
              <span class="inline-block px-2.5 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-700">
                {{ property()!.category!.name | localizedField }}
              </span>
            }
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-full hover:bg-gray-100 text-gray-500" [attr.title]="'properties.detail.save' | translate">
              <mat-icon class="text-lg">favorite_border</mat-icon>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100 text-gray-500" [attr.title]="'properties.detail.share' | translate">
              <mat-icon class="text-lg">share</mat-icon>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-100 text-gray-500" [attr.title]="'properties.detail.print' | translate">
              <mat-icon class="text-lg">print</mat-icon>
            </button>
          </div>
        </div>
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">{{ property()!.title | localizedField }}</h1>
        <p class="mt-1 text-sm text-gray-500 flex items-center gap-1">
          <mat-icon class="text-base">location_on</mat-icon>
          {{ locationSummary() }}
        </p>
      </div>

      <!-- Gallery -->
      <div class="mx-auto max-w-7xl px-4 pb-2">
        <app-property-gallery [images]="images()" />
      </div>
      
      <div class="mx-auto max-w-7xl px-4 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main content -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Price + stats -->
            <div class="flex items-start gap-8 p-5 rounded-xl border border-gray-200 bg-white">
              <div>
                <p class="text-xs text-gray-500 mb-1">{{ property()!.transaction_type === 'rent' ? ('properties.detail.monthlyRent' | translate) : ('properties.detail.salePrice' | translate) }}</p>
                <span class="text-2xl font-bold text-primary">{{ property()!.price | currencyChf }}</span>
                @if (property()!.transaction_type === 'rent') {
                  <span class="text-sm text-gray-500">{{ 'common.units.month' | translate }}</span>
                }
              </div>
              @if (property()!.rooms) {
                <div class="text-center">
                  <mat-icon class="text-gray-400 text-2xl">meeting_room</mat-icon>
                  <p class="text-lg font-semibold">{{ property()!.rooms }}</p>
                  <p class="text-xs text-gray-500">{{ 'properties.detail.rooms' | translate }}</p>
                </div>
              }
              @if (property()!.surface) {
                <div class="text-center">
                  <mat-icon class="text-gray-400 text-2xl">crop_free</mat-icon>
                  <p class="text-lg font-semibold">{{ property()!.surface }} m²</p>
                  <p class="text-xs text-gray-500">{{ 'properties.detail.surface' | translate }}</p>
                </div>
              }
            </div>

            <!-- Description -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h2 class="text-xl font-bold mb-3">{{ 'properties.detail.description' | translate }}</h2>
              <p class="text-gray-600 whitespace-pre-line leading-relaxed">{{ displayDescription() }}</p>
            </div>

            <!-- Amenities -->
            @if (property()!.amenities?.length) {
              <div class="bg-white rounded-xl border border-gray-200 p-5">
                <h2 class="text-xl font-bold mb-3">{{ 'properties.detail.amenities' | translate }}</h2>
                <div class="flex flex-wrap gap-2">
                  @for (amenity of property()!.amenities!; track amenity.id) {
                    <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700">
                      <mat-icon class="text-base text-primary">check</mat-icon>
                      {{ amenity.name | localizedField }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Location details -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
              <h2 class="text-xl font-bold mb-4">{{ 'properties.detail.location' | translate }}</h2>
              <div class="grid grid-cols-2 gap-4 mb-4">
                @if (property()!.address) {
                  <div>
                    <p class="text-xs text-gray-500 mb-1">{{ 'properties.detail.address' | translate }}</p>
                    <p class="text-sm font-medium">{{ normalizedAddress() }}</p>
                  </div>
                }
                @if (property()!.city) {
                  <div>
                    <p class="text-xs text-gray-500 mb-1">{{ 'properties.detail.city' | translate }}</p>
                    <p class="text-sm font-medium">{{ property()!.city!.name | localizedField }}</p>
                  </div>
                }
                @if (property()!.canton) {
                  <div>
                    <p class="text-xs text-gray-500 mb-1">{{ 'properties.detail.canton' | translate }}</p>
                    <p class="text-sm font-medium">{{ property()!.canton!.name | localizedField }} ({{ property()!.canton!.code }})</p>
                  </div>
                }
              </div>
              <div class="rounded-lg overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                @if (hasCoordinates()) {
                  <app-property-map
                    [lat]="property()!.latitude!"
                    [lng]="property()!.longitude!"
                    [title]="(property()!.title | localizedField) ?? ''"
                  />
                } @else {
                  <p class="text-sm text-gray-400">{{ 'properties.detail.locationUnavailable' | translate }}</p>
                }
              </div>
            </div>

            <!-- Published + reference -->
            @if (property()!.published_at || property()!.id) {
              <div class="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                @if (property()!.published_at) {
                  <span>{{ 'properties.detail.publishedOn' | translate }} {{ localizedPublishedDate() }}</span>
                }
                @if (property()!.id) {
                  <span>{{ 'properties.detail.reference' | translate }} {{ property()!.id }}</span>
                }
              </div>
            }

          </div><!-- end main content -->

          <!-- Sidebar: contact form -->
          <aside>
            <div class="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                <mat-icon class="text-primary">mail</mat-icon>
                {{ 'properties.contact.title' | translate }}
              </h3>

              @if (property()!.agency) {
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                    @if (property()!.agency!.logo_url) {
                      <img [src]="property()!.agency!.logo_url" [alt]="property()!.agency!.name" class="w-full h-full object-contain rounded-lg" />
                    } @else {
                      <mat-icon class="text-gray-400 text-base">business</mat-icon>
                    }
                  </div>
                  <div>
                    <p class="font-medium text-sm">{{ property()!.agency!.name }}</p>
                    <p class="text-xs text-gray-500">{{ 'properties.contact.listedBy' | translate }}</p>
                  </div>
                </div>
              }

              @if (submitted()) {
                <div class="py-8 text-center text-green-600">
                  <mat-icon class="text-4xl">check_circle</mat-icon>
                  <p class="mt-2 font-medium">{{ 'properties.contact.thankYou' | translate }}</p>
                </div>
              } @else {
                <form [formGroup]="contactForm" (ngSubmit)="submitContact()" class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <mat-form-field appearance="outline" subscriptSizing="dynamic">
                      <mat-label>{{ 'properties.contact.firstName' | translate }}</mat-label>
                      <input matInput formControlName="contact_first_name" placeholder="John" />
                    </mat-form-field>
                    <mat-form-field appearance="outline" subscriptSizing="dynamic">
                      <mat-label>{{ 'properties.contact.lastName' | translate }}</mat-label>
                      <input matInput formControlName="contact_last_name" placeholder="Doe" />
                    </mat-form-field>
                  </div>
                  <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
                    <mat-label>{{ 'properties.contact.email' | translate }}</mat-label>
                    <input matInput type="email" formControlName="contact_email" placeholder="your@email.com" />
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
                    <mat-label>{{ 'properties.contact.phone' | translate }}</mat-label>
                    <input matInput formControlName="contact_phone" placeholder="+41 XX XXX XX XX" />
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="w-full" subscriptSizing="dynamic">
                    <mat-label>{{ 'properties.contact.message' | translate }}</mat-label>
                    <textarea matInput rows="4" formControlName="message"></textarea>
                  </mat-form-field>
                  <button type="submit" class="w-full h-12 rounded-lg bg-[#ef1d5e] text-white text-base font-medium transition-colors hover:bg-[#d91854] disabled:opacity-50 flex items-center justify-center gap-2"
                    [disabled]="contactForm.invalid || submitting()">
                    <mat-icon class="text-base">send</mat-icon>
                    {{ 'properties.contact.submit' | translate }}
                  </button>
                  <div class="grid grid-cols-2 gap-3 mt-2">
                    <button type="button" class="h-10 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <mat-icon class="text-base">call</mat-icon>
                      {{ 'properties.contact.call' | translate }}
                    </button>
                    <button type="button" class="h-10 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <mat-icon class="text-base">email</mat-icon>
                      {{ 'properties.contact.yourEmail' | translate }}
                    </button>
                  </div>
                </form>
              }
            </div>
          </aside>
        </div>
      </div>
    } @else {
      <div class="mx-auto max-w-7xl px-4 py-16 text-center text-gray-400">
        <mat-icon class="text-5xl opacity-30">home_work</mat-icon>
        <p class="mt-3 text-lg">{{ 'static.notFound.title' | translate }}</p>
        <a routerLink="/properties" mat-button color="primary" class="mt-4">{{ 'common.buttons.back' | translate }}</a>
      </div>
    }
  `,
})
export class PropertyDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);
  private readonly translate = inject(TranslateService);
  readonly authStore = inject(AuthStore);

  readonly property = signal<Property | null>(null);
  readonly images = signal<PropertyImage[]>([]);
  readonly loading = signal(true);
  readonly submitted = signal(false);
  readonly submitting = signal(false);

  private readonly fb = inject(FormBuilder);
  readonly contactForm = this.fb.nonNullable.group({
    contact_first_name: ['', Validators.required],
    contact_last_name: ['', Validators.required],
    contact_email: ['', [Validators.required, Validators.email]],
    contact_phone: [''],
    message: ['', Validators.required],
  });

  hasCoordinates(): boolean {
    const p = this.property();
    return p != null && p.latitude != null && p.longitude != null;
  }

  normalizedAddress(): string {
    const address = this.property()?.address ?? '';
    return address
      .replace(/\s*,\s*,+/g, ', ')
      .replace(/,+/g, ',')
      .replace(/,\s*/g, ', ')
      .trim();
  }

  private localizedValue(field: Property['city'] extends { name?: infer T } ? T : unknown): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    const translatedField = field as Record<string, string | undefined>;
    const lang = this.translate.currentLang || 'en';
    return translatedField[lang] || translatedField['en'] || translatedField['fr'] || translatedField['de'] || translatedField['it'] || '';
  }

  locationSummary(): string {
    const property = this.property();
    if (!property) return '';

    const parts = [
      this.normalizedAddress(),
      property.city ? this.localizedValue(property.city.name) : '',
    ].filter(Boolean);

    const summary = parts.join(', ');
    return property.canton?.code ? `${summary} (${property.canton.code})` : summary;
  }

  displayDescription(): string {
    const property = this.property();
    const rawDescription = property?.translation?.description || property?.description || '';
    if (!rawDescription) return '';

    const sanitizeDescription = (value: string): string => value
      .replace(/\[Original description in .*? follows\]/gi, '')
      .replace(/\bContact us today to schedule a viewing!?\b/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+([,.!?:;])/g, '$1')
      .trim();

    const markerMatch = rawDescription.match(/\[Original description in .*? follows\]/i);
    if (!markerMatch) {
      return sanitizeDescription(rawDescription);
    }

    const markerIndex = rawDescription.indexOf(markerMatch[0]);
    const translatedPart = sanitizeDescription(rawDescription.slice(0, markerIndex));
    const originalPart = sanitizeDescription(rawDescription.slice(markerIndex + markerMatch[0].length));
    const currentLang = this.translate.currentLang || 'en';

    if (currentLang === property?.source_language) {
      return originalPart || translatedPart;
    }

    return translatedPart || originalPart;
  }

  localizedPublishedDate(): string {
    const publishedAt = this.property()?.published_at;
    if (!publishedAt) return '';

    const localeByLanguage: Record<string, string> = {
      en: 'en-CH',
      fr: 'fr-CH',
      de: 'de-CH',
      it: 'it-CH',
    };

    const language = this.translate.currentLang || 'en';
    const locale = localeByLanguage[language] || 'en-CH';

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(publishedAt));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    forkJoin({
      property: this.propertyService.getPropertyById(id),
      images: this.propertyService.getPropertyImages(id),
    }).subscribe({
      next: ({ property, images }) => {
        this.property.set(property);
        this.images.set(images.length ? images : (property.images ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitContact(): void {
    if (this.contactForm.invalid) return;
    const id = this.property()!.id;
    this.submitting.set(true);
    this.propertyService.submitInquiry(id, {
      ...this.contactForm.getRawValue(),
      inquiry_type: 'general',
      preferred_contact_method: 'email',
      preferred_language: this.translate.currentLang,
    }).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }
}
