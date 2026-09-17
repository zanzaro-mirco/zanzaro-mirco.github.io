// @ts-check
// Strumenti comuni ai controlli di fine build: trovare il file che GitHub Pages servirebbe
// per un percorso, e l'elenco delle pagine HTML generate.
import { access } from 'node:fs/promises';
import path from 'node:path';

/**
 * Il file HTML che GitHub Pages servirebbe per un percorso: `en/projects/pos-sync/` è
 * `en/projects/pos-sync/index.html`, mentre la 404 Astro la scrive come `404.html`.
 *
 * @param {string} root
 * @param {string} pathname
 * @returns {Promise<string | undefined>}
 */
export async function findHtml(root, pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '').replace(/\/+$/, '');
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
 * Le pagine HTML fra quelle generate. Gli endpoint come `robots.txt` non sono pagine e
 * non hanno né hreflang né link da seguire.
 *
 * @param {string} root
 * @param {{ pathname: string }[]} pages
 * @returns {Promise<{ pathname: string, file: string | undefined }[]>}
 */
export async function htmlPages(root, pages) {
  const result = [];
  for (const { pathname } of pages) {
    const last = pathname.replace(/\/+$/, '').split('/').pop() ?? '';
    const isOtherFile = /\.[a-z0-9]+$/i.test(last) && !last.endsWith('.html');
    if (isOtherFile) continue;
    result.push({ pathname, file: await findHtml(root, pathname) });
  }
  return result;
}

/**
 * @param {string} file
 * @returns {Promise<boolean>}
 */
export async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}
