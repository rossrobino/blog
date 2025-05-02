import { FrontmatterSchema } from "./src/lib/schema";
import { youtubeEmbed } from "./src/lib/youtube-embed";
import { adapter } from "@domcojs/vercel";
import { md } from "@robino/md";
import langAstro from "@shikijs/langs/astro";
import langBash from "@shikijs/langs/bash";
import langCss from "@shikijs/langs/css";
import langDiff from "@shikijs/langs/diff";
import langHtml from "@shikijs/langs/html";
import langJson from "@shikijs/langs/json";
import langMd from "@shikijs/langs/md";
import langSql from "@shikijs/langs/sql";
import langSvelte from "@shikijs/langs/svelte";
import langTsx from "@shikijs/langs/tsx";
import tailwindcss from "@tailwindcss/vite";
import { domco } from "domco";
import { defineConfig } from "vite";

export default defineConfig({
	build: { minify: true },
	plugins: [
		domco({ adapter: adapter() }),
		tailwindcss(),
		md({
			FrontmatterSchema,
			highlighter: {
				langs: [
					langCss,
					langHtml,
					langTsx,
					langSvelte,
					langDiff,
					langBash,
					langJson,
					langSql,
					langMd,
					langAstro,
				],
				langAlias: { js: "tsx", ts: "tsx", jsx: "tsx", mdx: "md" },
			},
			plugins: [youtubeEmbed],
		}),
	],
});
