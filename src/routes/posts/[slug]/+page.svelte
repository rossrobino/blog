<script lang="ts">
	import PostCard from "$lib/components/PostCard.svelte";
	import ShareButton from "$lib/components/ShareButton.svelte";
	import { repository } from "$lib/info/index.js";
	import { onMount } from "svelte";

	let { data } = $props();

	const { html, post } = data;
	const { title, description, keywords } = post;

	onMount(async () => {
		if (!customElements.get("drab-youtube")) {
			await import("drab/youtube/define");
		}

		// copy text code blocks
		const pres = document.querySelectorAll("pre");
		for (const pre of pres) {
			pre.tabIndex = 0;
			pre.role = "button";
			pre.ariaDescription = "Copy code to clipboard";

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

		// heading links
		const headings = document.querySelectorAll("h2");
		for (const heading of headings) {
			const anchor = document.createElement("a");
			anchor.classList.add("not-prose");
			anchor.href = `#${heading.id}`;
			anchor.textContent = heading.textContent;
			heading.replaceChildren(anchor);
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
	</div>
</article>
