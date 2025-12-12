import { posts } from "@/lib/get-posts";
import { repository } from "@/lib/info";
import { Layout } from "@/pages/layout";
import { EChartScript } from "@/ui/echart-script";
import { Footer } from "@/ui/footer";
import { Head } from "@/ui/head";
import { PostCard } from "@/ui/post-card";
import { Share } from "@/ui/share";
import { Render, Route } from "ovr";

export const page = Route.get("/posts/:slug", (c) => {
	const post = posts.find((post) => post.slug === c.params.slug);

	if (!post) return;

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

						<hr class="my-8" />

						<div class="flex items-center gap-4">
							<a
								class="button"
								href={`${repository}/blob/main/src/content/${post.slug}.md`}
							>
								Edit
							</a>
							<Share slug={post.slug} />
						</div>
					</article>
				</main>

				<Footer />
			</div>
		</Layout>
	);
});
