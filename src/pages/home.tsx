import { keywords, posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { Layout } from "@/pages/layout";
import { Footer } from "@/ui/footer";
import { Head } from "@/ui/head";
import { PostCard } from "@/ui/post-card";
import { SiteSearch } from "@/ui/site-search";
import { SkipLink } from "@/ui/skip-link";
import { Route } from "ovr";

export const page = Route.get("/", (c) => {
	const currentFilter = c.url.searchParams.get("filter") ?? "all";
	const all = currentFilter === "all";

	const filteredPosts = all
		? posts
		: posts.filter((post) => post.keywords.includes(currentFilter));

	return (
		<Layout
			head={
				<Head title={all ? info.title : `${info.title} - ${currentFilter}`} />
			}
		>
			<SkipLink />

			<header class="mb-3 flex flex-wrap items-center justify-between gap-2">
				<div>
					<a
						href="/"
						class="font-extrabold uppercase italic no-underline text-shadow-sm"
						aria-label="Homepage"
					>
						{info.title}
					</a>
					<Underline />
				</div>

				<div
					class="flex flex-wrap items-center gap-2"
					aria-label="Filter posts by keywords"
				>
					{keywords.map((filter) => {
						return (
							<div>
								<a
									href={`/${filter === "all" ? "" : `?filter=${filter}`}`}
									class="button ghost uppercase"
									aria-current={filter === currentFilter ? "page" : undefined}
								>
									{filter}
								</a>
								{filter === currentFilter ? (
									<div
										class="bg-foreground rounded-sm p-0.5"
										style="view-transition-name: current-filter"
									></div>
								) : (
									<Underline />
								)}
							</div>
						);
					})}

					<div>
						<SiteSearch />
						<Underline />
					</div>
				</div>
			</header>

			<div class="flex min-h-[calc(100dvh-100px)] flex-col justify-between">
				<main id="content">
					<section
						aria-label={`Post list, filtered to ${currentFilter} posts.`}
					>
						<div class="columns-1 gap-4 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
							{filteredPosts.map((post, i) => {
								const uppercase = Math.random() > 0.67;
								const italic = Math.random() > 0.6;
								const medium = Math.random() > 0.75;
								const headings = Math.random() > 0.75;

								return (
									<PostCard
										post={post}
										uppercase={i !== 0 && uppercase}
										italic={i !== 0 && italic}
										size={i === 0 ? "lg" : medium ? "md" : "sm"}
										headings={i === 0 || headings}
									/>
								);
							})}
						</div>
					</section>
				</main>

				<Footer />
			</div>
		</Layout>
	);
});

const Underline = () => <div class="p-0.5"></div>;
