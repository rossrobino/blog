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

	const external = post.slug.startsWith("http");

	return (
		<div
			class={clsx(
				"border-muted-foreground dark:border-base-600 break-inside-avoid rounded-sm not-last:mb-4",
				link && "border p-6 shadow-md",
				external && "border-dashed",
			)}
			aria-label={external ? "External post" : "Post"}
			style={external ? undefined : `view-transition-name: ${post.slug}`}
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
					<a
						href={external ? post.slug : `/posts/${post.slug}`}
						class="flex justify-between gap-2 font-bold text-shadow-xs"
						target={external ? "_blank" : undefined}
					>
						{post.title}
						{external && (
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="size-5"
								>
									<path
										fill-rule="evenodd"
										d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
										clip-rule="evenodd"
									/>
									<path
										fill-rule="evenodd"
										d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						)}
					</a>
				</h2>
			) : (
				<>
					<h1 class="text-shadow-sm">{post.title}</h1>
					<ul class="my-6 flex flex-wrap gap-1.5" aria-label="keywords">
						{post.keywords.sort().map((keyword) => (
							<li class="badge secondary shadow-xs">{keyword}</li>
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
			{headings && post.headings ? <Headings post={post} /> : null}
		</div>
	);
};
