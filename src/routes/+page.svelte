<script lang="ts">
	import { description, title } from "$lib/info";
	import PostCard from "$lib/components/PostCard.svelte";
	import type { Post } from "$lib/types";

	export let data;

	let { posts, filters } = data;

	let currentFilter = "all";

	const changeFilter = (filter: string) => {
		const change = () => {
			currentFilter = filter;
		};
		// @ts-expect-error - not supported in all browsers
		if (document.startViewTransition) {
			// @ts-expect-error - not supported in all browsers
			document.startViewTransition(() => {
				change();
			});
		} else {
			change();
		}
	};

	const getFilteredPosts = (posts: Post[], currentFilter: string) => {
		if (currentFilter === "all") return posts;
		return posts.filter((post) => post.keywords.includes(currentFilter));
	};

	$: filteredPosts = getFilteredPosts(posts, currentFilter);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="mb-8 flex flex-wrap gap-2">
	{#each filters as filter}
		<div>
			<button
				class="button button-ghost uppercase"
				on:click={() => changeFilter(filter)}
			>
				{filter}
			</button>
			{#if filter === currentFilter}
				<!-- marker -->
				<div
					class="bg-foreground p-0.5"
					style="view-transition-name: currentFilter;"
				></div>
			{:else}
				<div class="p-0.5"></div>
			{/if}
		</div>
	{/each}
</section>

<section>
	{#if posts.length}
		<div class="mb-6">
			<!-- first post -->
			<PostCard post={filteredPosts[0]} headings size="lg" />
		</div>

		<div
			class="mb-6 grid gap-6"
			class:lg:grid-cols-2={filteredPosts.length > 2}
		>
			{#if posts.length > 1}
				<!-- second post -->
				<PostCard post={filteredPosts[1]} headings size="md" />
			{/if}
			<div class="grid gap-6 md:grid-cols-2">
				{#each filteredPosts as post, i}
					{#if i > 1 && i < 6}
						<!-- posts 3 through 6 -->
						<PostCard {post} />
					{/if}
				{/each}
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			{#each filteredPosts as post, i}
				{#if i > 5}
					<!-- the rest -->
					<PostCard {post} />
				{/if}
			{/each}
		</div>
	{:else}
		<p>
			No posts yet, add a markdown file to <code>src/content</code>
			with front-matter according to
			<code>src/lib/schemas</code>
		</p>
	{/if}
</section>
