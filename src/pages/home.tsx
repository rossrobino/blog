import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { section } from "@/lib/section";
import type { Story } from "@/lib/types";
import { Layout } from "@/pages/layout";
import { page as postPage } from "@/pages/posts";
import { Head } from "@/ui/head";
import { StoryHeader } from "@/ui/story-header";
import { clsx } from "clsx";
import { Render, Route } from "ovr";

const preview = (
	post: Story,
	{ length = 3, inline = false, minimum = 0, ellipsis = false } = {},
) => {
	const paragraphs =
		"html" in post && typeof post.html === "string"
			? post.html
					.replace(
						/<(iframe|video|audio|picture|figure|object|e-chart)\b[^>]*>[\s\S]*?<\/\1>/gi,
						"",
					)
					.replace(/<(img|embed)\b[^>]*>/gi, "")
					.match(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/g)
					?.filter((paragraph) => paragraph.replace(/<[^>]+>/g, "").trim())
			: undefined;

	if (!paragraphs?.length) {
		const description = ellipsis ? `${post.description}…` : post.description;
		return inline ? description : `<p>${description}</p>`;
	}

	const excerpt = [];
	let size = 0;

	for (const paragraph of paragraphs) {
		if (excerpt.length >= length && size >= minimum) break;

		excerpt.push(paragraph);
		size += paragraph.replace(/<[^>]+>/g, "").trim().length;
	}

	return inline
		? excerpt
				.map((paragraph) => paragraph.replace(/^<p(?:\s[^>]*)?>|<\/p>$/g, ""))
				.join(" ")
		: excerpt
				.map((paragraph, i) =>
					i === excerpt.length - 1 &&
					(ellipsis || paragraphs.length > excerpt.length)
						? paragraph.replace(/<\/p>$/, "…</p>")
						: paragraph,
				)
				.join("");
};

const outside = (slug: string) =>
	slug.startsWith("http://") || slug.startsWith("https://");

const href = (slug: string) =>
	outside(slug) ? slug : postPage.pathname({ slug });

const Excerpt = ({
	post,
	length,
	inline,
	minimum,
	ellipsis,
}: {
	post: Story;
	length?: number;
	inline?: boolean;
	minimum?: number;
	ellipsis?: boolean;
}) => Render.html(preview(post, { length, inline, minimum, ellipsis }));

const Card = ({
	post,
	i,
	classes,
}: {
	post: Story;
	i: number;
	classes: string;
}) => (
	<article class={clsx("pb-6", classes)}>
		<h3
			class={clsx("text-xl leading-tight font-bold", {
				"tracking-wide uppercase": i === 0,
			})}
		>
			<a href={href(post.slug)}>
				<span class="line-clamp-3">{post.title}</span>
			</a>
		</h3>
		<p class="mt-2 line-clamp-3 text-justify text-sm leading-relaxed italic">
			{post.description}
		</p>
		<p class="mt-4 line-clamp-5 text-justify text-sm leading-relaxed">
			<Excerpt post={post} length={2} inline />
		</p>
		<p class="mt-3 text-xs tracking-wider uppercase">{post.date}</p>
	</article>
);

const Lead = ({ post, sides }: { post: Story; sides: boolean }) => (
	<article
		class={clsx(
			"flex min-h-0 flex-col pt-8 pb-9 lg:col-start-1 lg:row-start-1 lg:pb-10",
			sides && "newspaper-column-rule lg:pr-8",
		)}
	>
		<StoryHeader post={post} href={href(post.slug)} wide={!sides} />
		<div class="newspaper-lead-preview min-h-80 flex-1">
			<div
				data-preview-truncate
				class="newspaper-lead-copy prose mx-auto max-w-none text-justify first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-black sm:columns-2 sm:gap-5"
			>
				<Excerpt post={post} length={12} minimum={6000} ellipsis />
			</div>
		</div>
		<p class="mt-6 shrink-0 text-end">
			<a
				class="inline-flex items-center gap-1.5 font-bold tracking-wider"
				href={href(post.slug)}
			>
				<span>Continue reading</span>
				<span
					class="icon-[ph--arrow-right] text-base"
					aria-hidden="true"
				></span>
			</a>
		</p>
	</article>
);

function* Cards({ stories, split }: { stories: Story[]; split: boolean }) {
	for (const [i, post] of stories.entries()) {
		yield (
			<Card
				post={post}
				i={i}
				classes={clsx(
					i === 0
						? "pt-2"
						: split && i === 1
							? "border-foreground/35 border-t pt-6 sm:border-t-0 sm:pt-2"
							: "border-foreground/35 border-t pt-6 sm:border-t-0 sm:pt-4 lg:border-t lg:pt-6",
					split && i % 2 === 0 && "lg:mr-5",
					split && i % 2 === 1 && "lg:ml-5",
				)}
			/>
		);
	}
}

