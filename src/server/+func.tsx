import { getKeywords } from "@/lib/get-keywords";
import { getPosts } from "@/lib/get-posts";
import { description, title } from "@/lib/info";
import { Home } from "@/pages/home";
import { RootLayout } from "@/pages/layout";
import { Posts } from "@/pages/posts";
import { Router } from "@robino/router";
import { html } from "client:page";

const posts = getPosts();

const router = new Router({
	html,
	async notFound(c) {
		c.res.html((p) => {
			p.head(
				<>
					<meta name="description" content={description} />
					<title>{title} - Not Found</title>
				</>,
			).body(
				<RootLayout>
					<main class="prose">
						<h1>Not Found</h1>
						<p>
							The requested path <code>{c.req.url.pathname}</code> was not
							found.
						</p>
						<p>
							<a href="/">Return home</a>
						</p>
					</main>
				</RootLayout>,
			);
		}, 404);
	},
});

let filters: string[];

router.get("/", (c) => {
	if (!filters) filters = getKeywords(posts);

	const currentFilter = c.req.url.searchParams.get("filter") ?? "all";
	const filteredPosts =
		currentFilter === "all"
			? posts
			: posts.filter((post) => post.keywords.includes(currentFilter));

	c.res.html((p) => {
		p.head(
			<>
				<meta name="description" content={description} />
				<title>{title}</title>
			</>,
		).body(
			<RootLayout>
				<Home
					posts={filteredPosts}
					filters={filters}
					currentFilter={currentFilter}
				/>
			</RootLayout>,
		);
	});
});

router.get("/posts/:slug", async (c) => {
	const post = posts.find((post) => post.slug === c.params.slug);

	if (post) {
		c.res.html((p) => {
			p.head(
				<>
					<title>{post.title}</title>
					<meta name="description" content={post.description} />
				</>,
			).body(
				<RootLayout>
					<Posts post={post}></Posts>
				</RootLayout>,
			);
		});
	}
});

export const handler = router.fetch;
