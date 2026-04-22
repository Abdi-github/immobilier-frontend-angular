import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStore } from '@state/auth.store';
import { UiStore } from '@state/ui.store';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  template: `
    <header class="sticky top-0 z-[60] w-full bg-white shadow-sm">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">

        <!-- Logo -->
        <a routerLink="/" class="flex shrink-0 items-center">
          <img src="/logo.svg" alt="immobilier.ch" class="h-8" />
        </a>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 lg:flex">
          <a routerLink="/properties" [queryParams]="{ section: 'residential' }"
             class="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary">
            {{ 'common.nav.residential' | translate }}
          </a>
          <a routerLink="/properties" [queryParams]="{ section: 'commercial' }"
             class="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary">
            {{ 'common.nav.commercial' | translate }}
          </a>
          <a routerLink="/agencies" routerLinkActive="text-primary"
             class="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary">
            {{ 'common.nav.agencies' | translate }}
          </a>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center gap-1">
          <app-language-switcher />

          <!-- Search icon -->
          <div class="hidden md:block">
            <a routerLink="/properties" mat-icon-button>
              <mat-icon>search</mat-icon>
            </a>
          </div>

          <!-- Favorites -->
          <div class="hidden md:block">
            <a [routerLink]="authStore.isAuthenticated() ? '/dashboard/favorites' : '/auth/login'" mat-icon-button>
              <mat-icon>favorite_border</mat-icon>
            </a>
          </div>

          <!-- Alerts -->
          <div class="hidden md:block">
            <a [routerLink]="authStore.isAuthenticated() ? '/dashboard/alerts' : '/auth/login'" mat-icon-button>
              <mat-icon>notifications_none</mat-icon>
            </a>
          </div>

          @if (authStore.isAuthenticated()) {
            <!-- Authenticated user menu -->
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="header-menu-panel" xPosition="before" yPosition="below" [overlapTrigger]="false">
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium">{{ authStore.fullName() }}</p>
              </div>
              <button mat-menu-item routerLink="/dashboard">
                <mat-icon>dashboard</mat-icon>
                {{ 'common.nav.dashboard' | translate }}
              </button>
              <button mat-menu-item routerLink="/dashboard/profile">
                <mat-icon>person</mat-icon>
                {{ 'common.nav.profile' | translate }}
              </button>
              <button mat-menu-item routerLink="/dashboard/favorites">
                <mat-icon>favorite_border</mat-icon>
                {{ 'common.nav.favorites' | translate }}
              </button>
              <button mat-menu-item routerLink="/dashboard/alerts">
                <mat-icon>notifications_none</mat-icon>
                {{ 'common.nav.alerts' | translate }}
              </button>
              @if (authStore.isOwnerOrAgent()) {
                <button mat-menu-item routerLink="/dashboard/properties">
                  <mat-icon>home_work</mat-icon>
                  {{ 'common.nav.myProperties' | translate }}
                </button>
              }
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="signOut()" class="text-red-600">
                <mat-icon class="text-red-600">logout</mat-icon>
                {{ 'common.nav.signOut' | translate }}
              </button>
            </mat-menu>
          } @else {
            <button mat-icon-button [matMenuTriggerFor]="guestMenu">
              <mat-icon>person_outline</mat-icon>
            </button>
            <mat-menu #guestMenu="matMenu" class="header-menu-panel" xPosition="before" yPosition="below" [overlapTrigger]="false">
              <button mat-menu-item routerLink="/auth/login">
                {{ 'common.nav.login' | translate }}
              </button>
              <button mat-menu-item routerLink="/auth/register">
                {{ 'common.nav.register' | translate }}
              </button>
            </mat-menu>
          }

          <!-- Mobile menu toggle -->
          <div class="block lg:hidden">
            <button mat-icon-button (click)="uiStore.toggleMobileMenu()">
              <mat-icon>{{ uiStore.mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile nav drawer -->
      @if (uiStore.mobileMenuOpen()) {
        <nav class="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col">
          <a routerLink="/properties" [queryParams]="{ section: 'residential' }"
             class="py-3 text-sm font-medium border-b border-gray-100"
             (click)="uiStore.closeMobileMenu()">
            {{ 'common.nav.residential' | translate }}
          </a>
          <a routerLink="/properties" [queryParams]="{ section: 'commercial' }"
             class="py-3 text-sm font-medium border-b border-gray-100"
             (click)="uiStore.closeMobileMenu()">
            {{ 'common.nav.commercial' | translate }}
          </a>
          <a routerLink="/agencies"
             class="py-3 text-sm font-medium border-b border-gray-100"
             (click)="uiStore.closeMobileMenu()">
            {{ 'common.nav.agencies' | translate }}
          </a>
          @if (authStore.isAuthenticated()) {
            <a routerLink="/dashboard"
               class="py-3 text-sm font-medium border-b border-gray-100 flex items-center gap-2"
               (click)="uiStore.closeMobileMenu()">
              <mat-icon class="text-base">dashboard</mat-icon>
              {{ 'common.nav.dashboard' | translate }}
            </a>
            <a routerLink="/dashboard/favorites"
               class="py-3 text-sm font-medium border-b border-gray-100 flex items-center gap-2"
               (click)="uiStore.closeMobileMenu()">
              <mat-icon class="text-base">favorite_border</mat-icon>
              {{ 'common.nav.favorites' | translate }}
            </a>
            <button class="py-3 text-sm font-medium text-left text-red-600 flex items-center gap-2"
               (click)="signOut(); uiStore.closeMobileMenu()">
              <mat-icon class="text-base text-red-600">logout</mat-icon>
              {{ 'common.nav.signOut' | translate }}
            </button>
          } @else {
            <a routerLink="/auth/login"
               class="mt-3 py-2.5 px-4 bg-primary text-white rounded-md text-sm font-medium text-center"
               (click)="uiStore.closeMobileMenu()">
              {{ 'common.nav.signIn' | translate }}
            </a>
          }
        </nav>
      }
    </header>
  `,
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);
  readonly uiStore = inject(UiStore);
  private readonly router = inject(Router);

  signOut(): void {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}

