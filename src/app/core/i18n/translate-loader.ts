import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// One JSON file per feature namespace — keeps translation files small and maintainable.
// If a namespace file fails to load (404 on first deploy etc.), we fall back to empty
// so the rest of the app keeps working instead of breaking entirely.
const NAMESPACES = [
  'common',
  'home',
  'properties',
  'agencies',
  'auth',
  'dashboard',
  'static',
];

export class MultiFileTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = NAMESPACES.map((ns) =>
      this.http.get<TranslationObject>(`/assets/i18n/${lang}/${ns}.json`).pipe(
        map((data) => ({ [ns]: data }) as TranslationObject),
        catchError(() => of({ [ns]: {} } as TranslationObject)),
      ),
    );

    return forkJoin(requests).pipe(
      map((results) => Object.assign({}, ...results)),
    );
  }
}

export function createTranslateLoader(http: HttpClient): MultiFileTranslateLoader {
  return new MultiFileTranslateLoader(http);
}
