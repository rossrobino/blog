<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import PostCard from "$lib/components/PostCard.svelte";
	import RSS from "$lib/components/RSS.svelte";
	import { repository, url } from "$lib/info/index.js";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	export let data;
	const { html, post } = data;
	const { title, description, keywords } = post;

	// check if on the production site - not preview or dev modes
	const isProduction = $page.url.href.startsWith("https://blog.robino.dev");

	onMount(async () => {
		if (!customElements.get("drab-share")) {
			await import("drab/share/define");
		}
	});

	// ad sense
	afterNavigate(async () => {
		const h2s = document.querySelectorAll("h2");

		if (h2s.length > 3) {
			// the 4th h2
			const targetH2 = h2s[3];

			if (isProduction) {
				if (!customElements.get("in-article-ad")) {
					const { InArticleAd } = await import("$lib/components/InArticleAd");
					customElements.define("in-article-ad", InArticleAd);
				}
				const ad = document.createElement("in-article-ad");
				targetH2.parentNode?.insertBefore(ad, targetH2);
			} else {
				const placeholder = document.createElement("div");
				placeholder.classList.add("bg-muted", "p-1");
				targetH2.parentNode?.insertBefore(placeholder, targetH2);
			}
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(", ")} />

	{#if isProduction}
		<!-- ad sense -->
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8551617263542422"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<article class="my-16 max-w-[90ch]">
	<PostCard {post} headings link={false} />

	{@html html}

	<hr />

	<div class="flex gap-4">
		<a
			class="button !button-primary !no-underline"
			href="{repository}/blob/main/src/content/{post.slug}.md"
		>
			Edit
		</a>
		<drab-share value="{url}/posts/{post.slug}">
			<button
				data-trigger
				type="button"
				class="button button-secondary gap-1.5"
			>
				<span data-content>Share</span>
				<template data-swap>Copied</template>
			</button>
		</drab-share>
		<RSS />
	</div>
</article>
