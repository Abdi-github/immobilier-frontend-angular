import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageStore } from '@state/language.store';
import { SupportedLanguage } from '@core/models';
import { environment } from '@env/environment';

@Component({
  selector: 'app-language-switcher',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <button mat-button [matMenuTriggerFor]="langMenu" class="gap-1.5">
      <mat-icon>language</mat-icon>
      <span class="text-sm font-medium uppercase">{{ currentLang }}</span>
      <mat-icon class="text-base">expand_more</mat-icon>
    </button>

    <mat-menu #langMenu="matMenu" class="header-menu-panel" xPosition="before" yPosition="below" [overlapTrigger]="false">
      @for (lang of supportedLanguages; track lang) {
        <button
          mat-menu-item
          (click)="selectLanguage(lang)"
          [class.font-semibold]="lang === currentLang"
        >
          {{ 'common.language.' + lang | translate }}
        </button>
      }
    </mat-menu>
  `,
})
export class LanguageSwitcherComponent {
  private readonly translate = inject(TranslateService);
  private readonly languageStore = inject(LanguageStore);

  readonly supportedLanguages = environment.supportedLanguages as unknown as SupportedLanguage[];

  get currentLang(): string {
    return this.languageStore.current();
  }

  selectLanguage(lang: SupportedLanguage): void {
    this.languageStore.changeLanguage(lang);
    this.translate.use(lang);
  }
}
