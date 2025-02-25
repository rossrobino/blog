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

const router = new Router({
	notFound: async (c) => {
		return new Page(html)
			.head(
				<>
					<meta name="description" content={description} />
					<title>{title} - Not Found</title>
				</>,
			)
			.body(
				<RootLayout>
					<main class="prose">
						<h1>Not Found</h1>
						<p>
							The requested path <code>{c.url.pathname}</code> was not found.
						</p>
						<p>
							<a href="/">Return home</a>
						</p>
					</main>
				</RootLayout>,
			)
			.toResponse({ status: 404, statusText: "Not found" });
	},
});

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

router.get("/posts/:slug", (c) => {
	const post = posts.find((post) => post.slug === c.params.slug);

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

	return router.notFound(c);
});

export const handler = router.fetch;
