// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import checkAlternates from './integrations/check-alternates.mjs';
import checkLinks from './integrations/check-links.mjs';

const site = 'https://zanzaro-mirco.github.io';

// Sito utente di GitHub Pages: servito alla radice del dominio, quindi niente `base`.
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT', en: 'en-US' },
      },
      // La 404 non è una pagina da indicizzare.
      filter: (page) => !page.startsWith(`${site}/404`),
    }),
    // I controlli vengono dopo la sitemap, così trovano anche i suoi file.
    checkAlternates(),
    checkLinks(),
  ],
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      // L'italiano sta alla radice, l'inglese sotto /en/.
      prefixDefaultLocale: false,
    },
  },
});
