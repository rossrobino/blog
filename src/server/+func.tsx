import { getKeywords } from "@/lib/get-keywords";
import { getPosts } from "@/lib/get-posts";
import { description, title } from "@/lib/info";
import { Home } from "@/pages/home";
import { RootLayout } from "@/pages/layout";
import { Posts } from "@/pages/posts";
import { Page } from "@robino/html";
import { Router } from "@robino/router";
import { html } from "client:page";

const posts = await getPosts();

const router = new Router();

router.get("/", ({ url }) => {
	const filters = getKeywords(posts);

	const currentFilter = url.searchParams.get("filter") ?? "all";

	const filteredPosts = posts.filter((post) =>
		currentFilter === "all" ? true : post.keywords.includes(currentFilter),
	);

	return new Page(html)
		.head(
			<>
				<meta name="description" content={description} />
				<title>{title}</title>
			</>,
		)
		.body(
			<RootLayout>
				<Home
					posts={filteredPosts}
					filters={filters}
					currentFilter={currentFilter}
				/>
			</RootLayout>,
		)
		.toResponse();
});

router.get("/posts/:slug", ({ params }) => {
	const post = posts.find((post) => post.slug === params.slug);

	if (post) {
		return new Page(html)
			.head(
				<>
					<title>{post.title}</title>
					<meta name="description" content={post.description} />
				</>,
			)
			.body(
				<RootLayout>
					<Posts post={post}></Posts>
				</RootLayout>,
			)
			.toResponse();
	}

	return router.notFound();
});

export const handler = router.fetch;
