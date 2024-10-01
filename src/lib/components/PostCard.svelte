<script lang="ts">
	import type { Post } from "$lib/types";
	import Headings from "./Headings.svelte";

	let {
		post,
		headings = false,
		size = "sm",
		link = true,
	}: {
		post: Post;
		headings?: boolean;
		size?: "sm" | "md" | "lg";
		link?: boolean;
	} = $props();
</script>

<div
	style="view-transition-name: {post.slug};"
	class="rounded-lg border-b-2 border-r-2 border-muted-background pb-0.5 pr-0.5"
	class:mb-8={!link}
	aria-label="Post card"
>
	<div
		class="h-full rounded border-2 border-secondary-background p-6 transition"
		class:hover:shadow-xl={link}
	>
		{#if link}
			<!-- on the homepage -->
			<h2
				class="underline hover:decoration-dotted"
				class:text-3xl={size === "md"}
				class:text-2xl={size === "sm"}
			>
				<a href="/posts/{post.slug}" class="font-bold">
					{post.title}
				</a>
			</h2>
		{:else}
			<!-- on the post's page -->
			<h1>{post.title}</h1>
			<ul class="my-6 flex flex-wrap gap-1.5" aria-label="keywords">
				{#each post.keywords as keyword}
					<li class="badge secondary">{keyword}</li>
				{/each}
			</ul>
		{/if}
		<div class="mb-2 mt-4" aria-label="Published date">{post.date}</div>
		<div class="italic" aria-label="Post description">
			{post.description}
		</div>
		{#if headings}
			<Headings {post} />
		{/if}
	</div>
</div>
