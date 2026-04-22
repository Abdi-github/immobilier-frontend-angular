import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/overview-page/overview-page.component').then((m) => m.OverviewPageComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites-page/favorites-page.component').then((m) => m.FavoritesPageComponent),
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./pages/alerts-page/alerts-page.component').then((m) => m.AlertsPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
  },
];
