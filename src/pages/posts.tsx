import { localPosts } from "@/lib/get-posts";
import { repository } from "@/lib/info";
import { Layout } from "@/pages/layout";
import { EChartScript } from "@/ui/echart-script";
import { Footer } from "@/ui/footer";
import { Head } from "@/ui/head";
import { PostCard } from "@/ui/post-card";
import { Share } from "@/ui/share";
import { Render, Route } from "ovr";

export const page = Route.get("/posts/:slug", (c) => {
	const i = localPosts.findIndex((post) => post.slug === c.params.slug);
	const post = localPosts[i];

	if (!post) return;

	const previous = localPosts[i - 1];
	const next = localPosts[i + 1];

	return (
		<Layout
			head={
				<>
					<Head title={post.title} description={post.description} />
					<EChartScript post={post} />
				</>
			}
		>
			<div class="mx-auto w-full max-w-[90ch] pt-6">
				<main>
					<article>
						<PostCard post={post} headings link={false} />

						<div class="prose mt-10">{Render.html(post.html)}</div>

						<div class="mt-10 flex items-center gap-4">
							<a
								class="button"
								href={`${repository}/blob/main/src/content/${post.slug}.md`}
							>
								Edit
							</a>
							<Share slug={post.slug} />
						</div>

						{(previous || next) && (
							<nav
								class="mt-8 flex flex-col justify-between gap-4 sm:flex-row"
								aria-label="Post navigation"
							>
								{previous && (
									<a href={`/posts/${previous.slug}`}>
										Previous: {previous.title}
									</a>
								)}

								{next && <a href={`/posts/${next.slug}`}>Next: {next.title}</a>}
							</nav>
						)}
					</article>
				</main>

				<hr class="my-8" />

				<Footer />
			</div>
		</Layout>
	);
});
