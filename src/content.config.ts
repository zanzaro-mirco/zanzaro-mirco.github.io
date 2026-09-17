import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Un file per progetto e per lingua: `it/pos-sync.md`, `en/pos-sync.md`.
// Il corpo del Markdown è «il problema»; tutto ciò che la pagina mostra in blocchi
// sta nel frontmatter, così un campo dimenticato ferma la build invece di sparire.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    /** Nome del repository o del pacchetto, come appare su GitHub. */
    title: z.string().min(1),
    /** Posizione nella home: segue la filiera, dal calcolo alla sincronizzazione. */
    order: z.number().int().positive(),
    /** Piattaforma e forma, es. «Dart puro · pacchetto». */
    platform: z.string().min(1),
    /** Una o due frasi per la scheda nella home. */
    summary: z.string().min(1),
    /** L'apertura della pagina del progetto. */
    lead: z.string().min(1),
    /** Numeri che chi legge può verificare, con la data in `updated`. */
    stats: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .min(1)
      .max(4),
    stack: z.array(z.string().min(1)).min(1),
    links: z.object({
      repository: z.url(),
      architecture: z.url(),
      packages: z.array(z.object({ name: z.string().min(1), url: z.url() })).optional(),
      releases: z.url().optional(),
    }),
    choices: z
      .array(z.object({ title: z.string().min(1), text: z.string().min(1) }))
      .min(2)
      .max(4),
    lesson: z.string().min(1),
    limits: z.array(z.string().min(1)).min(1),
    /** Il giorno in cui i numeri di `stats` sono stati verificati. */
    updated: z.coerce.date(),
  }),
});

export const collections = { projects };
