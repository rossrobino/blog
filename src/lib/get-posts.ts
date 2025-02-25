import { getSlug } from "@/lib/get-slug";
import { processor } from "@/lib/md";
import { frontmatterSchema } from "@/lib/schema";
import type { Post } from "@/lib/types";

const content = import.meta.glob("../content/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

export const getPosts = async () => {
	let posts: Post[] = [];

	for (const path in content) {
		const md = content[path] as string;
		const { frontmatter, headings, html } = await processor.process(
			md,
			frontmatterSchema,
		);
		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings, html });
	}

	posts = posts
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.filter((post) => !post.draft || import.meta.env.DEV);

	return posts;
};
