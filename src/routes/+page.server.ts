import type { Post } from "$lib/types";
import { getSlug } from "$lib/util/getSlug";
import { processMd } from "$lib/util/processMd.server";

export const load = async () => {
	const content = import.meta.glob("../content/*.md", {
		as: "raw",
		eager: true,
	});

	const posts: Post[] = [];

	for (const path in content) {
		const md = content[path];
		const { frontmatter, headings } = processMd(md);
		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings });
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const filters = getKeywords(posts);

	return { posts, filters };
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
