<script lang="ts">
	import "../app.postcss";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { author, homepage, repository, title } from "$lib/info";
	import RSS from "$lib/components/RSS.svelte";

	// remove if not using vercel analytics
	import { dev } from "$app/environment";
	import { inject } from "@vercel/analytics";
	inject({ mode: dev ? "development" : "production" });

	// https://svelte.dev/blog/view-transitions
	import { onNavigate } from "$app/navigation";
	import Rss from "$lib/components/RSS.svelte";
	import YouTubeLink from "$lib/components/YouTubeLink.svelte";
	import RepoLink from "$lib/components/RepoLink.svelte";
	onNavigate((navigation) => {
		// @ts-expect-error - not supported in all browsers
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			// @ts-expect-error - not supported in all browsers
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<Breakpoint />

<div
	class="prose prose-neutral mx-auto max-w-[98ch] prose-a:link hover:prose-a:decoration-dotted prose-pre:-mx-6 prose-pre:rounded-none prose-pre:p-6 prose-img:rounded-md prose-img:border md:prose-pre:mx-0 md:prose-pre:rounded-md"
>
	<header class="mb-8">
		<div class="my-0">
			<a
				href="/"
				class="text-2xl font-extrabold uppercase italic !no-underline"
				aria-label="Homepage"
			>
				{title}
			</a>
		</div>
	</header>

	<main>{@render children()}</main>

	<footer class="mt-8 flex items-center justify-between gap-4">
		<div>
			<span>{new Date().getFullYear()} -</span>
			<a href={homepage}>{author}</a>
		</div>
		<div class="flex gap-1">
			<RSS />
			<YouTubeLink />
			<RepoLink />
		</div>
	</footer>
</div>
