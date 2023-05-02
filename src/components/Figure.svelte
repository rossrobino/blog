<script lang="ts">
	export let src = "";
	export let alt = "";
	export let title = "";
	export let caption = "";
</script>

<figure class="mx-auto my-6 w-fit rounded-sm bg-neutral-900 p-2">
	{#if title}
		<figcaption class="text-md mb-2 text-center text-neutral-50">
			{title}
		</figcaption>
	{/if}
	<img class="mx-auto rounded-sm" {src} {alt} />
	{#if caption}
		<figcaption class="mx-2 mt-2 text-sm text-neutral-50">
			<i>{caption}</i>
		</figcaption>
	{/if}
</figure>
