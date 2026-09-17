// @ts-check
import { defineConfig } from 'astro/config';
import checkAlternates from './integrations/check-alternates.mjs';

// Sito utente di GitHub Pages: servito alla radice del dominio, quindi niente `base`.
export default defineConfig({
  site: 'https://zanzaro-mirco.github.io',
  trailingSlash: 'always',
  integrations: [checkAlternates()],
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      // L'italiano sta alla radice, l'inglese sotto /en/.
      prefixDefaultLocale: false,
    },
  },
});
