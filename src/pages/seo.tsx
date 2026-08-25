import { parseDate } from "@/lib/format-date";
import { localPosts } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { logo } from "@/lib/logo";
import type { Post } from "@/lib/types";
import { page as postPage } from "@/pages/posts";
import { Route } from "ovr";

const Item = ({ post }: { post: Post }) => {
	const url = new URL(
		postPage.pathname({ slug: post.slug }),
		info.origin,
	).toString();

	return (
		<item>
			<guid>{url}</guid>
			<title>{post.title}</title>
			<link>{url}</link>
			<description>{post.description}</description>
			<pubDate>{parseDate(post.date).toUTCString()}</pubDate>
		</item>
	);
};

function* Items() {
	for (const post of localPosts) {
		if (!post.draft) yield <Item post={post} />;
	}
}

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
					<Items />
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

export const favicon = Route.get("/favicon.ico", (c) => c.redirect(logo.black));
