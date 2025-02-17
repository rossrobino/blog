import { getSlug } from "@/lib/get-slug";
import { markdownProcessor } from "@/lib/markdown-processor";
import { frontmatterSchema } from "@/lib/schema";
import type { Post } from "@/lib/types";

const content = import.meta.glob("../content/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

export const getPosts = async () => {
	const posts: Post[] = [];

	for (const path in content) {
		const md = content[path] as string;
		const { frontmatter, headings, html } = await markdownProcessor.process(
			md,
			frontmatterSchema,
		);
		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings, html });
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
};
