import { Component, Input } from '@angular/core';

// Animated skeleton placeholder — using CSS animation defined in styles.css
@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `
    @switch (variant) {
      @case ('property-card') {
        <div class="bg-card rounded-xl overflow-hidden border border-border">
          <div class="skeleton aspect-[4/3] w-full"></div>
          <div class="p-4 space-y-2">
            <div class="skeleton h-5 w-3/4 rounded"></div>
            <div class="skeleton h-4 w-1/2 rounded"></div>
            <div class="skeleton h-4 w-2/3 rounded mt-3"></div>
          </div>
        </div>
      }
      @case ('text') {
        <div class="skeleton h-4 rounded" [style.width]="width"></div>
      }
      @case ('circle') {
        <div class="skeleton rounded-full" [style.width]="size" [style.height]="size"></div>
      }
      @default {
        <div class="skeleton rounded" [style.width]="width" [style.height]="height"></div>
      }
    }
  `,
})
export class SkeletonComponent {
  @Input() variant: 'property-card' | 'text' | 'circle' | 'block' = 'block';
  @Input() width = '100%';
  @Input() height = '16px';
  @Input() size = '40px';
}
