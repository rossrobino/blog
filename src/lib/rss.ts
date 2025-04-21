import { url, title, description } from "@/lib/info";
import type { Post } from "@/lib/types";

// https://www.davidwparker.com/posts/how-to-make-an-rss-feed-in-sveltekit
export const rss = (posts: Post[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<atom:link href="${url}/rss" rel="self" type="application/rss+xml" />
<title>${title}</title>
<link>${url}</link>
<description>${description}</description>
${posts
	.filter((post) => !post.slug.startsWith("+"))
	.map(
		(post) => `<item>
<guid>${url}/posts/${post.slug}</guid>
<title>${post.title}</title>
<link>${url}/posts/${post.slug}</link>
<description>${post.description}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`,
	)
	.join("")}
</channel>
</rss>
`;