const StoryLink = ({ post }: { post: Story }) => {
	const external = outside(post.slug);

	return (
		<a
			href={href(post.slug)}
			class={external ? "inline-flex items-start gap-1" : ""}
			{...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
		>
			<span class="line-clamp-3">{post.title}</span>
			{external && (
				<>
					<span
						class="icon-[ph--arrow-up-right] mt-1 shrink-0 text-sm"
						aria-hidden="true"
					></span>
					<span class="sr-only"> (opens in a new tab)</span>
				</>
			)}
		</a>
	);
};

const Dispatch = ({ post, i }: { post: Story; i: number }) => (
	<article
		class={clsx(
			"pb-6",
			i === 0
				? "pt-2"
				: "border-foreground/35 border-t pt-6 sm:border-t-0 sm:pt-4 lg:border-t lg:pt-6",
		)}
	>
		<h3
			class={clsx("text-xl leading-tight font-bold", {
				"tracking-wide uppercase": i === 1,
			})}
		>
			<StoryLink post={post} />
		</h3>
		<p class="mt-2 line-clamp-3 text-justify text-sm leading-relaxed italic">
			{post.description}
		</p>
		<p class="mt-3 text-xs tracking-wider uppercase">{post.date}</p>
	</article>
);

function* Dispatches({ stories }: { stories: Story[] }) {
	for (const [i, post] of stories.entries()) {
		yield <Dispatch post={post} i={i} />;
	}
}

const Features = ({
	lead,
	secondary,
	filter,
}: {
	lead: Story;
	secondary: Story[];
	filter: string;
}) => {
	const briefs = secondary.filter((post) => !outside(post.slug));
	const dispatches = secondary.filter((post) => outside(post.slug));
	const split = dispatches.length === 0;
	const primary = split ? briefs : briefs.slice(0, 2);
	const overflow = split ? undefined : briefs[2];
	const sides = briefs.length > 0 || dispatches.length > 0;

	return (
		<section
			class={clsx(
				"grid",
				sides && "lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)_minmax(0,1fr)]",
			)}
			aria-label={`Front page, filtered to ${filter} posts.`}
		>
			<Lead post={lead} sides={sides} />

			{briefs.length > 0 && (
				<div
					class={clsx(
						"newspaper-briefs lg:col-start-2 lg:row-start-1 lg:pt-8",
						split
							? "newspaper-briefs-wide lg:col-span-2 lg:grid lg:grid-cols-2 lg:content-start lg:px-5"
							: "lg:px-5",
						dispatches.length > 0 && "newspaper-column-rule",
					)}
				>
					<h2
						class={clsx(
							"text-foreground/70 pb-1 text-xs font-bold tracking-[0.18em] uppercase",
							split && "lg:col-span-2",
						)}
					>
						In brief
					</h2>
					<Cards stories={primary} split={split} />
				</div>
			)}

			{dispatches.length > 0 && (
				<div
					class={clsx(
						"pl-0 sm:pb-10 lg:row-start-1 lg:mt-0 lg:pt-8 lg:pr-5 lg:pb-0 lg:pl-5",
						overflow ? "sm:mt-0" : "sm:mt-10",
						briefs.length > 0 ? "lg:col-start-3" : "lg:col-start-2",
					)}
				>
					{overflow && (
						<Card
							post={overflow}
							i={2}
							classes="border-foreground/35 border-t pt-6 lg:border-t-0 lg:pt-6"
						/>
					)}
					<div class="newspaper-briefs">
						<h2
							class={clsx(
								"text-foreground/70 pb-1 text-xs font-bold tracking-[0.18em] uppercase",
								overflow && "border-foreground/35 border-t pt-6",
							)}
						>
							External dispatch
						</h2>
						<Dispatches stories={dispatches} />
					</div>
				</div>
			)}
		</section>
	);
};

const ArchiveCard = ({ post }: { post: Story }) => (
	<article class="border-foreground/35 border-b py-5">
		<p class="mb-2 text-xs tracking-[0.13em] uppercase">
			{post.date} · {section(post.keywords[0] ?? "")}
		</p>
		<h3 class="text-xl leading-tight font-bold">
			<StoryLink post={post} />
		</h3>
		<p class="mt-2 line-clamp-3 text-sm leading-relaxed italic">
			{post.description}
		</p>
	</article>
);

function* ArchiveCards({ stories }: { stories: Story[] }) {
	for (const post of stories) yield <ArchiveCard post={post} />;
}

const Archive = ({ stories }: { stories: Story[] }) => (
	<section class="mt-8" aria-labelledby="archive-heading">
		<h2
			id="archive-heading"
			class="text-foreground/70 pb-3 text-xs font-bold tracking-[0.18em] uppercase"
		>
			Archive
		</h2>
		<div class="newspaper-archive grid gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<ArchiveCards stories={stories} />
		</div>
	</section>
);

function* Front({ filter }: { filter: string }) {
	const filtered =
		filter === "all"
			? posts
			: posts.filter((post) =>
					post.keywords.some((keyword) => section(keyword) === filter),
				);
	const lead =
		filtered.find((post) => !outside(post.slug)) ??
		filtered.find((post) => outside(post.slug));
	const secondary = filtered.filter((post) => post !== lead).slice(0, 4);

	yield lead ? (
		<Features lead={lead} secondary={secondary} filter={filter} />
	) : (
		<p>No posts found for this topic.</p>
	);

	const archive = filtered.filter(
		(post) => post !== lead && !secondary.includes(post),
	);

	if (archive.length > 0) yield <Archive stories={archive} />;
}

export const page = Route.get("/", (c) => {
	const filter = section(c.url.searchParams.get("filter") ?? "all");
	const all = filter === "all";

	return (
		<Layout
			head={
				<Head
					title={all ? info.title : `${info.title} - ${filter}`}
					canonical={all ? page.pathname() : page.url({ search: { filter } })}
				/>
			}
			current={filter}
			joined
			route={page}
		>
			<main id="content">
				<Front filter={filter} />
			</main>
		</Layout>
	);
});
