# Architettura

Questo documento spiega perché il sito è fatto così, e dove ho semplificato di proposito.
Com'è fatto, cioè cartelle e comandi, sta nel [README](README.md).

## A cosa serve

Il sito mette in un unico posto i cinque progetti del portfolio, per chi seleziona
candidati per un ruolo da mobile developer. Chi lo apre ha pochi minuti, spesso dal telefono,
e deve poter verificare ciò che legge: ogni numero porta a un repository, a pub.dev o a una
Release.

Da questo seguono quasi tutte le scelte: deve caricarsi subito, leggersi bene su uno schermo
piccolo, farsi trovare, e non dire niente che il codice non confermi.

## Le scelte

### Un sito statico con Astro, non Flutter Web

Flutter Web sarebbe stato coerente con il profilo, e un argomento di colloquio. Ma pesa
qualche megabyte al primo caricamento, si indicizza male ed è scomodo da leggere su desktop:
proprio i tre difetti che un sito-curriculum non può avere.

Astro genera HTML in fase di build, e di default non manda JavaScript al browser. Il
risultato misurato è 100 su 100 in tutte le categorie di Lighthouse, in emulazione mobile.
La competenza su Flutter la dimostrano i progetti, non il contenitore.

### GitHub Pages

Gratuito, e il deploy passa da GitHub Actions come per il resto del portfolio. Il repository
si chiama `zanzaro-mirco.github.io`, quindi il sito è servito alla radice del dominio e non
serve un `base` nella configurazione. Un dominio personale si può aggiungere dopo senza
toccare il codice.

### L'italiano alla radice, l'inglese sotto `/en/`

I repository e la loro documentazione sono in italiano, e l'italiano è la lingua principale.
L'inglese serve a chi seleziona per aziende con team internazionali. Anche i percorsi sono
tradotti (`/progetti/` e `/en/projects/`), perché un URL fa parte di ciò che si legge.

Ogni pagina dichiara la sua gemella con `hreflang`, e il selettore di lingua usa gli stessi
percorsi. Così un solo dato decide sia dove porta il pulsante sia cosa vedono i motori di
ricerca.

### I progetti come contenuti con uno schema

Ogni progetto è un file Markdown per lingua. Tutto ciò che la pagina mostra in blocchi
(numeri, scelte, lezione, limiti, link) sta nel frontmatter, validato da uno schema zod. Il
corpo del Markdown è solo «il problema».

La ragione è che un campo dimenticato deve fermare la build, non far sparire in silenzio un
blocco dalla pagina. Verificato togliendo `lesson`, poi `updated`, poi scrivendo un URL senza
`https://`: tre build rosse, con file e campo indicati.

Il frontmatter non è Markdown. L'unica formattazione ammessa è il codice fra backtick, che
diventa `<code>` dopo l'escape di tutto il resto: un testo di contenuto non deve poter
iniettare HTML.

### Due controlli che leggono l'HTML generato

A fine build due integrazioni leggono le pagine prodotte, non i sorgenti:

- **`check-alternates`**: ogni `hreflang` deve portare a una pagina che esiste. Una scheda
  tradotta in una lingua sola fa fallire la build.
- **`check-links`**: ogni link interno, compresi `srcset`, canonical e Open Graph, deve
  portare a un file che esiste, e ogni ancora a un `id` presente nella pagina di arrivo.

Leggere l'HTML invece della collezione dei contenuti costa un po' di codice in più, ma
copre anche le pagine scritte a mano e i link composti nei componenti, che sono il posto
dove si rompono davvero.

Tutti e due sono stati scritti prima di ciò che controllano, e falsificati. Il controllo
delle gemelle falliva sul codice di allora indicando le quattro pagine inglesi mancanti;
poi, tolta una scheda inglese e una italiana, due build rosse. Il controllo dei link è stato
provato con un percorso sbagliato e con un `id` cambiato.

Il primo tentativo del controllo delle gemelle falliva per il motivo sbagliato: cercava la
404 come `404/index.html`, mentre Astro la scrive come `404.html`. Una falsificazione che
fallisce per un altro motivo non prova niente, quindi l'ho corretta prima di contarla.

### La pubblicazione dietro i controlli

La pipeline ha tre job in fila: `verify`, `build-pages`, `deploy`. La pubblicazione parte
solo se `verify` è verde, e solo dai push su `main`. `verify` ripete i tipi e la build (con i
due controlli), verifica i link verso altri siti con lychee e misura quattro pagine con
Lighthouse.

Con un workflow di deploy separato un link rotto sarebbe arrivato online insieme a una
pipeline rossa. Così non arriva.

### Lighthouse con soglia 95

Quattro pagine, due per lingua fra home e progetti, mediana di tre esecuzioni in emulazione
mobile. La soglia è 95 su prestazioni, accessibilità, best practice e SEO.

