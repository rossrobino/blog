<script>
	export let post = {};
	export let size = "small";
</script>

<div class="p-3 bg-neutral-100 rounded-sm">
	<a
		class:text-3xl={size == "large"}
		class:text-2xl={size == "medium"}
		href={post.url}
		rel="prefetch"
	>
		{post.frontmatter.title}
	</a>
	<div
		class="my-1"
		class:text-xl={size == "large"}
		class:text-lg={size == "medium"}
	>
		{new Date(post.frontmatter.date).toLocaleDateString("en-us", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})}
	</div>
	<div class="italic">
		{post.frontmatter.description}
	</div>
	{#if size == "large" || size == "medium"}
		<div class="mt-2">
			{#each post.getHeadings() as heading}
				<div class="flex">
					<span class="text-neutral-300 mr-1">#</span>
					<a href={`${post.url}#${heading.slug}`}>
						{heading.text}
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
