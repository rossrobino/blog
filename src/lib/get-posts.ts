import { external } from "@/external";
import { formatDate, parseDate } from "@/lib/format-date";
import { getSlug } from "@/lib/get-slug";
import { section } from "@/lib/section";
import type { Story } from "@/lib/types";
import type { Heading } from "@robino/md";

const content = {
	headings: import.meta.glob<Heading[]>("../content/*.md", {
		import: "headings",
	}),
	html: import.meta.glob<string>("../content/*.md", { import: "html" }),
	source: import.meta.glob<string>("../content/*.md", { import: "source" }),
};

const metadata = import.meta.glob<Omit<Story, "slug">>("../content/*.md", {
	eager: true,
	import: "frontmatter",
	query: "?frontmatter",
});

const byDate = (a: Story, b: Story) =>
	parseDate(b.date).getTime() - parseDate(a.date).getTime();

export const getLocalPosts = () => {
	const posts: Story[] = [];

	for (const path in metadata) {
		posts.push({ ...metadata[path]!, slug: getSlug(path) });
	}

	return posts
		.sort(byDate)
		.filter((post) => !post.draft || import.meta.env.DEV);
};

/** Loads one published post on demand, including drafts in development. */
export const getPost = async (slug: string) => {
	const post = localPosts.find((post) => post.slug === slug);
	if (!post) return;

	const path = `../content/${slug}.md`;
	const [headings, html, source] = await Promise.all([
		content.headings[path]!(),
		content.html[path]!(),
		content.source[path]!(),
	]);

	return { ...post, headings, html, source };
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
