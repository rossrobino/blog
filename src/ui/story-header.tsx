import { author, homepage } from "@/lib/info";
import { section } from "@/lib/section";
import type { Post } from "@/lib/types";
import { clsx } from "clsx";

/** Shared editorial headline block for featured and full stories. */
export const StoryHeader = ({
	post,
	href,
	ruled = false,
	showDate = true,
	wide = false,
}: {
	post: Post;
	href?: string;
	ruled?: boolean;
	showDate?: boolean;
	wide?: boolean;
}) => {
	const Heading = href ? "h2" : "h1";

	return (
		<header
			class={clsx(
				"pb-8",
				href ? "text-left" : "text-center",
				ruled && "newspaper-double-rule-bottom newspaper-double-rule-inverted",
			)}
		>
			<div class={clsx("mx-auto", wide ? "max-w-none" : "max-w-[90ch]")}>
				{showDate && (
					<p class="mb-2 text-xs font-bold tracking-[0.16em] uppercase">
						{post.date}
					</p>
				)}
				<Heading
					class={clsx(
						"font-black text-balance",
						wide ? "max-w-none" : "max-w-[18ch]",
						href && "text-4xl leading-[1.05] sm:text-5xl",
						!href && "mx-auto text-center",
					)}
				>
					{href ? <a href={href}>{post.title}</a> : post.title}
				</Heading>
				<p
					class={clsx(
						"mt-4 max-w-[58ch] text-base leading-relaxed text-balance italic sm:text-lg",
						!href && "mx-auto text-center",
					)}
				>
					{post.description}
				</p>
				<p
					class={clsx(
						"mt-7 flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase",
						href ? "justify-start" : "justify-center",
					)}
				>
					<span>
						By <a href={homepage}>{author}</a>
					</span>
					<span aria-hidden="true">·</span>
					<span>
						{[...new Set(post.keywords.map(section))].slice(0, 3).join(" / ")}
					</span>
				</p>
			</div>
		</header>
	);
};
