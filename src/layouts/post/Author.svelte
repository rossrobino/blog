<script>
	export let author = ""
</script>

{#if (author == "Ross Robino")}
	<a href="https://robino.dev">{author}</a>
{:else}
	{author}
{/if}