import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatedField } from '@core/models';

// Returns the correct language variant of a TranslatedField,
// falling back to first available value if current lang isn't there
@Pipe({
  name: 'localizedField',
  pure: false, // needs to react to language changes
})
export class LocalizedFieldPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(field: TranslatedField | string | null | undefined): string {
    if (!field) return '';
    if (typeof field === 'string') return field;

    const lang = this.translate.currentLang as keyof TranslatedField || 'en';
    return field[lang] || field['en'] || field['fr'] || field['de'] || field['it'] || '';
  }
}
