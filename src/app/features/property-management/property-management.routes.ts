import { Routes } from '@angular/router';

export const PROPERTY_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/my-properties-page/my-properties-page.component').then(
        (m) => m.MyPropertiesPageComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/property-form-page/property-form-page.component').then(
        (m) => m.PropertyFormPageComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/property-form-page/property-form-page.component').then(
        (m) => m.PropertyFormPageComponent,
      ),
  },
];
