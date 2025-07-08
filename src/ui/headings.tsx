import type { Post } from "@/lib/types";

export const Headings = (props: { post: Post }) => {
	const { post } = props;

	return (
		<div class="prose mt-6">
			<ul aria-label="Table of contents">
				{post.headings?.map((heading) => {
					if (heading.level === 2) {
						return (
							<li>
								<a href={`/posts/${post.slug}#${heading.id}`}>{heading.name}</a>
							</li>
						);
					}

					return null;
				})}
			</ul>
		</div>
	);
};
