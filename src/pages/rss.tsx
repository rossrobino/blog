import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import type { Post } from "@/lib/types";
import { Get } from "ovr";

// https://www.davidwparker.com/posts/how-to-make-an-rss-feed-in-sveltekit
const rss = (posts: Post[]) =>
	`
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="${info.origin}/rss" rel="self" type="application/rss+xml" />
		<title>${info.title}</title>
		<link>${info.origin}</link>
		<description>${info.description}</description>
		${posts
			.filter((post) => !post.slug.startsWith("+"))
			.map((post) =>
				/* xml */ `
				<item>
					<guid>${info.origin}/posts/${post.slug}</guid>
					<title>${post.title}</title>
					<link>${info.origin}/posts/${post.slug}</link>
					<description>${post.description}</description>
					<pubDate>${new Date(post.date).toUTCString()}</pubDate>
				</item>
				`.trim(),
			)
			.join("")}
	</channel>
</rss>
`.trim();

export const page = new Get("/rss", (c) =>
	c.res(rss(posts), { headers: { "content-type": "application/xml" } }),
);
