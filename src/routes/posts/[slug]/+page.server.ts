import { dev } from "$app/environment";
import { frontmatterSchema } from "$lib/schemas";
import type { Post } from "$lib/types";
import { error } from "@sveltejs/kit";
import { processMarkdown } from "robino/util/md";

export const load = async ({ params }) => {
	let text: string | undefined;

	const content = import.meta.glob(`../../../content/*.md`, {
		query: "?raw",
		import: "default",
		eager: true,
	}) as Record<string, string>;

	for (const path in content) {
		if (path.endsWith(`${params.slug}.md`)) {
			text = content[path];
			break;
		}
	}

	if (typeof text === "undefined") error(404, `${params.slug}.md not found`);

	try {
		const { frontmatter, headings, html } = await processMarkdown(
			text,
			frontmatterSchema,
		);

		if (!dev && frontmatter.draft) error(403, "This post is in draft mode.");

		const post: Post = { ...frontmatter, headings, slug: params.slug };

		post.keywords.sort();

		return { html, post };
	} catch (e) {
		if (e instanceof Error) {
			error(500, e.message);
		} else {
			console.error(e);
			throw new Error("An unexpected error occurred.");
		}
	}
};
