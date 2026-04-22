import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about-page',
  imports: [TranslateModule, MatButtonModule],
  template: `
    <div class="container mx-auto px-4 py-14 max-w-3xl">
      <h1 class="text-3xl font-bold mb-4">{{ 'static.about.title' | translate }}</h1>
      <p class="text-muted-foreground text-lg mb-8">{{ 'static.about.subtitle' | translate }}</p>
      <div class="prose prose-neutral max-w-none" [innerHTML]="'static.about.body' | translate"></div>
    </div>
  `,
})
export class AboutPageComponent {}
