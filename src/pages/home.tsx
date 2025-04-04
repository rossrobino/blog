import { title } from "@/lib/info";
import type { Post } from "@/lib/types";
import { Footer } from "@/ui/footer";
import { PostCard } from "@/ui/post-card";
import { SiteSearch } from "@/ui/site-search";
import { SkipLink } from "@/ui/skip-link";

export const Home = (props: {
	filters: string[];
	currentFilter: string;
	posts: Post[];
}) => {
	const { filters, currentFilter, posts } = props;

	return (
		<>
			<SkipLink />
			<header class="mb-3 flex flex-wrap items-center justify-between gap-2">
				<div>
					<a
						href="/"
						class="font-extrabold uppercase italic no-underline text-shadow-sm"
						aria-label="Homepage"
					>
						{title}
					</a>
					<div class="p-0.5"></div>
				</div>
				<div
					class="flex flex-wrap items-center gap-2"
					aria-label="Filter posts by keywords"
				>
					{filters.map((filter) => {
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
									<div class="p-0.5"></div>
								)}
							</div>
						);
					})}
					<div>
						<SiteSearch />
						<div class="p-0.5"></div>
					</div>
				</div>
			</header>

			<div class="flex min-h-[calc(100dvh-100px)] flex-col justify-between">
				<main id="content">
					<section
						aria-label={`Post list, filtered to ${currentFilter} posts.`}
					>
						<div class="columns-1 gap-4 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
							{posts.map((post, i) => {
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
		</>
	);
};
