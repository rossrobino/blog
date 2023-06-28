<script>
	import Headings from "@components/Headings.svelte";

	export let post = {};
	export let size = "small";
</script>

<div class="h-full rounded-sm bg-neutral-100 p-3">
	<a
		class:text-3xl={size == "large"}
		class:text-2xl={size == "medium"}
		href={post.url}
		rel="prefetch"
	>
		{post.frontmatter.title}
	</a>
	<div class="my-1">
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
			<Headings maxDepth="2" {post} />
		</div>
	{/if}
</div>
