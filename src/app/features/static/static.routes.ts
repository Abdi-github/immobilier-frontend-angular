import { Routes } from '@angular/router';

export const STATIC_ROUTES: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about-page/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/terms-page/terms-page.component').then((m) => m.TermsPageComponent),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy-page/privacy-page.component').then((m) => m.PrivacyPageComponent),
  },
];
