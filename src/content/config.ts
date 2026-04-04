import { defineCollection, z } from 'astro:content';

const about = defineCollection({
  type: 'content',
  schema: z.object({}),
});

const contact = defineCollection({
  type: 'content',
  schema: z.object({}),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    icon: z.string(),
    type: z.enum(['work', 'oss', 'side']),
    tech: z.array(z.string()),
  }),
});

const movies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    year: z.number(),
    watched: z.string().regex(/^\d{4}-\d{2}$/).optional(), // "YYYY-MM"
    status: z.enum(['watched', 'watching', 'want']).default('watched'),
  }),
});

const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'want']).default('finished'),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // "YYYY-MM-DD"
    summary: z.string(),
  }),
});

export const collections = { about, contact, projects, movies, books, blog };
