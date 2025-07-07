import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import * as home from "@/pages/home";
import { Layout } from "@/pages/layout";
import * as post from "@/pages/posts";
import * as robots from "@/pages/robots";
import * as rss from "@/pages/rss";
import { Head } from "@/ui/head";
import { html } from "client:page";
import { App } from "ovr";

const app = new App();

app.base = html;

app.prerender = [
	...posts.map((post) => `/posts/${post.slug}`),
	robots.page.pathname(),
];

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

app.use((c, next) => {
	c.layout(Layout);
	return next();
});

// redirects
app.get("/posts/domco", (c) => c.redirect("https://domco.robino.dev", 308));

app.add(home, post, rss, robots);

export default app;
