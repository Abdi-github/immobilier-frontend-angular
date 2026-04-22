import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-property-gallery',
  imports: [MatIconModule, MatButtonModule],
  template: `
    @if (images.length > 0) {
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="relative md:hidden">
          <div class="aspect-[16/11] overflow-hidden bg-gray-100">
            <img
              [src]="activeImage().url"
              [alt]="activeImage().alt_text ?? 'Property image'"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          @if (images.length > 1) {
            <div class="absolute inset-x-0 top-3 flex items-center justify-between px-3">
              <div class="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
                {{ currentIndex + 1 }} / {{ images.length }}
              </div>
            </div>

            <button
              mat-icon-button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 text-white hover:bg-black/60"
              (click)="prev()"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button
              mat-icon-button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 text-white hover:bg-black/60"
              (click)="next()"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>

            <div class="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 px-3">
              @for (image of images; track image.url; let i = $index) {
                <button
                  type="button"
                  class="h-1.5 rounded-full transition-all"
                  [class.w-6]="i === currentIndex"
                  [class.w-2]="i !== currentIndex"
                  [class.bg-white]="i === currentIndex"
                  [class.bg-white/45]="i !== currentIndex"
                  (click)="goTo(i)"
                ></button>
              }
            </div>
          }
        </div>

        <div class="hidden gap-1 md:grid md:grid-cols-[minmax(0,2.1fr)_minmax(260px,1fr)]">
          <div class="relative min-h-[430px] overflow-hidden bg-gray-100">
            <img
              [src]="activeImage().url"
              [alt]="activeImage().alt_text ?? 'Property image'"
              class="h-full w-full object-cover"
              loading="lazy"
            />

            @if (images.length > 1) {
              <div class="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <div class="rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white">
                  {{ currentIndex + 1 }} / {{ images.length }}
                </div>
                <div class="flex items-center gap-2">
                  <button
                    mat-icon-button
                    type="button"
                    class="bg-black/45 text-white hover:bg-black/60"
                    (click)="prev()"
                  >
                    <mat-icon>chevron_left</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    type="button"
                    class="bg-black/45 text-white hover:bg-black/60"
                    (click)="next()"
                  >
                    <mat-icon>chevron_right</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>

          <div
            class="grid gap-1"
            [class.grid-rows-2]="previewImages().length > 1"
            [class.grid-rows-1]="previewImages().length <= 1"
          >
            @for (preview of previewImages(); track preview.image.url) {
              <button
                type="button"
                class="group relative overflow-hidden bg-gray-100 text-left"
                (click)="goTo(preview.index)"
              >
                <img
                  [src]="preview.image.url"
                  [alt]="preview.image.alt_text ?? 'Property preview'"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                @if ($index === previewImages().length - 1 && hiddenImagesCount() > 0) {
                  <div class="absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-semibold text-white">
                    +{{ hiddenImagesCount() }}
                  </div>
                }
              </button>
            }
          </div>
        </div>

        @if (images.length > 1) {
          <div class="flex gap-2 overflow-x-auto border-t border-gray-100 px-3 py-3">
            @for (image of images; track image.url; let i = $index) {
              <button
                type="button"
                class="h-16 w-24 flex-none overflow-hidden rounded-xl border-2 transition-colors"
                [class.border-primary]="i === currentIndex"
                [class.border-transparent]="i !== currentIndex"
                (click)="goTo(i)"
              >
                <img
                  [src]="image.url"
                  [alt]="image.alt_text ?? 'Property thumbnail'"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class PropertyGalleryComponent implements OnChanges {
  @Input({ required: true }) images: Array<{ url: string; alt_text?: string }> = [];
  currentIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'] && this.currentIndex >= this.images.length) {
      this.currentIndex = 0;
    }
  }

  prev(): void {
    this.goTo((this.currentIndex - 1 + this.images.length) % this.images.length);
  }

  next(): void {
    this.goTo((this.currentIndex + 1) % this.images.length);
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  activeImage(): { url: string; alt_text?: string } {
    return this.images[this.currentIndex] ?? this.images[0];
  }

  previewImages(): Array<{ index: number; image: { url: string; alt_text?: string } }> {
    const previews: Array<{ index: number; image: { url: string; alt_text?: string } }> = [];

    for (let offset = 1; offset < Math.min(this.images.length, 3); offset += 1) {
      const index = (this.currentIndex + offset) % this.images.length;
      previews.push({ index, image: this.images[index] });
    }

    return previews;
  }

  hiddenImagesCount(): number {
    return Math.max(0, this.images.length - 1 - this.previewImages().length);
  }
}