La soglia è stata provata togliendo l'`alt` alla foto nell'HTML generato: l'accessibilità
scende a 94 e la SEO a 92, e l'esecuzione fallisce.

### Un solo script, e il tema che non ne dipende

Il tema scuro segue `prefers-color-scheme` con il solo CSS. Il JavaScript del sito serve solo
al tema, in due script in linea da poche righe. Quello in fondo alla pagina gestisce il
pulsante nella barra e salva la scelta in `localStorage`, dentro un `try`. Quello in testa
applica la scelta salvata prima del primo disegno, per evitare il lampo del tema sbagliato.
Senza JavaScript il pulsante resta nascosto e il sito funziona uguale.

### La foto e l'anteprima per i social

La foto passa da `astro:assets`: da un PNG di 480 kB escono varianti WebP fra 2 e 27 kB, e il
browser sceglie in base alla larghezza.

L'immagine di anteprima per LinkedIn e le chat (`public/og-image.png`, 1200×630) la genera uno
script con sharp, ma il PNG è versionato invece di essere prodotto in build. Il testo si
disegna con i font installati sulla macchina, e l'immagine pubblicata deve essere quella
guardata, non quella che esce da un runner con font diversi.

### Il design

La fascia blu con la griglia a puntini riprende le copertine del profilo LinkedIn, così chi
arriva da lì riconosce il sito. La filiera usa materiale vero invece di illustrazioni: uno
scontrino i cui conti tornano (2,40 lordo al 10% fa 0,22 d'imposta) e i byte ESC/POS reali per
inizializzare, centrare, mettere in grassetto e tagliare.

Font di sistema, nessun framework CSS. I colori sono variabili su `:root`, ridefinite per il
tema scuro.

## Dove ho consapevolmente semplificato

- **I numeri sono statici, con una data.** Test, punteggi e versioni stanno nel Markdown con il
  giorno in cui sono stati verificati, invece di essere letti da pub.dev o da GitHub in fase
  di build. Una lettura automatica renderebbe la build dipendente dalla rete e dai limiti
  delle API, per numeri che cambiano poche volte l'anno. Il prezzo è che vanno aggiornati a
  mano, e la data dice a chi legge quanto sono freschi.
- **Il controllo delle traduzioni verifica che esistano, non che dicano la stessa cosa.** Se un
  numero cambia in italiano, l'inglese va aggiornato a mano. Confrontare i frontmatter delle
  due lingue sarebbe possibile per i numeri, non per i testi.
- **La sitemap dichiara le coppie di lingue solo per la home.** Il plugin abbina le pagine con
  lo stesso percorso, e i progetti stanno sotto `/progetti/` e `/en/projects/`. Ogni pagina
  dichiara comunque i suoi `hreflang` nell'HTML, che i motori di ricerca accettano come
  alternativa alla sitemap.
- **Nessuna email, nessun modulo di contatto.** I contatti sono LinkedIn e GitHub. È una scelta
  di sicurezza: un indirizzo in chiaro attira spam, e un modulo richiederebbe un backend o un
  servizio esterno.
- **Nessuna statistica di visita.** Non serve un banner dei cookie. Se servissero dei numeri, la
  prima scelta sarebbe uno strumento senza cookie.
- **LinkedIn non è nel controllo dei link.** Ai client automatici risponde 999 anche per i
  profili che esistono, e un controllo che fallisce sempre si impara a ignorare. Anche il sito
  stesso è escluso da lychee, perché i suoi link li controlla già la build.
- **La soglia di accessibilità è vicina al primo errore.** Un solo `alt` mancante porta il
  punteggio a 94. È voluto, ma significa anche che un falso positivo di Lighthouse
  fermerebbe la pubblicazione.
- **Un'immagine di anteprima sola per le due lingue.** Contiene solo testi che non si
  traducono: nome, ruolo, tecnologie, indirizzo.
- **Una 404 sola, bilingue.** GitHub Pages serve un unico `404.html` per tutto il sito, e
  scegliere la lingua dal percorso richiederebbe JavaScript.
- **Sulla scheda di un progetto con due pacchetti non c'è il link a pub.dev.** I due nomi non
  stanno in una riga: i link sono nella pagina del progetto.
- **La foto è una sola, sorgente PNG da 900 px.** Per uno schermo con densità 2 la variante
  più grande è 560 px, sufficiente per i 280 px della foto su desktop.

## Cosa non è verificato

- **L'anteprima del link su LinkedIn e nelle chat.** I meta Open Graph sono nell'HTML e
  l'immagine risponde 200, ma come la mostra ogni piattaforma si vede solo incollando il link.
- **Il sito con un lettore di schermo.** Lighthouse misura accessibilità strutturale, ruoli,
  contrasto ed etichette. Una prova con NVDA o TalkBack non l'ho fatta.
- **I telefoni veri.** Le verifiche a 375 px sono in emulazione nel browser, e le prestazioni
  sono misure di laboratorio di Lighthouse, non dati di visitatori reali.
