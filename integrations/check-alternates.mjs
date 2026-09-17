// @ts-check
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

        for (const { pathname } of pages) {
          const source = await findHtml(root, pathname);
          if (!source) {
            problems.push(`/${pathname}: pagina generata ma file HTML non trovato`);
            continue;
          }
          const html = await readFile(source, 'utf8');
          const alternates = [...html.matchAll(/<link\b[^>]*\brel="alternate"[^>]*>/g)].map(([tag]) => ({
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
        logger.info(`${pages.length} pagine, ogni hreflang porta a una pagina esistente`);
      },
    },
  };
}

/**
 * Il file che GitHub Pages servirebbe per un percorso: `en/projects/pos-sync/` è
 * `en/projects/pos-sync/index.html`, mentre la 404 Astro la scrive come `404.html`.
 *
 * @param {string} root
 * @param {string} pathname
 * @returns {Promise<string | undefined>}
 */
async function findHtml(root, pathname) {
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const candidates = clean.endsWith('.html')
    ? [clean]
    : [path.join(clean, 'index.html'), `${clean}.html`];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    if (await exists(file)) return file;
  }
  return undefined;
}

/**
 * @param {string} tag
 * @param {string} name
 * @returns {string | undefined}
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

/**
 * @param {string} file
 * @returns {Promise<boolean>}
 */
async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}
