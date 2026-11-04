import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default('AI & Technology'),
    readingTime: z.string().default('5 min read'),
    featured: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    category: z.enum(['GHL & Automation', 'Custom Software', 'AI Solutions', 'Consulting']),
    icon: z.string().default('workflow'),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    deliverables: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    year: z.number().default(2026),
    featured: z.boolean().default(false),
    tech: z.array(z.string()).default([]),
    link: z.string().optional(),
    github: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    abstract: z.string(),
    status: z.enum(['Published', 'In Review', 'Working Paper', 'Research Area']),
    year: z.number().default(2026),
    venue: z.string().optional(),
    tags: z.array(z.string()).default([]),
    doi: z.string().optional(),
    pdfUrl: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});

export const collections = { writing, services, projects, research };
