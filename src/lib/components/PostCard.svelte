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
	class="rounded-lg border-b-2 border-r-2 border-secondary pb-0.5 pr-0.5"
	aria-label="Post card"
>
	<div class="card h-full border-2 transition" class:hover:shadow-xl={link}>
		{#if link}
			<!-- on the homepage -->
			<h2
				class="my-0"
				class:text-3xl={size === "md"}
				class:text-4xl={size === "lg"}
			>
				<a href="/posts/{post.slug}" class="font-bold">
					{post.title}
				</a>
			</h2>
		{:else}
			<!-- on the post's page -->
			<h1>{post.title}</h1>
			<ul class="not-prose my-2 flex flex-wrap gap-1.5" aria-label="keywords">
				{#each post.keywords as keyword}
					<li class="badge badge-secondary">{keyword}</li>
				{/each}
			</ul>
		{/if}
		<div class="my-2" aria-label="Published date">{post.date}</div>
		<div class="my-2 italic" aria-label="Post description">
			{post.description}
		</div>
		{#if headings}
			<Headings {post} />
		{/if}
	</div>
</div>
