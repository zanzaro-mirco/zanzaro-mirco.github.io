// Testi fissi dell'interfaccia, uno per lingua. I contenuti dei progetti stanno
// nelle content collection, non qui.

export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

const it = {
  'site.title': 'Mirco Zanzaro · Mobile developer',
  'site.description':
    'Mobile developer: Flutter, Kotlin, periferiche POS e Bluetooth LE. Cinque progetti open source, dal calcolo dello scontrino alla messa in servizio di una centralina.',

  'nav.label': 'Principale',
  'nav.skipToContent': 'Vai al contenuto',
  'nav.projects': 'Progetti',
  'nav.method': 'Come lavoro',
  'nav.languageShort': 'EN',
  'nav.languageSwitch': 'Read in English',
  'nav.themeToggle': 'Cambia tema chiaro o scuro',

  'anchor.projects': 'progetti',
  'anchor.method': 'come-lavoro',

  'home.eyebrow': 'Flutter · Dart · Android · Kotlin',
  'home.role': 'Mobile developer',
  'home.bio':
    "Da dodici anni scrivo software che parla con l'hardware: registratori di cassa, terminali di pagamento, stampanti fiscali, palmari da campo. Oggi lo faccio con Flutter e Kotlin.",
  'home.seeProjects': 'Vedi i progetti',
  'home.domains': 'Casse fiscali · Terminali di pagamento · Palmari da campo',
  'home.photoAlt': 'Ritratto di Mirco Zanzaro',

  'chain.kicker': 'La filiera',
  'chain.title': 'Dallo scontrino alla carta, anche senza rete',
  'chain.intro':
    'Tre progetti, un percorso solo: quello che faccio da dodici anni, riscritto in codice aperto e verificabile.',
  'chain.calculate': 'Calcola',
  'chain.calculateText': 'IVA, sconti, resi e pagamenti misti. Il centesimo deve tornare.',
  'chain.receiptTotal': 'TOTALE',
  'chain.receiptVat': 'di cui IVA 10%',
  'chain.receiptCoffee': 'Caffè',
  'chain.print': 'Stampa',
  'chain.printText': 'Lo scontrino diventa byte ESC/POS e arriva alla stampante via TCP o USB.',
  'chain.bytesCaption': 'inizializza · centra · grassetto · «TOTALE» · taglia',
  'chain.sync': 'Sincronizza',
  'chain.syncText': 'Internet cade, gli ordini no: i tablet si trovano in LAN ed eleggono la cassa.',
  'chain.register': 'cassa',
  'chain.tablets': 'tablet in sala · Wi-Fi del locale',

  'projects.kicker': 'Progetti',
  'projects.title': 'Cinque progetti, tutti con test e documentazione',
  'projects.intro':
    "Ogni repository ha un ARCHITECTURE.md che spiega le scelte, e cosa ho semplificato di proposito.",

  'method.kicker': 'Come lavoro',
  'method.title': 'Tre regole che valgono per ogni progetto',
  'method.criterion': 'Un criterio prima del codice',
  'method.criterionText':
    'Ogni funzionalità parte da una condizione verificabile, meglio se dentro un test. Senza quella non si comincia.',
  'method.falsify': 'Prima si falsifica',
  'method.falsifyText':
    'Tolgo la difesa e guardo il test diventare rosso. Se resta verde, il test non prova niente e va riscritto.',
  'method.limits': 'I limiti si scrivono',
  'method.limitsText':
    'Cosa non è verificato, cosa ho semplificato e perché: sta nella documentazione, non in una nota a voce.',

  'contact.kicker': 'Contatti',
  'contact.title': 'Parliamone',
  'contact.intro': 'Il modo più rapido per raggiungermi è LinkedIn.',
  'contact.linkedin': 'Scrivimi su LinkedIn',

  'project.details': 'Dettagli',
  'project.home': 'Home',
  'project.breadcrumb': 'Percorso',
  'project.problem': 'Il problema',
  'project.choices': 'Le scelte che vale la pena guardare',
  'project.lesson': 'Cosa ho imparato',
  'project.limits': 'Limiti dichiarati',
  'project.links': 'Link',
  'project.stack': 'Stack',
  'project.updated': 'Numeri aggiornati al',
  'project.otherProjects': 'Altri progetti',

  'link.repository': 'Repository su GitHub',
  'link.releases': 'Release e APK',
  'link.pubDev': 'su pub.dev',

  'notFound.title': 'Pagina non trovata',
  'notFound.text': 'Questa pagina non esiste, o è stata spostata.',
  'notFound.back': 'Torna alla home',

  'footer.madeWith': 'Sito statico costruito con Astro',
  'footer.source': 'codice sorgente',
} as const;

export type UiKey = keyof typeof it;

