import type { Post } from "$lib/types";
import { getPosts } from "$lib/util/getPosts";
import { error } from "@sveltejs/kit";

export const load = async () => {
	try {
		const posts = (await getPosts()).filter((post) => !post.draft);
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
