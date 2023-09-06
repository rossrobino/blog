<script lang="ts">
	import PostCard from "$lib/components/PostCard.svelte";
	import { repository, url } from "$lib/info/index.js";
	import { ShareButton } from "drab";

	export let data;
	const { html, post } = data;
	const { title, description, keywords } = post;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(", ")} />
</svelte:head>

<article class="my-16 max-w-[85ch]">
	<PostCard {post} headings link={false} />

	{@html html}

	<hr />

	<div class="flex gap-4">
		<a
			class="button !button-primary !no-underline"
			href="{repository}/blob/main/src/content/{post.slug}.md"
		>
			Edit
		</a>
		<ShareButton
			class="button button-secondary"
			shareData={{ url: `${url}/posts/${post.slug}` }}
		/>
	</div>
</article>
