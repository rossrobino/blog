import { getKeywords } from "@/lib/get-keywords";
import { getPosts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { Home } from "@/pages/home";
import { RootLayout } from "@/pages/layout";
import { Posts } from "@/pages/posts";
import { Router } from "@robino/router";
import { html } from "client:page";

const posts = getPosts();

const Head = (props: { title?: string; description?: string }) => {
	const { title = info.title, description = info.description } = props;
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
		</>
	);
};

const router = new Router({
	start(c) {
		c.base = html;
		c.layout(RootLayout);
		c.notFound = (c) => {
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
	},
});

let filters: string[];

router.get("/", (c) => {
	if (!filters) filters = getKeywords(posts);

	const currentFilter = c.url.searchParams.get("filter") ?? "all";
	const all = currentFilter === "all";

	const filteredPosts = all
		? posts
		: posts.filter((post) => post.keywords.includes(currentFilter));

	c.head(
		<Head title={all ? info.title : `${info.title} - ${currentFilter}`} />,
	);

	c.page(
		<Home
			posts={filteredPosts}
			filters={filters}
			currentFilter={currentFilter}
		/>,
	);
});

router.get("/posts/:slug", async (c) => {
	const post = posts.find((post) => post.slug === c.params.slug);

	if (post) {
		c.head(<Head title={post.title} description={post.description} />);
		c.page(<Posts post={post}></Posts>);
	}
});

export const handler = router.fetch;
