import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

// Auth layout matching React AuthLayout.tsx
// White header + dark banner + 2-col card (form | features)
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, TranslateModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50">

      <!-- Header -->
      <header class="bg-white border-b">
        <div class="container mx-auto px-4 py-4">
          <a routerLink="/" class="flex items-center">
            <img src="/logo.svg" alt="immobilier.ch" class="h-8" />
          </a>
        </div>
      </header>

      <!-- Professional banner -->
      <div class="bg-[#1a1a2e] text-white py-2 text-center text-sm">
        {{ 'auth.layout.bannerPrompt' | translate }}&nbsp;
        <a routerLink="/auth/register" class="underline hover:text-gray-200">{{ 'auth.layout.bannerLink' | translate }}</a>
      </div>

      <!-- Main content -->
      <main class="container mx-auto px-4 py-8 lg:py-12">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-6xl mx-auto">

          <!-- Left: Form card -->
          <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <router-outlet />
          </div>

          <!-- Right: Features panel (desktop only) -->
          <div class="hidden lg:block">
            <div class="space-y-6">
              <div class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mat-icon class="text-primary text-xl">notifications</mat-icon>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ 'auth.layout.alertsTitle' | translate }}</h3>
                  <p class="text-sm text-gray-600">{{ 'auth.layout.alertsDescription' | translate }}</p>
                </div>
              </div>

              <div class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mat-icon class="text-primary text-xl">show_chart</mat-icon>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ 'auth.layout.preEstimatesTitle' | translate }}</h3>
                  <p class="text-sm text-gray-600">{{ 'auth.layout.preEstimatesDescription' | translate }}</p>
                </div>
              </div>

              <div class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mat-icon class="text-primary text-xl">folder_open</mat-icon>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ 'auth.layout.filesTitle' | translate }}</h3>
                  <p class="text-sm text-gray-600">{{ 'auth.layout.filesDescription' | translate }}</p>
                </div>
              </div>

              <div class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mat-icon class="text-primary text-xl">favorite</mat-icon>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ 'auth.layout.favoritesTitle' | translate }}</h3>
                  <p class="text-sm text-gray-600">{{ 'auth.layout.favoritesDescription' | translate }}</p>
                </div>
              </div>

              <div class="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <mat-icon class="text-primary text-xl">history</mat-icon>
                  </div>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ 'auth.layout.recentTitle' | translate }}</h3>
                  <p class="text-sm text-gray-600">{{ 'auth.layout.recentDescription' | translate }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
})
export class AuthLayoutComponent {}

