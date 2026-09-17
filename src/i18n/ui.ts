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
    'home.bio':
      "Da dodici anni scrivo software che parla con l'hardware: registratori di cassa, terminali di pagamento, stampanti fiscali, palmari da campo. Oggi lo faccio con Flutter e Kotlin.",
    'home.projects': 'Progetti',
    'project.details': 'Dettagli',
    'project.problem': 'Il problema',
    'project.choices': 'Le scelte che vale la pena guardare',
    'project.lesson': 'Cosa ho imparato',
    'project.limits': 'Limiti dichiarati',
    'project.links': 'Link',
    'project.stack': 'Stack',
    'project.updated': 'Numeri aggiornati al',
    'link.repository': 'Repository su GitHub',
    'link.releases': 'Release e APK',
    'link.pubDev': 'su pub.dev',
    'footer.source': 'Codice sorgente del sito',
  },
  en: {
    'site.title': 'Mirco Zanzaro · Mobile developer',
    'site.description':
      'Mobile developer: Flutter, Kotlin and POS peripherals. Four open source projects, from receipt calculation to the printer.',
    'nav.skipToContent': 'Skip to content',
    'nav.languageSwitch': 'Leggi in italiano',
    'home.role': 'Mobile developer',
    // Da tradurre al passo 4, insieme ai progetti.
    'home.bio':
      "Da dodici anni scrivo software che parla con l'hardware: registratori di cassa, terminali di pagamento, stampanti fiscali, palmari da campo. Oggi lo faccio con Flutter e Kotlin.",
    'home.projects': 'Projects',
    'project.details': 'Details',
    'project.problem': 'The problem',
    'project.choices': 'Choices worth a look',
    'project.lesson': 'What I learned',
    'project.limits': 'Known limits',
    'project.links': 'Links',
    'project.stack': 'Stack',
    'project.updated': 'Figures as of',
    'link.repository': 'Repository on GitHub',
    'link.releases': 'Releases and APK',
    'link.pubDev': 'on pub.dev',
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
