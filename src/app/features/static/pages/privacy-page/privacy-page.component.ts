import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-page',
  imports: [TranslateModule],
  template: `
    <div class="container mx-auto px-4 py-14 max-w-3xl">
      <h1 class="text-3xl font-bold mb-4">{{ 'static.privacy.title' | translate }}</h1>
      <p class="text-sm text-muted-foreground mb-8">{{ 'static.privacy.lastUpdated' | translate }}</p>
      <div class="prose prose-neutral max-w-none" [innerHTML]="'static.privacy.body' | translate"></div>
    </div>
  `,
})
export class PrivacyPageComponent {}
