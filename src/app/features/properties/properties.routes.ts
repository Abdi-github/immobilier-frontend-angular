import { Routes } from '@angular/router';

export const PROPERTY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/property-list-page/property-list-page.component').then(
        (m) => m.PropertyListPageComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/property-detail-page/property-detail-page.component').then(
        (m) => m.PropertyDetailPageComponent,
      ),
  },
];
