import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  // ── Main layout ───────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('@layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'properties',
        loadChildren: () =>
          import('@features/properties/properties.routes').then((m) => m.PROPERTY_ROUTES),
      },
      {
        path: 'agencies',
        loadChildren: () =>
          import('@features/agencies/agencies.routes').then((m) => m.AGENCY_ROUTES),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('@features/static/pages/about-page/about-page.component').then(
            (m) => m.AboutPageComponent,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('@features/static/pages/contact-page/contact-page.component').then(
            (m) => m.ContactPageComponent,
          ),
      },
      {
        path: 'terms',
        loadComponent: () =>
          import('@features/static/pages/terms-page/terms-page.component').then(
            (m) => m.TermsPageComponent,
          ),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('@features/static/pages/privacy-page/privacy-page.component').then(
            (m) => m.PrivacyPageComponent,
          ),
      },
    ],
  },

  // ── Auth layout ───────────────────────────────────────────────
  {
    path: 'auth',
    loadComponent: () =>
      import('@layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // ── Dashboard (requires authentication) ──────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    loadChildren: () =>
      import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },

  // ── Property management (owner/agent/admin only) ─────────────
  {
    path: 'dashboard/properties',
    canActivate: [roleGuard(['owner', 'agent', 'agency_admin', 'platform_admin', 'super_admin'])],
    loadChildren: () =>
      import('@features/property-management/property-management.routes').then(
        (m) => m.PROPERTY_MANAGEMENT_ROUTES,
      ),
  },

  // ── 404 ───────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () =>
      import('@shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
