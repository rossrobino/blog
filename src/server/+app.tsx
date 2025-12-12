import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import * as home from "@/pages/home";
import { Layout } from "@/pages/layout";
import * as post from "@/pages/posts";
import * as robots from "@/pages/robots";
import * as rss from "@/pages/rss";
import { Head } from "@/ui/head";
import { App, type Middleware } from "ovr";

const app = new App();

const notFound: Middleware = async (c, next) => {
	await next();
	
	if (c.res.body === undefined) {

	c.res.status = 404

	return (
		<Layout head={<Head title={`${info.title} - Not Found`} />}>
		<main class="prose">
			<h1>Not Found</h1>
			<p>
				The requested path <code>{c.url.pathname}</code> was not found.
			</p>
			<p>
				<a href="/">Return home</a>
			</p>
		</main>
		</Layout>)
	}
};



app.use(notFound);


app.use(home, post, rss, robots);

export default {
	fetch: app.fetch,
	prerender: [
		...posts
			.filter((post) => !post.slug.startsWith("http")) // filter out external
			.map((post) => `/posts/${post.slug}`),
		robots.page.pathname(),
	],
};
