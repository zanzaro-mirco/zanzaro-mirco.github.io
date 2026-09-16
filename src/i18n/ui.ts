// Testi fissi dell'interfaccia, uno per lingua. I contenuti dei progetti stanno
// nelle content collection, non qui.

export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
};

const ui = {
  it: {
    'site.title': 'Mirco Zanzaro · Mobile developer',
    'site.description':
      'Mobile developer: Flutter, Kotlin e periferiche POS. Quattro progetti open source, dal calcolo dello scontrino alla stampante.',
    'nav.skipToContent': 'Vai al contenuto',
    'nav.languageSwitch': 'Read in English',
    'home.role': 'Mobile developer',
    'footer.source': 'Codice sorgente del sito',
  },
  en: {
    'site.title': 'Mirco Zanzaro · Mobile developer',
    'site.description':
      'Mobile developer: Flutter, Kotlin and POS peripherals. Four open source projects, from receipt calculation to the printer.',
    'nav.skipToContent': 'Skip to content',
    'nav.languageSwitch': 'Leggi in italiano',
    'home.role': 'Mobile developer',
    'footer.source': 'Site source code',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['it'];

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
