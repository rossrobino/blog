<script>
	export let headings = [];
</script>

{#each headings as heading}
	<div class="flex">
		<span class="text-neutral-300 mr-1">#</span>
		<a href={`#${heading.slug}`}>
			{heading.text}
		</a>
	</div>
{/each}
