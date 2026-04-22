import { Routes } from '@angular/router';

export const AGENCY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/agencies-list-page/agencies-list-page.component').then(
        (m) => m.AgenciesListPageComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/agency-detail-page/agency-detail-page.component').then(
        (m) => m.AgencyDetailPageComponent,
      ),
  },
];
