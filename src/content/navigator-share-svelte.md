---
title: Use the Navigator API to Create a Share/Copy Component with Svelte
description: Easily create a share/copy component with no added dependencies.
keywords: svelte, components, share, copy, api, navigator
date: 2022, 10, 15
---

![YouTube Tutorial](yt:INXigHmjp3U)

## Let users easily share your website

The [navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) provides two methods to make it easier to share a website depending on the user's browser/OS. The API allows enables you to quickly identify the support and utilize the best method for the user's system.

## Share method

To set up the share button, the `.share` method takes an object as an argument where we can specify the `url` and `title` of the `ShareData`. We can set these up as props to be able to assign them when we create the component.

```svelte
<!-- ShareButton.svelte -->

<script lang="ts">
	let {
		url,
		title = url.split("/").at(-1),
	}: {
		/** URL to share. */
		url: string;

		/** Share message title. */
		title?: string;
	} = $props();

	async function share() {
		const shareData: ShareData = { url, title };
		await navigator.share(shareData);
	}
</script>

<button onclick={share}>Share</button>
```

## Copy method

Some systems do not support the `.share` method, you'll see `navigator.share is not a function` in these browsers. We can check the support by checking if the `navigator.canShare` method exists and passing in the `ShareData` to ensure the browser supports sharing the specific data want to share.

If it's not supported, we can use the `.clipboard.writeText` method to copy the link instead. This method takes a string as a parameter, where we can pass in the `url`. Since the share menu will not be presented to the user, we can update `complete` to confirm the copy was successful and then reset after half a second.

```svelte
<!-- ShareButton.svelte -->

<script lang="ts">
	let {
		url,
		title = url.split("/").at(-1),
	}: {
		/** URL to share. */
		url: string;

		/** Share message title. */
		title?: string;
	} = $props();

	let complete = $state(false);

	async function share() {
		const shareData: ShareData = { url, title };

		if (navigator.canShare && navigator.canShare(shareData)) {
			await navigator.share(shareData);
		} else {
			await navigator.clipboard.writeText(url);
			complete = true;
			setTimeout(() => {
				complete = false;
			}, 500);
		}
	}
</script>

<button onclick={share}>
	{#if complete}
		Copied!
	{:else}
		Share
	{/if}
</button>
```

## Try it out

Test it in some different environments to see the API in action. On mac, you can test the difference using Chrome/Safari.

```svelte
<!-- +page.svelte -->

<script>
	import ShareButton from "$lib/ShareButton.svelte";
</script>

<ShareButton url="https://blog.robino.dev/posts/navigator-share-svelte" />
```

Feel free to copy the code into your project, or you can utilize the web component version I have made with this [package](https://github.com/rossrobino/drab).

## References

- [Syntax Podcast #522 - Wes Bos and Scott Tolinski](https://syntax.fm/show/522/use-the-platform)
- [MDN Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
