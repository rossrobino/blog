<script lang="ts">
	import type { Post } from "$lib/types";

	export let post: Post;
</script>

<ul class="my-2">
	{#each post.headings as heading}
		<!-- since the frontmatter title is h1, display the h2's -->
		{#if heading.level === 2}
			<li><a href="/posts/{post.slug}#{heading.id}">{heading.name}</a></li>
		{/if}
	{/each}
</ul>
