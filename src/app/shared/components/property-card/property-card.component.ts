import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Property } from '@core/models';
import { LocalizedFieldPipe } from '@shared/pipes/localized-field.pipe';
import { CurrencyChfPipe } from '@shared/pipes/currency-chf.pipe';

@Component({
  selector: 'app-property-card',
  imports: [
    RouterLink,
    TranslateModule,
    MatIconModule,
    LocalizedFieldPipe,
    CurrencyChfPipe,
  ],
  template: `
    <article
      class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
      (mouseenter)="isHovering.set(true)"
      (mouseleave)="isHovering.set(false)"
    >
      <!-- Image section -->
      <a [routerLink]="['/properties', property.id]" class="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        @if (currentImage) {
          <img
            [src]="currentImage.url"
            [alt]="property.title ?? ''"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        } @else {
          <div class="flex h-full w-full items-center justify-center">
            <mat-icon class="text-gray-300" style="font-size:3rem;width:3rem;height:3rem">home</mat-icon>
          </div>
        }

        <!-- Carousel arrows (visible on hover) -->
        @if (hasMultipleImages()) {
          <button
            type="button"
            (click)="prevImage($event)"
            class="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-opacity hover:bg-white"
            [class.opacity-100]="isHovering()"
            [class.opacity-0]="!isHovering()"
          >
            <mat-icon class="text-base leading-none">chevron_left</mat-icon>
          </button>
          <button
            type="button"
            (click)="nextImage($event)"
            class="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-opacity hover:bg-white"
            [class.opacity-100]="isHovering()"
            [class.opacity-0]="!isHovering()"
          >
            <mat-icon class="text-base leading-none">chevron_right</mat-icon>
          </button>
        }

        <!-- NEW badge -->
        @if (isNew) {
          <div class="absolute left-3 top-3">
            <span class="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white uppercase">NEW</span>
          </div>
        }

        <!-- Favorite button (always visible) -->
        <button
          type="button"
          (click)="onFavoriteClick($event)"
          class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
        >
          <mat-icon
            class="transition-colors"
            [class.text-red-500]="isFavorite"
            [class.text-gray-600]="!isFavorite"
            [style.font-size.px]="20"
            [style.width.px]="20"
            [style.height.px]="20"
          >{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>

        <!-- Dots / counter -->
        @if (hasMultipleImages()) {
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            @if (propertyImages.length <= 5) {
              @for (img of propertyImages; track img.id; let idx = $index) {
                <button
                  type="button"
                  (click)="goToImage($event, idx)"
                  class="h-2 w-2 rounded-full transition-colors"
                  [class.bg-white]="idx === currentIndex()"
                  [class.bg-white/50]="idx !== currentIndex()"
                ></button>
              }
            } @else {
              <span class="rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
                {{ currentIndex() + 1 }} / {{ propertyImages.length }}
              </span>
            }
          </div>
        }
      </a>

      <!-- Content section -->
      <div class="p-4">
        <!-- Price -->
        <div class="text-lg font-bold text-[#1a1a2e]">
          {{ property.price | currencyChf }}.-
          @if (property.transaction_type === 'rent') {
            <span class="font-normal text-gray-600 text-sm">/month</span>
          }
        </div>

        <!-- Type + rooms -->
        <p class="mt-1 text-sm text-gray-700">
          {{ property.category?.name | localizedField }}
          @if (property.rooms) { {{ property.rooms }} rooms }
        </p>

        <!-- Location -->
        <p class="mt-1 truncate text-sm text-gray-500">
          {{ property.city?.name | localizedField }}@if (property.address) {, {{ property.address }}}
        </p>

        <!-- Features + agency -->
        <div class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            @if (property.surface) {
              <span class="flex items-center gap-1">
                <mat-icon style="font-size:1rem;width:1rem;height:1rem">straighten</mat-icon>
                {{ property.surface }} m²
              </span>
            }
            @if (property.rooms) {
              <span class="flex items-center gap-1">
                <mat-icon style="font-size:1rem;width:1rem;height:1rem">bed</mat-icon>
                {{ property.rooms }}
              </span>
            }
          </div>

          @if (property.agency) {
            <div class="shrink-0">
              @if (property.agency.logo_url) {
                <img [src]="property.agency.logo_url" [alt]="property.agency.name || 'Agency'"
                     class="h-8 max-w-[80px] object-contain" />
              } @else {
                <div class="flex h-8 items-center rounded bg-gray-100 px-2 text-xs text-gray-500">
                  {{ truncate(property.agency.name || 'Agency') }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </article>
  `,
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Input() isFavorite = false;
  @Output() favoriteToggle = new EventEmitter<string>();

  readonly isHovering = signal(false);
  readonly currentIndex = signal(0);

  get propertyImages() {
    return this.property.images?.length ? this.property.images : [];
  }

  readonly hasMultipleImages = computed(() => this.propertyImages.length > 1);

  get currentImage() {
    const imgs = this.propertyImages;
    if (!imgs.length) return null;
    return imgs[this.currentIndex()] ?? imgs[0];
  }

  get isNew(): boolean {
    if (!this.property.published_at) return false;
    const diffDays = (Date.now() - new Date(this.property.published_at).getTime()) / 86_400_000;
    return diffDays <= 7;
  }

  prevImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const len = this.propertyImages.length;
    this.currentIndex.update((i) => (i === 0 ? len - 1 : i - 1));
  }

  nextImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const len = this.propertyImages.length;
    this.currentIndex.update((i) => (i === len - 1 ? 0 : i + 1));
  }

  goToImage(event: Event, idx: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentIndex.set(idx);
  }

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.property.id);
  }

  truncate(text: string, max = 10): string {
    return text.length > max ? text.slice(0, max) : text;
  }
}
