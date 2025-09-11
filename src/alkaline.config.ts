import { Platforms } from "./Types/types";

import type { Site, Author, Socials, NavEntry, Blog } from "./Types/types";

/**
 * @description This file contains the configuration for the Alkaline theme.
 * - There are quite a few settings, but they allow for a vast amount of automatization across the theme
 * @exports SITE - The site configuration object
 * @exports NAVIGATION - The navigation configuration object
//  * @exports BLOG - The blog configuration object
 * @exports DOCS - The docs configuration object
 */

//  SITE socials - used for the site footer
export const socials: Socials[] = [
	{
		platform: "email",
		url: "hello@jaredtruscott.com",
	},
	{
		platform: "github",
		url: "https://github.com/AMagicianNamedGob/",
	},
	{
		platform: "web",
		url: "https://jaredtruscott.com",
	},
];

// use in development to easily see all author socials at once, comment out in production
export const allSocials: Socials[] = Platforms.map((platform) => ({
	platform,
	url: `https://${platform}.com`,
	userName: `test_user_${platform}`,
}));


export const AUTHORS: Author[] = [
	// assumes that the 1st author has the same socials as the site - change if needed
	{
		id: 1,
		name: "Jared Truscott",
		socials: socials,
		// email: 'hello@jaredtruscott.com'
	},
	{
		id: 2,
		name: "Jeff Goldblum",
		socials: allSocials,
		email: null
	},
]

export const SITE: Site = {
	title: "Alkaline",
	showTitleBackground: true,
	faviconSrc: "/favicon.png", // in public directory
	url: "https://alkaline-site.com",
	ogImage: "/og-image.webp", // in public directory
	author: AUTHORS[0].name, // Made with ❤️ by {your-name}
	description: "A Neutral Base For Your Next Creation",
	keywords: ["astro", "theme", "blog"],
	disableIndexing: false, // true for no indexing
	socials: socials,
	locale: "en_US",
	postsPerPage: 5,
	shikiConfig: {
		theme: "plastic"
	},
	// * edit or remove ./Types/google-fonts.d.ts to add/remove font types * //
	fonts: [
		{
			typeface: "serif",
			fontFamily: "Montserrat",
			fontWeights: ["100..800"],
		},
		{
			typeface: "sans",
			fontFamily: "Roboto",
			fontWeights: ["100..900"],
			includeItalic: true,
		},
		{
			typeface: "mono",
			fontFamily: "Space Mono",
			fontWeights: [400, 500, 700],
		},
	],
	// Trouble with the fonts? It's likely because a font family name isn't EXACTLY correct or the font weights you're trying to fetch are not supported for that font family. For example, setting Roboto with fontWeights: ["400...700"] will not work because Roboto only supports 400, 500, and 700.
};

export const NAVIGATION: NavEntry[] = [
	{
		href: "/",
		text: "Home",
	},
	{
		href: "/elements",
		text: "Elements",
	},
	{
		href: "/features",
		text: "Features",
	},
	{
		href: "/blog",
		text: "Blog",
	},
	{
		href: "/tags",
		text: "Tags",
	},
	{
		href: "/faq",
		text: "FAQ",
	},
	{
		href: "/404",
		text: "404",
	},
];

export const BLOG: Blog = {
	title: "Alkaline Docs",
	author: AUTHORS[0].name,
	description: SITE.description || "",
	keywords: SITE.keywords,
	postsPerPage: SITE.postsPerPage,
};

// export the name(s) of the collections as a list - must match the name of the collection in the content directory
export const COLLECTION_NAMES_LIST = ["blog"] as const;
