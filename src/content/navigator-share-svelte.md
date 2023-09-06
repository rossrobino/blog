---
title: Use the Navigator API to Create a Share/Copy Component with Svelte
description: Easily create a share/copy component with no added dependencies.
keywords: svelte, components, share, copy, api, navigator
date: 2022, 10, 15
---

## Let users easily share your website

The [navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) provides two methods to make it easier to share a website depending on the user's browser/OS. The API allows enables you to quickly identify the support and utilize the best method for the user's system.

## Share method

To set up the share button, the `.share` method takes an object as an argument with three keys: `text`, `url`, and `title`. We can set these up as props to be able to assign them when we create the component.

```svelte
<!-- ShareButton.svelte -->

<script>
	export let text = "Check out this page!";
	export let url = "https://blog.robino.dev";
	export let title = url.split("/").splice(-1)[0]; // default to end of url

	async function handleClick() {
		try {
			await navigator.share({ text, url, title });
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button on:click={handleClick}>
	<slot>Share</slot>
</button>
```

## Copy method

Some systems do not support the `.share` method, we can check the support by checking if the `navigator.canShare` method exists. If it's not supported, we can use the `.clipboard.writeText` method to copy the link instead. This method takes a string as a parameter, where we can pass in the `url`. Since the share menu will not be presented to the user, we can update `complete` to confirm the copy was successful.

```svelte
<!-- ShareButton.svelte -->

<script>
	export let text = "Check out this page!";
	export let url = "https://blog.robino.dev";
	export let title = url.split("/").splice(-1)[0]; // default to end of url

	let complete = false;

	async function handleClick() {
		try {
			if (navigator.canShare) {
				await navigator.share({ text, url, title });
			} else {
				await navigator.clipboard.writeText(url);
				complete = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button on:click={handleClick}>
	{#if complete}
		<slot name="complete">Copied!</slot>
	{:else}
		<slot>Share</slot>
	{/if}
</button>
```

## Try it out

Test it in some different environments to see the API in action. On mac, you can test the difference using Chrome/Safari.

```svelte
<!-- +page.svelte -->

<script>
	import ShareButton from "$lib/components/ShareButton.svelte";
</script>

<ShareButton
	url="https://blog.robino.dev/posts/navigator-share-svelte"
	text="Check out this blog post!"
/>
```

Feel free to copy the code into your project, or you can utlize the most recent version my component with this [package](https://github.com/rossrobino/drab). It is enhanced to share and download files depending on browser support.

## References

- [Check out the REPL](https://svelte.dev/repl/ef8dd271735d440cb6c65936ccecfa9d?version=3.51.0)
- [Syntax Podcast #522 - Wes Bos and Scott Tolinski](https://syntax.fm/show/522/use-the-platform)
- [MDN Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
