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
  i18n/ui.ts          testi fissi dell'interfaccia, uno per lingua
  layouts/Base.astro  scheletro HTML comune, con canonical e hreflang
  pages/              italiano alla radice
  pages/en/           inglese sotto /en/
```
