<script lang="ts">
	import type { ZodIssue } from "zod";
	
	export let issues: ZodIssue[];
</script>

<div
	class="flex gap-2 rounded-3xl bg-rose-700 px-4 py-2 font-semibold text-stone-100 shadow"
>
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
