import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";

import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	adapter: vercel({ analytics: true }),
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
	},
	site: "https://blog.robino.dev/",
	integrations: [tailwind(), svelte(), mdx(), prefetch(), sitemap()],
});
