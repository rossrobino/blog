import type { Post } from "@/lib/types";

export const getKeywords = (posts: Post[]) => {
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
		.slice(0, 9) // top keywords only
		.map((item) => item.word);

	return topKeywords;
};
