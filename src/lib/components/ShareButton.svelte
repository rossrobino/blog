<script lang="ts">
	import { url } from "$lib/info";
	import { onMount } from "svelte";

	let { slug }: { slug: string } = $props();

	onMount(async () => {
		if (!customElements.get("drab-share")) {
			await import("drab/share/define");
		}
	});
</script>

<drab-share value="{url}/posts/{slug}">
	<button data-trigger type="button" class="secondary gap-1.5">
		<span data-content>Share</span>
		<template data-swap>Copied</template>
	</button>
</drab-share>
