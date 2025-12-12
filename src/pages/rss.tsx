import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { Route } from "ovr";

// https://www.davidwparker.com/posts/how-to-make-an-rss-feed-in-sveltekit
const rss = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<atom:link href="${info.origin}/rss" rel="self" type="application/rss+xml" />
		<title>${info.title}</title>
		<link>${info.origin}</link>
		<description>${info.description}</description>
		${posts
			.filter(
				// filter out external links and drafts
				(post) => !post.slug.startsWith("http") && !post.draft,
			)
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

export const page = Route.get("/rss", (c) => {
	c.res.body = rss;
	c.res.headers.set("content-type", "application/xml");
});
