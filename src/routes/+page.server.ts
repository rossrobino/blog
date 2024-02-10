import { frontmatterSchema } from "$lib/schemas";
import type { Post } from "$lib/types";
import { getSlug } from "$lib/util/getSlug";
import { error } from "@sveltejs/kit";
import { process } from "robino/util/md";

export const load = async () => {
	try {
		const content = import.meta.glob("../content/*.md", {
			query: "?raw",
			import: "default",
			eager: true,
		});

		const posts: Post[] = [];

		for (const path in content) {
			const md = content[path];
			// @ts-expect-error - excessively deep due to zod schema
			const { frontmatter, headings } = await process(md, frontmatterSchema);
			const slug = getSlug(path);
			posts.push({ ...frontmatter, slug, headings });
		}

		posts.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);

		const filters = getKeywords(posts);

		return { posts, filters };
	} catch (e) {
		if (e instanceof Error) {
			error(500, e.message);
		} else {
			console.error(e);
			throw new Error("An unexpected error occurred.");
		}
	}
};

const getKeywords = (posts: Post[]) => {
	const keywords: Record<string, number> = {};
	for (const post of posts) {
		for (const keyword of post.keywords) {
			if (keywords[keyword]) {
				keywords[keyword]++;
			} else {
				keywords[keyword] = 1;
			}
		}
	}
	const topKeywords = Object.entries(keywords)
		.map(([word, quantity]) => ({ word, quantity }))
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 5) // top keywords only
		.map((item) => item.word);
	return ["all", ...topKeywords];
};
