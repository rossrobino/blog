<script>
	export let src = "";
	export let alt = "";
	export let title = "";
	export let caption = "";
</script>

<figure
	class="my-6 mx-auto w-full md:w-3/4 bg-neutral-800 p-2 rounded-md shadow-md"
>
	{#if title}
		<figcaption class="text-center mb-2 text-neutral-50 text-md underline">
			{title}
		</figcaption>
	{/if}
	<img class="mx-auto rounded-md" {src} {alt} />
	{#if caption}
		<figcaption class="mx-2 mt-2 text-neutral-50 text-sm">
			<i>{caption}</i>
		</figcaption>
	{/if}
</figure>
