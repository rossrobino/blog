<script>
	export let text = "Check out this post:";
	export let domain = "https://blog.robino.dev";
	export let path = "";
	export let title = path.split("/").splice(-1); // default to end of path

	let url = domain + path;

	let complete = false;

	async function handleClick() {
		try {
			if (navigator.canShare) {
				await navigator.share({ title, text, url });
			} else {
				await navigator.clipboard.writeText(url);
				complete = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button
	on:click={handleClick}
	class="bg-emerald-800 text-neutral-50 p-3 my-4 w-32 rounded-sm"
>
	{#if complete}
		Copied!
	{:else}
		Share
	{/if}
</button>
