import { MarkdownProcessor } from "@robino/md";
import langAstro from "shiki/langs/astro.mjs";
import langBash from "shiki/langs/bash.mjs";
import langCss from "shiki/langs/css.mjs";
import langDiff from "shiki/langs/diff.mjs";
import langHtml from "shiki/langs/html.mjs";
import langJson from "shiki/langs/json.mjs";
import langMd from "shiki/langs/md.mjs";
import langSql from "shiki/langs/sql.mjs";
import langSvelte from "shiki/langs/svelte.mjs";
import langTsx from "shiki/langs/tsx.mjs";

export const markdownProcessor = new MarkdownProcessor({
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
		langAlias: {
			js: "tsx",
			ts: "tsx",
			jsx: "tsx",
			mdx: "md",
		},
	},
});
