import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

type PropertyViewMode = 'grid' | 'list';

interface UiState {
  mobileMenuOpen: boolean;
  propertyViewMode: PropertyViewMode;
  theme: 'light' | 'dark';
}

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState<UiState>({
    mobileMenuOpen: false,
    propertyViewMode: 'grid',
    theme: 'light',
  }),
  withMethods((store) => ({
    toggleMobileMenu(): void {
      patchState(store, { mobileMenuOpen: !store.mobileMenuOpen() });
    },
    closeMobileMenu(): void {
      patchState(store, { mobileMenuOpen: false });
    },
    setPropertyViewMode(mode: PropertyViewMode): void {
      patchState(store, { propertyViewMode: mode });
    },
  })),
);
