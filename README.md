# zanzaro-mirco.github.io

Il sito personale di Mirco Zanzaro, mobile developer: i quattro progetti del portfolio
in un unico posto, in italiano e in inglese.

Sito statico costruito con [Astro](https://astro.build), pubblicato su GitHub Pages
all'indirizzo <https://zanzaro-mirco.github.io/>.

## Requisiti

Node.js 22.12 o successivo.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm ci` | Installa le dipendenze esatte di `package-lock.json` |
| `npm run dev` | Server di sviluppo su `http://localhost:4321` |
| `npm run check` | Controllo dei tipi di `.astro` e `.ts` |
| `npm run build` | Genera il sito statico in `dist/` |
| `npm run preview` | Serve `dist/` in locale |

## Struttura

```
src/
  content.config.ts       schema dei progetti: un campo mancante ferma la build
  content/projects/it/    un Markdown per progetto, in italiano
  components/             home (apertura, filiera, schede) e pagina progetto
  assets/                 la foto, ridimensionata e convertita in WebP in build
  styles/global.css       token di colore, tema chiaro e scuro, regole comuni
  lib/                    percorsi e lettura dei progetti
  i18n/ui.ts              testi fissi dell'interfaccia: una chiave senza traduzione non compila
  layouts/Base.astro      scheletro HTML comune, con canonical, hreflang e selettore del tema
  pages/                  italiano alla radice, progetti sotto /progetti/, 404 bilingue
  pages/en/               inglese sotto /en/
```

## Tema

Il tema scuro segue `prefers-color-scheme`, anche senza JavaScript. Il pulsante nella
barra salva la scelta in `localStorage`, ed è l'unico script del sito. Se il browser
blocca lo spazio di archiviazione il pulsante funziona lo stesso, ma solo fino alla
pagina successiva.

## Aggiungere o aggiornare un progetto

Si modifica il Markdown in `src/content/projects/<lingua>/`. Nel frontmatter stanno le
parti che la pagina mostra in blocchi: numeri, scelte, lezione, limiti e link. Il corpo è
«il problema». I numeri in `stats` si prendono dal repository o da pub.dev, e `updated` è
il giorno in cui sono stati verificati.
