import { formatDate } from "@/lib/format-date";
import { localPosts } from "@/lib/get-posts";
import { repository } from "@/lib/info";
import { section } from "@/lib/section";
import type { Post } from "@/lib/types";
import { Layout } from "@/pages/layout";
import { EChartScript } from "@/ui/echart-script";
import { Head } from "@/ui/head";
import { Headings } from "@/ui/headings";
import { Share } from "@/ui/share";
import { SocialLinks } from "@/ui/social-links";
import { StoryHeader } from "@/ui/story-header";
import { Render, Route } from "ovr";

const markdownPath = (slug: string) => page.pathname({ slug: `${slug}.md` });

function* Keywords({ post }: { post: Post }) {
	for (const keyword of new Set(post.keywords.map(section))) {
		yield (
			<li>
				<a href={`/?filter=${encodeURIComponent(keyword)}`}>{keyword}</a>
			</li>
		);
	}
}

const Topics = ({ post, path }: { post: Post; path: string }) => (
	<aside
		class="newspaper-aside border-foreground/35 border-b py-5 lg:col-start-1 lg:row-start-1 lg:border-b-0 lg:py-0"
		aria-labelledby="article-topics-heading"
	>
		<h2
			id="article-topics-heading"
			class="text-xs font-bold tracking-[0.16em] uppercase"
		>
			Filed under
		</h2>
		<ul class="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm" aria-label="Topics">
			<Keywords post={post} />
		</ul>
		<div class="mt-6 flex flex-wrap items-center gap-3">
			<a
				class="button secondary"
				href={`${repository}/blob/main/src/content/${post.slug}.md`}
			>
				Edit
			</a>
			<Share path={path} />
			<SocialLinks />
		</div>
	</aside>
);

const Navigation = ({ i }: { i: number }) => {
	const previous = localPosts[i - 1];
	const next = localPosts[i + 1];

	if (!previous && !next) return;

	return (
		<nav
			class="newspaper-double-rule-top newspaper-double-rule-bottom newspaper-double-rule-inverted mt-12 grid gap-6 py-6 sm:grid-cols-2"
			aria-label="Post navigation"
		>
			{previous ? (
				<page.Anchor
					params={{ slug: previous.slug }}
					class="group no-underline"
				>
					<span class="block text-xs font-bold tracking-[0.16em] uppercase">
						{formatDate(previous.date)}
					</span>
					<span class="mt-1 block text-xl leading-tight font-bold group-hover:underline">
						← {previous.title}
					</span>
				</page.Anchor>
			) : (
				<span />
			)}

			{next && (
				<page.Anchor
					params={{ slug: next.slug }}
					class="group text-end no-underline"
				>
					<span class="block text-xs font-bold tracking-[0.16em] uppercase">
						{formatDate(next.date)}
					</span>
					<span class="mt-1 block text-xl leading-tight font-bold group-hover:underline">
						{next.title} →
					</span>
				</page.Anchor>
			)}
		</nav>
	);
};

const Article = ({
	post,
	i,
	path,
}: {
	post: Post;
	i: number;
	path: string;
}) => (
	<article>
		<StoryHeader post={post} ruled showDate={false} />

		<div class="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(10rem,0.8fr)_minmax(0,3fr)_minmax(10rem,0.8fr)]">
			<aside
				class="newspaper-aside border-foreground/35 border-b py-5 lg:col-start-3 lg:row-start-1 lg:border-b-0 lg:py-0"
				aria-labelledby="article-navigation-heading"
			>
				<h2
					id="article-navigation-heading"
					class="text-xs font-bold tracking-[0.16em] uppercase"
				>
					In this article
				</h2>
				<Headings post={post} />
			</aside>

			<div class="newspaper-story prose max-w-none min-w-0 text-lg leading-relaxed lg:col-start-2 lg:row-start-1">
				{Render.html(post.html)}
			</div>

			<Topics post={post} path={path} />
		</div>

		<Navigation i={i} />
	</article>
);

/**
 * Serves a post as HTML by default, redirects negotiated Markdown requests to
 * the `.md` representation, and returns the complete original Markdown source
 * including frontmatter when the pathname already has the suffix.
 */
export const page = Route.get("/posts/:slug", (c) => {
	const direct = c.params.slug.endsWith(".md");
	const slug = direct ? c.params.slug.slice(0, -3) : c.params.slug;
	const i = localPosts.findIndex((post) => post.slug === slug);
	const post = localPosts[i];

	if (!post) return;

	const markdown =
		direct ||
		c.req.headers.get("accept")?.toLowerCase().includes("text/markdown");

	if (!direct) c.res.headers.set("vary", "Accept");

	if (markdown) {
		if (!direct) {
			c.redirect(markdownPath(post.slug), 307);
			return;
		}

		c.res.body = post.source;
		c.res.headers.set("content-type", "text/markdown; charset=utf-8");
		return;
	}

	const pathname = page.pathname({ slug: post.slug });

	return (
		<Layout
			compact
			date={post.date}
			head={
				<>
					<Head
						title={post.title}
						description={post.description}
						canonical={pathname}
						markdown={markdownPath(post.slug)}
						post={post}
						type="article"
					/>
					<EChartScript post={post} />
				</>
			}
		>
			<main id="content">
				<Article post={post} i={i} path={pathname} />
			</main>
		</Layout>
	);
});
