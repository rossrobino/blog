import type { PluginSimple } from "markdown-it";
import type MarkdownIt from "markdown-it";

export const youtubeIt: PluginSimple = (md: MarkdownIt) => {
	const defaultImage =
		md.renderer.rules.image ?? md.renderer.renderToken.bind(md.renderer);

	md.renderer.rules.image = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const src = token?.attrGet("src") ?? "";

		if (src.startsWith("http") || src.startsWith("/"))
			return defaultImage(tokens, i, opts, env, self);

		const alt = token?.content ?? token?.attrGet("alt") ?? "";

		return /* html */ `
<iframe
	loading="lazy"
	title="${alt}"
	src="https://www.youtube-nocookie.com/embed/${src}"
	allowfullscreen
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe>
`.trim();
	};
};
