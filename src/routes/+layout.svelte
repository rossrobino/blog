<script lang="ts">
	import "../app.postcss";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { author, homepage, repository, title } from "$lib/info";

	// remove if not using vercel analytics
	import { dev } from "$app/environment";
	import { inject } from "@vercel/analytics";
	inject({ mode: dev ? "development" : "production" });

	// https://svelte.dev/blog/view-transitions
	import { onNavigate } from "$app/navigation";
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

	<footer class="mt-8 flex justify-between">
		<div>
			<span>{new Date().getFullYear()} -</span>
			<a href={homepage}>{author}</a>
		</div>
		<a
			href={repository}
			title="Repository"
			class="button button-ghost button-icon"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-6"
				aria-hidden="true"
			>
				<path
					d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
				/>
				<path d="M9 18c-4.51 2-5-2-7-2" />
			</svg>
		</a>
	</footer>
</div>
