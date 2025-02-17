import { getKeywords } from "@/lib/get-keywords";
import { getPosts } from "@/lib/get-posts";
import { description, title } from "@/lib/info";
import { Home } from "@/pages/home";
import { RootLayout } from "@/pages/layout";
import { Posts } from "@/pages/posts";
import { Injector } from "@robino/html";
import { html } from "client:page";
import type { Handler } from "domco";

const posts = await getPosts();

export const handler: Handler = async (req) => {
	const url = new URL(req.url);

	const page = new Injector(html);

	if (url.pathname === "/") {
		const filters = getKeywords(posts);

		const currentFilter = url.searchParams.get("filter") ?? "all";

		const filteredPosts = posts.filter((post) =>
			currentFilter === "all" ? true : post.keywords.includes(currentFilter),
		);

		page
			.title(title)
			.head({ name: "meta", attrs: { content: description } })
			.body(
				<RootLayout>
					<Home
						posts={filteredPosts}
						filters={filters}
						currentFilter={currentFilter}
					/>
				</RootLayout>,
			);
	} else if (url.pathname.startsWith("/posts/")) {
		const slug = url.pathname.split("/").at(-1);

		if (slug) {
			const post = posts.find((post) => post.slug === slug);

			if (post) {
				page
					.title(post.title)
					.head({ name: "meta", attrs: { content: post.description } })
					.body(
						<RootLayout>
							<Posts post={post}></Posts>
						</RootLayout>,
					);
			}
		}
	}

	if (!page.empty) {
		return page.toResponse();
	}

	// trim trailing slash
	if (url.pathname.at(-1) === "/") {
		url.pathname = url.pathname.slice(0, -1);
		url.search = "";
		return Response.redirect(url, 308);
	}

	return new Response("Not found", { status: 404 });
};
