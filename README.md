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
  components/             scheda progetto e pagina progetto
  lib/                    percorsi e lettura dei progetti
  i18n/ui.ts              testi fissi dell'interfaccia, uno per lingua
  layouts/Base.astro      scheletro HTML comune, con canonical e hreflang
  pages/                  italiano alla radice, progetti sotto /progetti/
  pages/en/               inglese sotto /en/
```

## Aggiungere o aggiornare un progetto

Si modifica il Markdown in `src/content/projects/<lingua>/`. Nel frontmatter stanno le
parti che la pagina mostra in blocchi: numeri, scelte, lezione, limiti e link. Il corpo è
«il problema». I numeri in `stats` si prendono dal repository o da pub.dev, e `updated` è
il giorno in cui sono stati verificati.
