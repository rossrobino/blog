import type { Post } from "@/lib/types";

export const Headings = ({ post }: { post: Post }) => {
	return (
		<div class="prose mt-6">
			<ul
				class="article-contents"
				data-article-navigation
				aria-label="Table of contents"
			>
				<li>
					<a href="#">(Top)</a>
				</li>
				{post.headings?.map((heading) => {
					if (heading.level === 2) {
						return (
							<li>
								<a href={`#${heading.id}`}>{heading.name}</a>
							</li>
						);
					}

					return null;
				})}
			</ul>
		</div>
	);
};
