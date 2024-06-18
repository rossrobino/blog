<script lang="ts">
	import { description, title } from "$lib/info/index.js";
	import PostCard from "$lib/components/PostCard.svelte";
	import type { Post } from "$lib/types/index.js";
	import { page } from "$app/stores";

	let { data } = $props();

	let { posts, filters } = data;

	const currentFilter = $derived($page.url.searchParams.get("filter") ?? "all");

	const getFilteredPosts = (posts: Post[], currentFilter: string) => {
		if (currentFilter === "all") return posts;
		return posts.filter((post) => post.keywords.includes(currentFilter));
	};

	const filteredPosts = $derived.by(() =>
		getFilteredPosts(posts, currentFilter),
	);
</script>

<svelte:head>
	<title>
		{title}{currentFilter === "all" ? "" : ` - ${currentFilter.toUpperCase()}`}
	</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="flex justify-between gap-4">
	<div class="mb-8 flex flex-wrap gap-2" aria-label="Filter posts by keywords">
		<div aria-live="polite" class="sr-only">
			Filtered to {currentFilter} posts.
		</div>
		{#each filters as filter}
			<div>
				<a
					href="/{filter === 'all' ? '' : `?filter=${filter}`}"
					class="not-prose button button-ghost uppercase"
					aria-current={filter === currentFilter ? "page" : false}
				>
					{filter}
				</a>
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
	</div>
</section>

<section aria-label="Post list">
	{#if filteredPosts[0]}
		<div class="mb-6">
			<!-- first post -->
			<PostCard post={filteredPosts[0]} headings size="lg" />
		</div>

		<div
			class="mb-6 grid gap-6"
			class:lg:grid-cols-2={filteredPosts.length > 2}
		>
			<div class="grid gap-6">
				{#if filteredPosts[1]}
					<!-- second post -->
					<PostCard post={filteredPosts[1]} headings size="md" />
				{/if}
				{#if filteredPosts[2]}
					<!-- third post -->
					<PostCard post={filteredPosts[2]} headings size="md" />
				{/if}
			</div>
			<div class="grid gap-6 md:grid-cols-2">
				{#each filteredPosts as post, i}
					{#if i > 2 && i < 7}
						<!-- posts 4 through 7 -->
						<PostCard {post} />
					{/if}
				{/each}
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			{#each filteredPosts as post, i}
				{#if i > 6}
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
