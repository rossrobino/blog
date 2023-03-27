<script>
	import PostCard from "./_PostCard.svelte";

	export let posts = [];
	posts.sort(
		(a, b) => Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date),
	);
</script>

<section>
	<PostCard post={posts[0]} size="large" />
</section>
<div class="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
	<section>
		<PostCard post={posts[1]} size="medium" />
	</section>
	<section class="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2">
		{#each posts as post, i}
			{#if i != 0 && i != 1 && i < 6}
				<PostCard {post} />
			{/if}
		{/each}
	</section>
</div>
<section class="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-3">
	{#each posts as post, i}
		{#if i >= 6}
			<PostCard {post} />
		{/if}
	{/each}
</section>
