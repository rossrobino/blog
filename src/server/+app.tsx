import * as info from "@/lib/info";
import * as home from "@/pages/home";
import { Layout } from "@/pages/layout";
import * as post from "@/pages/posts";
import * as seo from "@/pages/seo";
import { Head } from "@/ui/head";
import { App, type Middleware } from "ovr";

const app = new App();

const notFound: Middleware = async (c, next) => {
	await next();

	if (c.res.body === undefined) {
		c.res.status = 404;
		c.res.headers.set("vary", "Accept");

		if (c.req.headers.get("accept")?.toLowerCase().includes("text/markdown")) {
			c.res.body = `# Not Found\n\nThe requested path \`${c.url.pathname}\` was not found.\n\n${seo.guidance}`;
			c.res.headers.set("content-type", "text/markdown; charset=utf-8");
			return;
		}

		return (
			<Layout
				compact
				head={
					<Head
						title={`${info.title} - Not Found`}
						canonical={c.url.pathname}
						noindex
					/>
				}
			>
				<main id="content" class="prose">
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

const headers: Middleware = async (c, next) => {
	await next();

	const type = c.res.headers.get("content-type");

	if (!type?.startsWith("text/html") && !type?.startsWith("text/markdown")) {
		return;
	}

	const links = [
		`<${seo.rss.pathname()}>; rel="alternate"; type="application/rss+xml"`,
	];

	if (c.route === post.page) {
		const slug = c.params.slug;

		if (!slug) return;

		if (slug.endsWith(".md")) {
			links.push(
				`<${post.page.pathname({ slug: slug.slice(0, -3) })}>; rel="canonical"; type="text/html"`,
			);
		} else {
			links.push(
				`<${post.page.pathname({ slug: `${slug}.md` })}>; rel="alternate"; type="text/markdown"`,
			);
		}
	}

	c.res.headers.set("link", links.join(", "));
};

app.use(
	notFound,
	headers,
	home,
	post,
	seo.favicon,
	seo.llms,
	seo.robots,
	seo.rss,
);

export default { fetch: app.fetch };
