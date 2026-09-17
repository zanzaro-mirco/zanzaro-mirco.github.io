import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

/** Il segmento di percorso delle pagine progetto, tradotto come il resto dell'URL. */
const projectsSegment: Record<Locale, string> = {
  it: 'progetti',
  en: 'projects',
};

/** `it/pos-sync` → `pos-sync`. */
export function projectSlug(project: Project): string {
  return project.id.split('/').slice(1).join('/');
}

export function projectPath(locale: Locale, slug: string): string {
  const prefix = locale === 'it' ? '' : `/${locale}`;
  return `${prefix}/${projectsSegment[locale]}/${slug}/`;
}

/** I progetti di una lingua, nell'ordine della filiera. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = await getCollection('projects', ({ id }) => id.startsWith(`${locale}/`));
  return entries.sort((a, b) => a.data.order - b.data.order);
}
