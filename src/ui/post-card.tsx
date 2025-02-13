import { Headings } from "./headings";
import type { Post } from "@/lib/types";
import { clsx } from "clsx";

export const PostCard = (props: {
	post: Post;
	headings?: boolean;
	size?: "sm" | "md" | "lg";
	link?: boolean;
	uppercase?: boolean;
	italic?: boolean;
}) => {
	const {
		post,
		headings = false,
		size = "sm",
		link = true,
		uppercase,
		italic,
	} = props;

	return (
		<div
			class={clsx(
				"border-muted-foreground dark:border-base-600 break-inside-avoid rounded-sm not-last:mb-4",
				link && "border p-6",
			)}
			aria-label="post"
			style={`view-transition-name: ${post.slug}`}
		>
			{link ? (
				<h2
					class={clsx("hover:underline", {
						uppercase,
						italic,
						"text-3xl": size === "md",
						"text-2xl": size === "sm",
					})}
				>
					<a href={`/posts/${post.slug}`} class="font-bold">
						{post.title}
					</a>
				</h2>
			) : (
				<>
					<h1>{post.title}</h1>
					<ul class="my-6 flex flex-wrap gap-1.5" aria-label="keywords">
						{post.keywords.map((keyword) => (
							<li class="badge secondary">{keyword}</li>
						))}
					</ul>
				</>
			)}
			<div class="mt-4 mb-2" aria-label="Published date">
				{post.date}
			</div>
			<div
				class={clsx({ uppercase, italic: !link || italic })}
				aria-label="Post description"
			>
				{post.description}
			</div>
			{headings ? <Headings post={post} /> : null}
		</div>
	);
};
