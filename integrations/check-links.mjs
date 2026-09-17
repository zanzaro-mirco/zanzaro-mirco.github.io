// @ts-check
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exists, findHtml, htmlPages } from './dist-files.mjs';

/**
 * A fine build segue ogni link interno delle pagine generate: `href`, `src`, `srcset` e gli
 * URL assoluti verso il sito stesso (canonical, Open Graph). Un file che non esiste, o
 * un'ancora che non c'è nella pagina di arrivo, fa fallire la build.
 *
 * I link verso altri siti non si controllano qui: dipendono dalla rete e da chi risponde.
 * Li controlla la pipeline, in un passo a parte.
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function checkLinks() {
  /** @type {URL} */
  let site;
  return {
    name: 'check-links',
    hooks: {
      'astro:config:done': ({ config }) => {
        if (!config.site) throw new Error('check-links ha bisogno di `site` nella configurazione');
        site = new URL(config.site);
      },
      'astro:build:done': async ({ dir, pages, logger }) => {
        const root = fileURLToPath(dir);
        // Un Set: lo stesso link rotto ripetuto nella stessa pagina si segnala una volta.
        /** @type {Set<string>} */
        const problems = new Set();
        /** @type {Map<string, string>} */
        const htmlCache = new Map();
        let checked = 0;

        /** @param {string} file */
        const read = async (file) => {
          if (!htmlCache.has(file)) htmlCache.set(file, await readFile(file, 'utf8'));
          return /** @type {string} */ (htmlCache.get(file));
        };

        for (const { pathname, file } of await htmlPages(root, pages)) {
          if (!file) continue;
          const source = await read(file);
          const pageUrl = new URL(`/${pathname.replace(/^\/+/, '')}`, site);

          for (const raw of linksIn(source)) {
            if (/^(mailto|tel|javascript|data):/i.test(raw)) continue;
            const url = new URL(raw, pageUrl);
            if (url.origin !== site.origin) continue;
            checked++;

            const target = looksLikeAsset(url.pathname)
              ? await assetFile(root, url.pathname)
              : await findHtml(root, url.pathname);
            if (!target) {
              problems.add(`/${pathname}: ${raw} non esiste`);
              continue;
            }

            const anchor = decodeURIComponent(url.hash.slice(1));
            if (anchor && target.endsWith('.html')) {
              const idPattern = new RegExp(`\\bid="${escapeRegExp(anchor)}"`);
              if (!idPattern.test(await read(target))) {
                problems.add(`/${pathname}: ${raw} porta a un'ancora che non c'è`);
              }
            }
          }
        }

        if (problems.size > 0) {
          throw new Error(`Link interni rotti:\n  ${[...problems].join('\n  ')}`);
        }
        logger.info(`${checked} link interni, tutti portano a qualcosa che esiste`);
      },
    },
  };
}

/**
 * Tutti i riferimenti di una pagina: `href`, `src`, ogni candidato di `srcset`, e i
 * `content` dei meta che contengono un URL.
 *
 * @param {string} html
 * @returns {string[]}
 */
function linksIn(html) {
  const links = [];
  for (const [, , value] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    links.push(decodeEntities(value ?? ''));
  }
  for (const [, value] of html.matchAll(/\bsrcset="([^"]*)"/g)) {
    for (const candidate of (value ?? '').split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) links.push(decodeEntities(url));
    }
  }
  for (const [, value] of html.matchAll(/<meta\b[^>]*\bcontent="(https?:\/\/[^"]*)"/g)) {
    links.push(decodeEntities(value ?? ''));
  }
  return links.filter((link) => link.length > 0);
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function looksLikeAsset(pathname) {
  const last = pathname.split('/').pop() ?? '';
  return /\.[a-z0-9]+$/i.test(last) && !last.endsWith('.html');
}

/**
 * @param {string} root
 * @param {string} pathname
 * @returns {Promise<string | undefined>}
 */
async function assetFile(root, pathname) {
  const file = path.join(root, decodeURIComponent(pathname).replace(/^\/+/, ''));
  return (await exists(file)) ? file : undefined;
}

/**
 * @param {string} value
 * @returns {string}
 */
function decodeEntities(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
