import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false),
    }),
});

const microblog = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
    }),
});

const pictures = defineCollection({
    type: "data",
    schema: ({ image }) =>
        z.object({
            en: z.object({ title: z.string(), description: z.string().optional() }),
            es: z.object({ title: z.string(), description: z.string().optional() }),
            pubDate: z.coerce.date(),
            image: image(),
        }),
});

export const collections = { blog, microblog, pictures };
