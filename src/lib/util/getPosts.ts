import { frontmatterSchema } from "$lib/schemas";
import type { Post } from "$lib/types";
import { getSlug } from "./getSlug";
import { markdownProcessor } from "./markdown-processor";

export const getPosts = async () => {
	const content = import.meta.glob("../../content/*.md", {
		query: "?raw",
		import: "default",
		eager: true,
	});

	const posts: Post[] = [];

	for (const path in content) {
		const md = content[path] as string;
		const { frontmatter, headings } = markdownProcessor.process(
			md,
			frontmatterSchema,
		);
		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings });
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
};
