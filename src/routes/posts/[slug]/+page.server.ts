import type { Post } from "$lib/types";
import { mdToHtml } from "$lib/util/mdToHtml.server";
import { processMd } from "$lib/util/processMd.server";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
	let text: string | undefined;

	const content = import.meta.glob(`../../../content/*.md`, {
		as: "raw",
		eager: true,
	});

	for (const path in content) {
		if (path.endsWith(`${params.slug}.md`)) {
			text = content[path];
			break;
		}
	}

	if (typeof text === "undefined")
		throw error(404, `Unable to import ${params.slug}.md`);

	const { article, frontmatter, headings } = processMd(text);

	const post: Post = { ...frontmatter, headings, slug: params.slug };

	post.keywords.sort();

	const html = mdToHtml(article);

	return { html, post };
};
