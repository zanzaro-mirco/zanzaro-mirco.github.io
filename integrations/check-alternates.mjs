// @ts-check
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { findHtml, htmlPages } from './dist-files.mjs';

/**
 * A fine build legge ogni pagina generata e controlla che ogni `<link rel="alternate">`
 * porti a un file che esiste. Una pagina italiana senza la gemella inglese, o il contrario,
 * fa fallire la build invece di pubblicare un selettore di lingua che finisce in un 404.
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function checkAlternates() {
  return {
    name: 'check-alternates',
    hooks: {
      'astro:build:done': async ({ dir, pages, logger }) => {
        const root = fileURLToPath(dir);
        const problems = [];
        const html = await htmlPages(root, pages);

        for (const { pathname, file } of html) {
          if (!file) {
            problems.push(`/${pathname}: pagina generata ma file HTML non trovato`);
            continue;
          }
          const source = await readFile(file, 'utf8');
          const alternates = [...source.matchAll(/<link\b[^>]*\brel="alternate"[^>]*>/g)].map(([tag]) => ({
            lang: attribute(tag, 'hreflang'),
            href: attribute(tag, 'href'),
          }));

          if (alternates.length === 0) {
            problems.push(`/${pathname}: nessun link hreflang`);
            continue;
          }

          for (const { lang, href } of alternates) {
            if (!href) {
              problems.push(`/${pathname}: hreflang="${lang}" senza href`);
              continue;
            }
            const target = new URL(href).pathname;
            if (!(await findHtml(root, target))) {
              problems.push(`/${pathname}: hreflang="${lang}" porta a ${target}, che non esiste`);
            }
          }
        }

        if (problems.length > 0) {
          throw new Error(`Pagine senza la gemella nell'altra lingua:\n  ${problems.join('\n  ')}`);
        }
        logger.info(`${html.length} pagine, ogni hreflang porta a una pagina esistente`);
      },
    },
  };
}

/**
 * @param {string} tag
 * @param {string} name
 * @returns {string | undefined}
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}
