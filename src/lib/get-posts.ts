import { external } from "@/external";
import { formatDate, parseDate } from "@/lib/format-date";
import { getSlug } from "@/lib/get-slug";
import type { FrontmatterSchema } from "@/lib/schema";
import { section } from "@/lib/section";
import type { Story } from "@/lib/types";
import type { Result } from "@robino/md";

const content = import.meta.glob<Result<typeof FrontmatterSchema>>(
	"../content/*.md",
	{ eager: true },
);

const byDate = (a: Story, b: Story) =>
	parseDate(b.date).getTime() - parseDate(a.date).getTime();

export const getLocalPosts = () => {
	const posts = [];

	for (const path in content) {
		const { article, frontmatter, headings, html, source } = content[path]!;

		posts.push({
			...frontmatter,
			slug: getSlug(path),
			article,
			headings,
			html,
			source,
		});
	}

	return posts
		.sort(byDate)
		.filter((post) => !post.draft || import.meta.env.DEV);
};

const getPosts = () =>
	[
		...external.map((post) => ({ ...post, date: formatDate(post.date) })),
		...getLocalPosts(),
	].sort(byDate);

export const getKeywords = (posts: Story[]) => {
	const counts: Record<string, number> = {};

	for (const post of posts) {
		for (const keyword of new Set(post.keywords.map(section))) {
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
export const localPosts = getLocalPosts();
export const keywords = getKeywords(posts);
