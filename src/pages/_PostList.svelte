<script>
	import PostCard from "./_PostCard.svelte";

	export let posts = [];
	posts.sort(
		(a, b) =>
			Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date)
	);
</script>

<section>
	<PostCard post={posts[0]} size="large" />
</section>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
	<section>
		<PostCard post={posts[1]} size="medium" />
	</section>
	<section class="grid grid-cols-1 md:grid-cols-2 auto-rows-min gap-4">
		{#each posts as post, i}
			{#if i != 0 && i != 1 && i < 6}
				<PostCard {post} />
			{/if}
		{/each}
	</section>
</div>
<section class="grid grid-cols-1 md:grid-cols-3 auto-rows-min gap-4">
	{#each posts as post, i}
		{#if i >= 6}
			<PostCard {post} />
		{/if}
	{/each}
</section>
