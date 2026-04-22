import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TranslateModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <mat-icon class="text-muted-foreground opacity-30" style="font-size: 96px; width: 96px; height: 96px;">
        home_work
      </mat-icon>
      <h1 class="text-6xl font-bold text-primary mt-6">404</h1>
      <h2 class="text-2xl font-semibold mt-2">{{ 'static.notFound.title' | translate }}</h2>
      <p class="text-muted-foreground mt-2 max-w-sm">{{ 'static.notFound.subtitle' | translate }}</p>
      <a routerLink="/" mat-flat-button color="primary" class="mt-8">
        {{ 'static.notFound.cta' | translate }}
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
