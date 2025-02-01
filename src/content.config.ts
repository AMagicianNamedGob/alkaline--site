import { SITE, COLLECTION_NAMES_LIST } from "./alkaline.config";
// @ts-ignore
import { defineCollection, z } from "astro:content";
import { glob } from 'astro/loaders'

const collectionNames = COLLECTION_NAMES_LIST;

// base schema for all collections
const postCollectionSchema = {
	authorId: z.number().default(1),
	authorContact: z.string().optional(),
	title: z.string(),
	subtitle: z.string().optional(),
	description: z.string().default(SITE.description || ""),
	pubDatetime: z
		.date()
		.or(z.string().transform((str: string) => new Date(str)))
		.optional(),
	modDatetime: z
		.date()
		.or(z.string().transform((str: string) => new Date(str)))
		.optional(),
	isFeatured: z.boolean().optional(),
	isDraft: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	canonicalURL: z.string().url().optional(),
};

// Advanced customization options //
// These options are useful for granular customization of multiple collections or overriding the defaults above //

let collectionSchemas: { [key: string]: any } = {};

// @ts-ignore
collectionNames.forEach((collectionName) => {
	collectionSchemas[collectionName] = defineCollection({
		loader: glob({ pattern: '*.md*', base: "./src/data/" + collectionName.toLowerCase() }),
		schema: ({ image }) => // allows for images in the frontmatter
			z.object({
				...postCollectionSchema,
				// authorId: z.number().default(2), // example of overriding a default
				cover: z.object({
					src: image(),
					alt: z.string().optional(),
				}).optional(),
			}),
	});
	console.log("🚀 ~ collectionSchemas:", './src/data/' + collectionName.toLowerCase())
});


export const collections = collectionSchemas;
