import { posts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { Route } from "ovr";

export const rss = Route.get("/rss", (c) => {
	c.res.headers.set("content-type", "application/xml; charset=utf-8");

	return (
		<>
			<xml version="1.0" encoding="utf-8" />
			<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
				<channel>
					<atom:link
						href={`${info.origin}/rss`}
						rel="self"
						type="application/rss+xml"
					/>
					<title>{info.title}</title>
					<link>{info.origin}</link>
					<description>{info.description}</description>
					<managingEditor>Ross Robino</managingEditor>
					<language>en-us</language>
					{posts
						.filter(
							// filter out external links and drafts
							(post) => !post.slug.startsWith("http") && !post.draft,
						)
						.map((post) => (
							<item>
								<guid>
									{info.origin}/posts/{post.slug}
								</guid>
								<title>{post.title}</title>
								<link>{`${info.origin}/posts/${post.slug}`}</link>
								<description>{post.description}</description>
								<pubDate>{new Date(post.date).toUTCString()}</pubDate>
							</item>
						))}
				</channel>
			</rss>
		</>
	);
});

export const robots = Route.get("/robots.txt", (c) =>
	c.text(
		`
User-agent: *
Disallow:

Sitemap: ${info.origin}${rss.pathname()}
`.trim(),
	),
);
