import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import prefetch from "@astrojs/prefetch";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
	markdown: {
		shikiConfig: {
			theme: "github-dark",
		},
	},
	site: "https://blog.robino.dev/",
	integrations: [
		tailwind({
			config: {
				applyBaseStyles: false,
			},
		}),
		svelte(),
		mdx(),
		prefetch(),
		partytown(),
		sitemap(),
	],
});
