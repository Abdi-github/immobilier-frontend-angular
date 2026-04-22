import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  template: `
    @if (totalPages > 1) {
      <div class="flex items-center justify-center gap-1 py-6">
        <!-- Previous -->
        <button
          mat-icon-button
          [disabled]="currentPage <= 1"
          (click)="changePage(currentPage - 1)"
          [attr.aria-label]="'common.pagination.previous' | translate"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <!-- Page numbers -->
        @for (page of pages; track page) {
          @if (page === -1) {
            <span class="px-2 text-muted-foreground">…</span>
          } @else {
            <button
              mat-button
              class="min-w-[40px] h-10"
              [class.bg-primary]="page === currentPage"
              [class.text-white]="page === currentPage"
              [class.font-semibold]="page === currentPage"
              (click)="changePage(page)"
            >
              {{ page }}
            </button>
          }
        }

        <!-- Next -->
        <button
          mat-icon-button
          [disabled]="currentPage >= totalPages"
          (click)="changePage(currentPage + 1)"
          [attr.aria-label]="'common.pagination.next' | translate"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  @Input({ required: true }) currentPage = 1;
  @Input({ required: true }) totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const range: number[] = [];
    const delta = 2;
    const left = this.currentPage - delta;
    const right = this.currentPage + delta;

    let prev = 0;
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= left && i <= right)) {
        if (prev && i - prev > 1) range.push(-1); // ellipsis
        range.push(i);
        prev = i;
      }
    }
    return range;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
