export const environment = {
  production: false,
  apiUrl: '/api/v1',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fr', 'de', 'it'] as const,
  storageKeys: {
    authToken: 'immo_auth_token',
    refreshToken: 'immo_refresh_token',
    user: 'immo_user',
    language: 'immo_language',
    theme: 'immo_theme',
  },
};
