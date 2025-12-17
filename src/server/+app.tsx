import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import * as home from "@/pages/home";
import { Layout } from "@/pages/layout";
import * as post from "@/pages/posts";
import * as seo from "@/pages/seo";
import { Head } from "@/ui/head";
import * as script from "client:script";
import * as style from "client:style";
import { App, type Middleware } from "ovr";

const app = new App();

const notFound: Middleware = async (c, next) => {
	await next();

	if (c.res.body === undefined) {
		c.res.status = 404;

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
			</Layout>
		);
	}
};

const preload: Middleware = async (c, next) => {
	await next();

	if (c.res.headers.get("content-type")?.startsWith("text/html")) {
		c.res.headers.set(
			"link",
			`<${style.src.file}>; rel=preload; as=style; fetchpriority="high"`,
		);
	}
};

app.use(notFound, preload, home, post, seo);

export default {
	fetch: app.fetch,
	prerender: [
		...posts
			.filter((post) => !post.slug.startsWith("http")) // filter out external
			.map((post) => `/posts/${post.slug}`),
		seo.robots.pathname(),
		seo.rss.pathname(),
	],
};
