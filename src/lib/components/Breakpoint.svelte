<script lang="ts">
	import { dev } from "$app/environment";
	import { onMount } from "svelte";

	if (dev) {
		onMount(async () => {
			if (!customElements.get("drab-breakpoint")) {
				await import("drab/breakpoint/define");
			}
		});
	}
</script>

{#if dev}
	<drab-breakpoint aria-hidden="true">
		<div
			data-content
			class="fixed right-4 top-4 z-10 inline-block rounded px-3 py-2 font-mono text-sm shadow"
		></div>
	</drab-breakpoint>
{/if}
