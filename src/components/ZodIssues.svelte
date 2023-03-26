<script lang="ts">
	import type { ZodIssue } from "zod";

	export let issues: ZodIssue[];
</script>

<div class="rounded-sm bg-rose-700 p-2 font-semibold text-neutral-100">
	<ul>
		{#each issues as { message, path }}
			<li>
				{String(path[0]).charAt(0).toUpperCase() +
					String(path[0]).slice(1)} -
				{message}
			</li>
		{/each}
	</ul>
</div>
