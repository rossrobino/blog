<script lang="ts">
	import { dev } from "$app/environment";
	import { Breakpoint } from "drab";
</script>

{#if dev}
	<Breakpoint
		class="card fixed right-4 top-4 z-10 inline-block px-3 py-2 font-mono text-sm tabular-nums"
	/>
{/if}
