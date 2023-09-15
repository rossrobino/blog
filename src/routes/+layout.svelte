<script lang="ts">
	import "../app.postcss";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { author, homepage, repository, title } from "$lib/info/mod";

	// remove if not using vercel analytics
	import { dev } from "$app/environment";
	import { inject } from "@vercel/analytics";
	inject({ mode: dev ? "development" : "production" });

	// https://svelte.dev/blog/view-transitions
	import { onNavigate } from "$app/navigation";
	import Repo from "$lib/icons/Repo.svelte";
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
</script>

<Breakpoint />

<div
	class="font-humanist prose prose-neutral prose-a:link hover:prose-a:decoration-dotted prose-pre:-mx-6 prose-pre:rounded-none prose-pre:p-6 prose-img:rounded-md prose-img:border md:prose-pre:mx-0 md:prose-pre:rounded-md max-w-none"
>
	<header class="mb-8">
		<h2 class="my-0">
			<a href="/" class="font-extrabold uppercase italic !no-underline">
				{title}
			</a>
		</h2>
	</header>

	<main><slot /></main>

	<footer class="mt-8 flex justify-between">
		<div>
			<span>{new Date().getFullYear()} -</span>
			<a href={homepage}>{author}</a>
		</div>
		<a href={repository} title="Repository"><Repo /></a>
	</footer>
</div>
