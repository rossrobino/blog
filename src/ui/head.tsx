import image from "@/assets/og.png?no-inline";
import { parseDate } from "@/lib/format-date";
import * as info from "@/lib/info";
import type { Story } from "@/lib/types";
import { rss } from "@/pages/seo";
import { Render } from "ovr";

const StructuredData = ({
	post,
	url,
}: {
	post: Story | undefined;
	url: string;
}) => {
	const author = {
		"@type": "Person",
		"@id": `${info.homepage}/#person`,
		name: info.author,
		url: info.homepage,
	};
	const data = post
		? {
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				articleSection: post.keywords,
				author,
				datePublished: parseDate(post.date).toISOString().slice(0, 10),
				description: post.description,
				headline: post.title,
				inLanguage: "en-US",
				isPartOf: { "@id": `${info.origin}/#website` },
				keywords: post.keywords,
				mainEntityOfPage: { "@type": "WebPage", "@id": url },
				url,
			}
		: {
				"@context": "https://schema.org",
				"@graph": [
					{
						"@type": "WebSite",
						"@id": `${info.origin}/#website`,
						author: { "@id": author["@id"] },
						description: info.description,
						inLanguage: "en-US",
						name: info.title,
						url: info.origin,
					},
					author,
				],
			};

	return Render.html(
		`<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`,
	);
};

export const Head = ({
	title = info.title,
	description = info.description,
	canonical = "/",
	markdown,
	noindex = false,
	post,
	type = "website",
}: {
	title?: string;
	description?: string;
	canonical?: string;
	markdown?: string;
	noindex?: boolean;
	post?: Story;
	type?: "article" | "website";
}) => {
	const url = new URL(canonical, info.origin).toString();
	const imageUrl = new URL(image, info.origin).toString();

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			<link
				rel="alternate"
				type="application/rss+xml"
				title={info.title}
				href={rss.pathname()}
			/>
			{markdown && (
				<link rel="alternate" type="text/markdown" href={markdown} />
			)}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:site_name" content={info.title} />
			<meta property="og:type" content={type} />
			<meta property="og:url" content={url} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:image:type" content="image/png" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta
				property="og:image:alt"
				content={`${info.title} — ${info.description}`}
			/>
			<meta name="twitter:card" content="summary_large_image" />
			{noindex && <meta name="robots" content="noindex" />}
			{!noindex && <StructuredData post={post} url={url} />}
		</>
	);
};
