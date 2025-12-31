import { defineCollection, z } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.string().transform(s => new Date(s).toISOString()),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  posts: postCollection
};