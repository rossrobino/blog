import { getKeywords } from "@/lib/get-keywords";
import { getPosts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { rss } from "@/lib/rss";
import { Home } from "@/pages/home";
import { RootLayout } from "@/pages/layout";
import { Posts } from "@/pages/posts";
import { Head } from "@/ui/head";
import { html } from "client:page";
import { App } from "ovr";

const posts = getPosts();

const app = new App();

app.base = html;

app.prerender = getPosts().map((post) => `/posts/${post.slug}`);

app.notFound = (c) => {
	c.head(<Head title={`${info.title} - Not Found`} />);

	c.page(
		<main class="prose">
			<h1>Not Found</h1>
			<p>
				The requested path <code>{c.url.pathname}</code> was not found.
			</p>
			<p>
				<a href="/">Return home</a>
			</p>
		</main>,
		404,
	);
};

app.use(async (c, next) => {
	c.layout(RootLayout);
	await next();
});

let filters: string[];

app.get("/", (c) => {
	if (!filters) filters = getKeywords(posts);

	const currentFilter = c.url.searchParams.get("filter") ?? "all";
	const all = currentFilter === "all";

	const filteredPosts = all
		? posts
		: posts.filter((post) => post.keywords.includes(currentFilter));

	// if (c.etag(JSON.stringify(filteredPosts))) return;

	c.head(
		<Head title={all ? info.title : `${info.title} - ${currentFilter}`} />,
	);

	return (
		<Home
			posts={filteredPosts}
			filters={filters}
			currentFilter={currentFilter}
		/>
	);
});

app.get("/posts/:slug", async (c) => {
	const post = posts.find((post) => post.slug === c.params.slug);

	if (post) {
		c.head(<Head title={post.title} description={post.description} />);
		return <Posts post={post} />;
	}
});

app.get("/rss", (c) =>
	c.res(rss(posts), { headers: { "content-type": "application/xml" } }),
);

app.get("/robots.txt", (c) =>
	c.text(
		`
User-agent: *
Disallow:

Sitemap: ${info.origin}/rss
`.trim(),
	),
);

app.get("/posts/domco", (c) => c.redirect("https://domco.robino.dev", 308));

export default app;
