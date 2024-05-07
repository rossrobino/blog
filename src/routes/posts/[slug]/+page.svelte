<script lang="ts">
	import PostCard from "$lib/components/PostCard.svelte";
	import RSS from "$lib/components/RSS.svelte";
	import { repository, url } from "$lib/info/index.js";
	import { onMount } from "svelte";

	let { data } = $props();

	const { html, post } = data;
	const { title, description, keywords } = post;

	onMount(async () => {
		if (!customElements.get("drab-share")) {
			await import("drab/share/define");
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(", ")} />
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
