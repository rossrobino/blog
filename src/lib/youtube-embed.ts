import type { PluginSimple } from "markdown-it";
import type MarkdownIt from "markdown-it";

export const youtubeEmbed: PluginSimple = (md: MarkdownIt) => {
	const originalImage = md.renderer.rules.image!;

	md.renderer.rules.image = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const src = token?.attrGet("src");

		if (src?.startsWith("yt:")) {
			const title = token?.content || token?.attrGet("alt") || "YouTube video";

			return /* html */ `
	<iframe
		loading="lazy"
		title="${title}"
		src="https://www.youtube-nocookie.com/embed/${src.slice(3)}"
		allowfullscreen
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	></iframe>
	`.trim();
		}

		return originalImage(tokens, i, opts, env, self);
	};
};
