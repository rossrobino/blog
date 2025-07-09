import { external } from "@/external";
import { getSlug } from "@/lib/get-slug";
import type { FrontmatterSchema } from "@/lib/schema";
import type { Post } from "@/lib/types";
import type { Result } from "@robino/md";

const content = import.meta.glob<Result<typeof FrontmatterSchema>>(
	"../content/*.md",
	{ eager: true },
);

const getPosts = () => {
	const posts = [...external]; // need to copy or breaks reload

	for (const path in content) {
		const { frontmatter, headings, html } = content[path]!;

		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings, html });
	}

	return posts
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.filter((post) => !post.draft || import.meta.env.DEV);
};

export const getKeywords = (posts: Post[]) => {
	const counts: Record<string, number> = {};

	for (const post of posts) {
		for (const keyword of post.keywords) {
			if (counts[keyword]) {
				counts[keyword]++;
			} else {
				counts[keyword] = 1;
			}
		}
	}

	const topKeywords = Object.entries(counts)
		.map(([word, quantity]) => ({ word, quantity }))
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 9) // top keywords only
		.map((item) => item.word);

	return topKeywords;
};

export const posts = getPosts();

export const keywords = getKeywords(posts);