// Il tipo impone le stesse chiavi dell'italiano: una traduzione dimenticata non compila.
const en: Record<UiKey, string> = {
  'site.title': 'Mirco Zanzaro · Mobile developer',
  'site.description':
    'Mobile developer: Flutter, Kotlin, POS peripherals and Bluetooth LE. Five open source projects, from receipt calculation to commissioning a controller.',

  'nav.label': 'Main',
  'nav.skipToContent': 'Skip to content',
  'nav.projects': 'Projects',
  'nav.method': 'How I work',
  'nav.languageShort': 'IT',
  'nav.languageSwitch': 'Leggi in italiano',
  'nav.themeToggle': 'Switch between light and dark theme',

  'anchor.projects': 'projects',
  'anchor.method': 'how-i-work',

  'home.eyebrow': 'Flutter · Dart · Android · Kotlin',
  'home.role': 'Mobile developer',
  'home.bio':
    'For twelve years I have been writing software that talks to hardware: cash registers, payment terminals, fiscal printers, field handhelds. Today I do it with Flutter and Kotlin.',
  'home.seeProjects': 'See the projects',
  'home.domains': 'Fiscal cash registers · Payment terminals · Field handhelds',
  'home.photoAlt': 'Portrait of Mirco Zanzaro',

  'chain.kicker': 'The pipeline',
  'chain.title': 'From receipt to paper, even without a network',
  'chain.intro':
    'Three projects, one path: what I have been doing for twelve years, rewritten as open, verifiable code.',
  'chain.calculate': 'Calculate',
  'chain.calculateText': 'VAT, discounts, returns and split payments. Every cent must add up.',
  'chain.receiptTotal': 'TOTAL',
  'chain.receiptVat': 'incl. VAT 10%',
  'chain.receiptCoffee': 'Coffee',
  'chain.print': 'Print',
  'chain.printText': 'The receipt becomes ESC/POS bytes and reaches the printer over TCP or USB.',
  'chain.bytesCaption': 'initialize · center · bold · “TOTAL” · cut',
  'chain.sync': 'Sync',
  'chain.syncText':
    'The internet drops, the orders do not: tablets find each other on the LAN and elect the register.',
  'chain.register': 'register',
  'chain.tablets': 'dining room tablets · venue Wi-Fi',

  'projects.kicker': 'Projects',
  'projects.title': 'Five projects, all with tests and documentation',
  'projects.intro':
    'Every repository has an ARCHITECTURE.md explaining the choices, and what I simplified on purpose.',

  'method.kicker': 'How I work',
  'method.title': 'Three rules that apply to every project',
  'method.criterion': 'A criterion before the code',
  'method.criterionText':
    'Every feature starts from a verifiable condition, ideally inside a test. Without one, nothing starts.',
  'method.falsify': 'Falsify first',
  'method.falsifyText':
    'I remove the safeguard and watch the test turn red. If it stays green, the test proves nothing and gets rewritten.',
  'method.limits': 'Limits are written down',
  'method.limitsText':
    'What is not verified, what I simplified and why: it lives in the documentation, not in a spoken footnote.',

  'contact.kicker': 'Contact',
  'contact.title': "Let's talk",
  'contact.intro': 'The quickest way to reach me is LinkedIn.',
  'contact.linkedin': 'Message me on LinkedIn',

  'project.details': 'Details',
  'project.home': 'Home',
  'project.breadcrumb': 'Breadcrumb',
  'project.problem': 'The problem',
  'project.choices': 'Choices worth a look',
  'project.lesson': 'What I learned',
  'project.limits': 'Known limits',
  'project.links': 'Links',
  'project.stack': 'Stack',
  'project.updated': 'Figures as of',
  'project.otherProjects': 'Other projects',

  'link.repository': 'Repository on GitHub',
  'link.releases': 'Releases and APK',
  'link.pubDev': 'on pub.dev',

  'notFound.title': 'Page not found',
  'notFound.text': 'This page does not exist, or it has moved.',
  'notFound.back': 'Back to home',

  'footer.madeWith': 'Static site built with Astro',
  'footer.source': 'source code',
};

const ui: Record<Locale, Record<UiKey, string>> = { it, en };

export function useTranslations(locale: Locale) {
  return (key: UiKey): string => ui[locale][key];
}

/** La home di una lingua, con l'eventuale ancora. */
export function homePath(locale: Locale, anchor?: string): string {
  const base = locale === defaultLocale ? '/' : `/${locale}/`;
  return anchor ? `${base}#${anchor}` : base;
}

export const profileLinks = {
  linkedin: 'https://www.linkedin.com/in/mirco-zanzaro/',
  github: 'https://github.com/zanzaro-mirco',
  source: 'https://github.com/zanzaro-mirco/zanzaro-mirco.github.io',
} as const;
