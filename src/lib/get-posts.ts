import { getSlug } from "@/lib/get-slug";
import type { FrontmatterSchema } from "@/lib/schema";
import type { Post } from "@/lib/types";
import type { Result } from "@robino/md";

const content = import.meta.glob<Result<typeof FrontmatterSchema>>(
	"../content/*.md",
	{ eager: true },
);

const getPosts = () => {
	let posts: Post[] = [];

	for (const path in content) {
		const { frontmatter, headings, html } = content[path]!;

		const slug = getSlug(path);
		posts.push({ ...frontmatter, slug, headings, html });
	}

	posts = posts
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.filter((post) => !post.draft || import.meta.env.DEV);

	return posts;
};

export const posts = getPosts();
