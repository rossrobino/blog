import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { section } from "@/lib/section";
import type { Post } from "@/lib/types";
import { Layout } from "@/pages/layout";
import { page as postPage } from "@/pages/posts";
import { Head } from "@/ui/head";
import { StoryHeader } from "@/ui/story-header";
import { clsx } from "clsx";
import { Render, Route } from "ovr";

const preview = (
	post: Post,
	{
		length = 3,
		inline = false,
		minimum = 0,
	}: { length?: number; inline?: boolean; minimum?: number } = {},
) => {
	const paragraphs = post.html
		?.replace(
			/<(iframe|video|audio|picture|figure|object|e-chart)\b[^>]*>[\s\S]*?<\/\1>/gi,
			"",
		)
		.replace(/<(img|embed)\b[^>]*>/gi, "")
		?.match(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/g)
		?.filter((paragraph) => paragraph.replace(/<[^>]+>/g, "").trim());

	if (!paragraphs) {
		return inline ? post.description : `<p>${post.description}</p>`;
	}

	const excerpt: string[] = [];
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
					i === excerpt.length - 1 && paragraphs.length > excerpt.length
						? paragraph.replace(/<\/p>$/, "…</p>")
						: paragraph,
				)
				.join("");
};

export const page: Route.Get<"/"> = Route.get("/", (c) => {
	const currentFilter = section(c.url.searchParams.get("filter") ?? "all");
	const all = currentFilter === "all";
	const filteredPosts = all
		? posts
		: posts.filter((post) =>
				post.keywords.some((keyword) => section(keyword) === currentFilter),
			);
	const outside = (slug: string) =>
		slug.startsWith("http://") || slug.startsWith("https://");
	const href = (slug: string) =>
		outside(slug) ? slug : postPage.pathname({ slug });
	const local = filteredPosts.filter((post) => !outside(post.slug));
	const external = filteredPosts.filter((post) => outside(post.slug));
	const lead = local[0] ?? external[0];
	const secondary = filteredPosts.filter((post) => post !== lead).slice(0, 4);
	const briefs = secondary.filter((post) => !outside(post.slug));
	const dispatches = secondary.filter((post) => outside(post.slug));
	const split = dispatches.length === 0;
	const primary = split ? briefs : briefs.slice(0, 2);
	const overflow = split ? undefined : briefs[2];
	const sides = briefs.length > 0 || dispatches.length > 0;
	const archive = filteredPosts.filter(
		(post) => post !== lead && !secondary.includes(post),
	);
	const card = (post: Post, i: number, classes: string) => (
		<article class={clsx("pb-6", classes)}>
			<h3
				class={clsx("text-xl leading-tight font-bold", {
					"tracking-[0.025em] uppercase": i === 0,
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
				{Render.html(preview(post, { length: 2, inline: true }))}
			</p>
			<p class="mt-3 text-xs tracking-wider uppercase">{post.date}</p>
		</article>
	);

	return (
		<Layout
			head={
				<Head
					title={all ? info.title : `${info.title} - ${currentFilter}`}
					canonical={
						all
							? page.pathname()
							: page.url({ search: { filter: currentFilter } })
					}
				/>
			}
			current={currentFilter}
			joined
			route={page}
		>
			<main id="content">
				{lead ? (
					<section
						class={clsx(
							"grid",
							sides &&
								"lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)_minmax(0,1fr)]",
						)}
						aria-label={`Front page, filtered to ${currentFilter} posts.`}
					>
						<article
							class={clsx(
								"flex min-h-0 flex-col pt-8 pb-9 lg:col-start-1 lg:row-start-1 lg:pb-10",
								sides && "newspaper-column-rule lg:pr-8",
							)}
						>
							<StoryHeader post={lead} href={href(lead.slug)} wide={!sides} />
							<div class="newspaper-lead-preview min-h-80 flex-1">
								<div
									data-preview-truncate
									class="newspaper-lead-copy prose mx-auto max-w-none text-justify text-base leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-black sm:columns-2 sm:gap-5"
								>
									{Render.html(
										`${preview(lead, {
											length: 12,
											inline: true,
											minimum: 6000,
										})}…`,
									)}
								</div>
							</div>
							<p class="mt-6 shrink-0 text-end">
								<a
									class="inline-flex items-center gap-1.5 font-bold tracking-wider"
									href={href(lead.slug)}
								>
									<span>Continue reading</span>
									<span
										class="icon-[ph--arrow-right] text-base"
										aria-hidden="true"
									></span>
								</a>
							</p>
						</article>

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
								{primary.map((post, i) =>
									card(
										post,
										i,
										clsx(
											i === 0
												? "pt-2"
												: split && i === 1
													? "border-foreground/35 border-t pt-6 sm:border-t-0 sm:pt-2"
													: "border-foreground/35 border-t pt-6 sm:border-t-0 sm:pt-4 lg:border-t lg:pt-6",
											split && i % 2 === 0 && "lg:mr-5",
											split && i % 2 === 1 && "lg:ml-5",
										),
									),
								)}
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
								{overflow &&
									card(
										overflow,
										2,
										"border-foreground/35 border-t pt-6 lg:border-t-0 lg:pt-6",
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
									{dispatches.map((post, i) => (
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
													"tracking-[0.025em] uppercase": i === 1,
												})}
											>
												<a
													href={href(post.slug)}
													class={
														outside(post.slug)
															? "inline-flex items-start gap-1"
															: ""
													}
													{...(outside(post.slug)
														? { rel: "noopener noreferrer", target: "_blank" }
														: {})}
												>
													<span class="line-clamp-3">{post.title}</span>
													{outside(post.slug) && (
														<>
															<span
																class="icon-[ph--arrow-up-right] mt-1 shrink-0 text-sm"
																aria-hidden="true"
															></span>
															<span class="sr-only"> (opens in a new tab)</span>
														</>
													)}
												</a>
											</h3>
											<p class="mt-2 line-clamp-3 text-justify text-sm leading-relaxed italic">
												{post.description}
											</p>
											<p class="mt-3 text-xs tracking-wider uppercase">
												{post.date}
											</p>
										</article>
									))}
								</div>
							</div>
						)}
					</section>
				) : (
					<p>No posts found for this topic.</p>
				)}

				{archive.length > 0 && (
					<section class="mt-8" aria-labelledby="archive-heading">
						<h2
							id="archive-heading"
							class="text-foreground/70 pb-3 text-xs font-bold tracking-[0.18em] uppercase"
						>
							Archive
						</h2>
						<div class="newspaper-archive grid gap-x-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{archive.map((post) => (
								<article class="border-foreground/35 border-b py-5">
									<p class="mb-2 text-xs tracking-[0.13em] uppercase">
										{post.date} · {section(post.keywords[0] ?? "")}
									</p>
									<h3 class="text-xl leading-tight font-bold">
										<a
											href={href(post.slug)}
											class={
												outside(post.slug)
													? "inline-flex items-start gap-1"
													: ""
											}
											{...(outside(post.slug)
												? { rel: "noopener noreferrer", target: "_blank" }
												: {})}
										>
											<span class="line-clamp-3">{post.title}</span>
											{outside(post.slug) && (
												<>
													<span
														class="icon-[ph--arrow-up-right] mt-1 shrink-0 text-sm"
														aria-hidden="true"
													></span>
													<span class="sr-only"> (opens in a new tab)</span>
												</>
											)}
										</a>
									</h3>
									<p class="mt-2 line-clamp-3 text-sm leading-relaxed italic">
										{post.description}
									</p>
								</article>
							))}
						</div>
					</section>
				)}
			</main>
		</Layout>
	);
});
