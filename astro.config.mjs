// @ts-check
import { defineConfig } from 'astro/config';

// Sito utente di GitHub Pages: servito alla radice del dominio, quindi niente `base`.
export default defineConfig({
  site: 'https://zanzaro-mirco.github.io',
  trailingSlash: 'always',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      // L'italiano sta alla radice, l'inglese sotto /en/.
      prefixDefaultLocale: false,
    },
  },
});
