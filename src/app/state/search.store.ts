import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { TransactionType } from '@core/models';

export interface PropertyFilters {
  search?: string;
  transaction_type?: TransactionType;
  canton_id?: string;
  city_id?: string;
  category_id?: string;
  price_min?: number;
  price_max?: number;
  rooms_min?: number;
  rooms_max?: number;
  surface_min?: number;
  surface_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page: number;
  limit: number;
}

const DEFAULT_FILTERS: PropertyFilters = {
  search: undefined,
  transaction_type: undefined,
  canton_id: undefined,
  city_id: undefined,
  category_id: undefined,
  price_min: undefined,
  price_max: undefined,
  rooms_min: undefined,
  rooms_max: undefined,
  surface_min: undefined,
  surface_max: undefined,
  page: 1,
  limit: 21,
  sort_by: 'created_at',
  sort_order: 'desc',
};

export const SearchStore = signalStore(
  { providedIn: 'root' },
  withState<PropertyFilters>({ ...DEFAULT_FILTERS }),
  withMethods((store) => ({
    setFilters(partial: Partial<PropertyFilters>): void {
      // Reset to page 1 whenever filters change — makes sense UX-wise
      patchState(store, { ...partial, page: 1 });
    },
    setPage(page: number): void {
      patchState(store, { page });
    },
    resetFilters(): void {
      patchState(store, { ...DEFAULT_FILTERS });
    },
  })),
);
