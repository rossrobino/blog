import type { Post } from "@/lib/types";

function* Items({ post }: { post: Post }) {
	yield (
		<li>
			<a href="#">(Top)</a>
		</li>
	);

	for (const heading of post.headings) {
		if (heading.level === 2) {
			yield (
				<li>
					<a href={`#${heading.id}`}>{heading.name}</a>
				</li>
			);
		}
	}
}

export const Headings = ({ post }: { post: Post }) => {
	return (
		<div class="prose mt-6">
			<ul
				class="article-contents"
				data-article-navigation
				aria-label="Table of contents"
			>
				<Items post={post} />
			</ul>
		</div>
	);
};
