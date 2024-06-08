<script lang="ts">
	import PostCard from "$lib/components/PostCard.svelte";
	import RSS from "$lib/components/RSS.svelte";
	import ShareButton from "$lib/components/ShareButton.svelte";
	import { repository } from "$lib/info/index.js";

	let { data } = $props();

	const { html, post } = data;
	const { title, description, keywords } = post;

	import { onMount } from "svelte";
	onMount(async () => {
		if (!customElements.get("drab-youtube")) {
			await import("drab/youtube/define");
		}

		// copy text code blocks
		const pres = document.querySelectorAll("pre");
		for (const pre of pres) {
			pre.tabIndex = 0;
			pre.setAttribute("role", "button");
			pre.setAttribute("aria-description", "Copy code to clipboard");

			const copyText = () => {
				navigator.clipboard.writeText(pre.textContent ?? "");
			};

			pre.addEventListener("click", copyText);
			pre.addEventListener("keydown", (e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					copyText();
				}
			});
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(", ")} />
</svelte:head>

<article class="my-16 max-w-[90ch]">
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
		<ShareButton slug={post.slug} />
		<RSS />
	</div>
</article>
