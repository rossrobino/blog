import type { Post } from "$lib/types";
import { getPosts } from "$lib/util/getPosts";

export const prerender = true;

export const GET = async () => {
	const posts = await getPosts();
	return new Response(xml(posts), {
		headers: {
			"Cache-Control": "max-age=0, s-max-age=3600",
			"Content-Type": "application/xml",
		},
	});
};

// https://www.davidwparker.com/posts/how-to-make-an-rss-feed-in-sveltekit
const xml = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="http://robino.dev/feed" rel="self" type="application/rss+xml" />
<title>blog.robino.dev</title>
<link>http://robino.dev</link>
<description>Ross Robino's blog</description>
${posts
	.map(
		(post) => `<item>
<guid>https://robino.dev/posts/${post.slug}</guid>
<title>${post.title}</title>
<link>https://robino.dev/posts/${post.slug}</link>
<description>${post.description}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`,
	)
	.join("")}
</channel>
</rss>
`;
