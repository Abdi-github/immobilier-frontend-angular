import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { SupportedLanguage } from '@core/models';
import { environment } from '@env/environment';

interface LanguageState {
  current: SupportedLanguage;
}

function loadInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(environment.storageKeys.language);
  if (stored && (environment.supportedLanguages as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }

  // Try to match the browser language
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if ((environment.supportedLanguages as readonly string[]).includes(browserLang)) {
    return browserLang;
  }

  return environment.defaultLanguage as SupportedLanguage;
}

export const LanguageStore = signalStore(
  { providedIn: 'root' },
  withState<LanguageState>({ current: loadInitialLanguage() }),
  withMethods((store) => ({
    changeLanguage(lang: SupportedLanguage): void {
      patchState(store, { current: lang });
      localStorage.setItem(environment.storageKeys.language, lang);
      document.documentElement.lang = lang;
    },
  })),
);
