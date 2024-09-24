<script lang="ts">
	import { onMount } from "svelte";
	import { url } from "$lib/info";

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
