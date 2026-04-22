import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { Category } from '@core/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-property-form-page',
  imports: [
    RouterLink,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="max-w-2xl">
      <div class="flex items-center gap-3 mb-6">
        <a routerLink="/dashboard/properties" mat-icon-button>
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1 class="text-2xl font-bold">
          {{ (isEdit() ? 'dashboard.properties.edit' : 'dashboard.properties.create') | translate }}
        </h1>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
        <!-- Title per language -->
        <div class="rounded-xl border border-border p-4 space-y-3">
          <h3 class="font-medium text-sm text-muted-foreground uppercase tracking-wide">{{ 'dashboard.properties.titleLabel' | translate }}</h3>
          @for (lang of langs; track lang) {
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ lang.toUpperCase() }}</mat-label>
              <input matInput [formControlName]="'title_' + lang" />
            </mat-form-field>
          }
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'dashboard.properties.price' | translate }}</mat-label>
          <input matInput type="number" formControlName="price" />
          <span matTextSuffix>CHF</span>
        </mat-form-field>

        <div class="grid sm:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'dashboard.properties.transactionType' | translate }}</mat-label>
            <mat-select formControlName="transaction_type">
              <mat-option value="rent">{{ 'properties.filters.rent' | translate }}</mat-option>
              <mat-option value="buy">{{ 'properties.filters.buy' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'dashboard.properties.category' | translate }}</mat-label>
            <mat-select formControlName="category_id">
              @for (cat of categories(); track cat.id) {
                <mat-option [value]="cat.id">{{ cat.name['en'] ?? cat.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'dashboard.properties.surface' | translate }}</mat-label>
            <input matInput type="number" formControlName="surface_area" />
            <span matTextSuffix>m²</span>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>{{ 'dashboard.properties.rooms' | translate }}</mat-label>
            <input matInput type="number" formControlName="rooms" />
          </mat-form-field>
        </div>

        <div class="flex gap-3 pt-2">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ 'common.buttons.save' | translate }}
          </button>
          <a routerLink="/dashboard/properties" mat-stroked-button>
            {{ 'common.buttons.cancel' | translate }}
          </a>
        </div>
      </form>
    </div>
  `,
})
export class PropertyFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly isEdit = signal(false);
  readonly saving = signal(false);
  readonly categories = signal<Category[]>([]);

  readonly langs = ['en', 'fr', 'de', 'it'];

  form = this.fb.nonNullable.group({
    title_en: ['', Validators.required],
    title_fr: [''],
    title_de: [''],
    title_it: [''],
    price: [0, [Validators.required, Validators.min(1)]],
    transaction_type: ['rent', Validators.required],
    category_id: ['', Validators.required],
    surface_area: [null as number | null],
    rooms: [null as number | null],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!id);

    this.api.getList<Category>('/public/categories').pipe(map((r) => r.data ?? [])).subscribe(
      (cats) => this.categories.set(cats),
    );

    if (id && id !== 'new') {
      this.api.get<unknown>(`/dashboard/properties/${id}`).subscribe((res: { data: unknown }) => {
        // Patch form with existing values
        const p = res.data as Record<string, unknown>;
        const title = p['title'] as Record<string, string> | undefined;
        this.form.patchValue({
          title_en: title?.['en'] ?? '',
          title_fr: title?.['fr'] ?? '',
          title_de: title?.['de'] ?? '',
          title_it: title?.['it'] ?? '',
          price: p['price'] as number,
          transaction_type: p['transaction_type'] as string,
          category_id: p['category_id'] as string,
          surface_area: p['surface_area'] as number | null,
          rooms: p['rooms'] as number | null,
        });
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      title: { en: raw.title_en, fr: raw.title_fr, de: raw.title_de, it: raw.title_it },
      price: raw.price,
      transaction_type: raw.transaction_type,
      category_id: raw.category_id,
      surface_area: raw.surface_area,
      rooms: raw.rooms,
    };

    const id = this.route.snapshot.paramMap.get('id');
    const req$ = id && id !== 'new'
      ? this.api.put<unknown>(`/dashboard/properties/${id}`, payload)
      : this.api.post<unknown>('/dashboard/properties', payload);

    req$.subscribe({
      next: () => this.router.navigate(['/dashboard/properties']),
      error: () => this.saving.set(false),
    });
  }
}
