<script lang="ts">
	import type { Post } from "$lib/types";
	import Headings from "./Headings.svelte";

	export let post: Post;

	export let headings = false;

	export let size: "sm" | "md" | "lg" = "sm";

	export let link = true;
</script>

<div
	style="view-transition-name: {post.slug};"
	class="rounded-lg border-b-2 border-r-2 border-secondary pb-0.5 pr-0.5"
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
			<div class="my-2 flex flex-wrap gap-1.5">
				{#each post.keywords as keyword}
					<div class="badge badge-secondary">{keyword}</div>
				{/each}
			</div>
		{/if}
		<div class="my-2">{post.date}</div>
		<div class="my-2 italic">{post.description}</div>
		{#if headings}
			<Headings {post} />
		{/if}
	</div>
</div>
