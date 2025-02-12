<script lang="ts">
	import "../tailwind.css";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { author, homepage, title } from "$lib/info";
	import RSS from "$lib/components/RSS.svelte";
	import YouTubeLink from "$lib/components/YouTubeLink.svelte";
	import RepoLink from "$lib/components/RepoLink.svelte";

	// https://svelte.dev/blog/view-transitions
	import { onNavigate } from "$app/navigation";
	onNavigate((navigation) => {
		// not supported in all browsers
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<Breakpoint />

<div class="mx-auto max-w-[90ch] tabular-nums">
	<header class="mb-8 flex flex-wrap justify-between gap-4">
		<div class="my-0">
			<a
				href="/"
				class="text-2xl font-extrabold uppercase italic no-underline"
				aria-label="Homepage"
			>
				{title}
			</a>
		</div>
		<form action="https://google.com/search" method="get">
			<input
				type="search"
				name="q"
				placeholder="Search blog.robino.dev"
				class="min-w-52"
			/>
			<input type="hidden" name="q" value="site:blog.robino.dev" />
		</form>
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
