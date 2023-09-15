import { frontmatterSchema } from "$lib/schemas/mod";
import type { Post } from "$lib/types/mod";
import { error } from "@sveltejs/kit";
import { process } from "robino/util/md";

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
		throw error(404, `${params.slug}.md not found`);

	try {
		const { frontmatter, headings, html } = process(text, frontmatterSchema);

		const post: Post = { ...frontmatter, headings, slug: params.slug };

		post.keywords.sort();

		return { html, post };
	} catch (e) {
		if (e instanceof Error) {
			throw error(500, e.message);
		} else {
			console.error(e);
			throw new Error("An unexpected error occurred.");
		}
	}
};
