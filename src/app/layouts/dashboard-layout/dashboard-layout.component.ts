import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStore } from '@state/auth.store';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  ownerOnly?: boolean;
}

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, TranslateModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <aside class="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-background">
        <div class="h-16 flex items-center px-6 border-b border-border">
          <a routerLink="/" class="text-lg font-bold text-primary">Immobilier<span class="text-muted-foreground text-sm">.ch</span></a>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-0.5">
          @for (item of navItems; track item.route) {
            @if (!item.ownerOnly || authStore.isOwnerOrAgent()) {
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-primary/10 text-primary font-semibold"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <mat-icon class="text-[20px] w-5 h-5">{{ item.icon }}</mat-icon>
                {{ item.label | translate }}
              </a>
            }
          }
        </nav>

        <div class="px-3 pb-4 border-t border-border pt-4">
          <div class="flex items-center gap-3 px-3 py-2">
            <mat-icon>account_circle</mat-icon>
            <div class="overflow-hidden">
              <p class="text-sm font-medium truncate">{{ authStore.fullName() }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ authStore.user()?.email }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col min-w-0">
        <header class="h-16 border-b border-border bg-background flex items-center px-6 gap-4 md:hidden">
          <a routerLink="/" class="text-lg font-bold text-primary">Immobilier</a>
        </header>
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  readonly authStore = inject(AuthStore);

  readonly navItems: NavItem[] = [
    { label: 'dashboard.nav.overview', icon: 'dashboard', route: '/dashboard' },
    { label: 'dashboard.nav.favorites', icon: 'favorite', route: '/dashboard/favorites' },
    { label: 'dashboard.nav.alerts', icon: 'notifications', route: '/dashboard/alerts' },
    { label: 'dashboard.nav.myProperties', icon: 'home_work', route: '/dashboard/properties', ownerOnly: true },
    { label: 'dashboard.nav.inquiries', icon: 'mail', route: '/dashboard/inquiries' },
    { label: 'dashboard.nav.profile', icon: 'person', route: '/dashboard/profile' },
  ];
}
