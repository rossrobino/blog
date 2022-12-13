<script>
	import Code from "$lib/Code.svelte";
	import PageHeader from "$lib/PageHeader.svelte";
	import ShareButton from "./ShareButton.svelte";

	const title =
		"Use the Navigator API to Create a Share/Copy Component with Svelte";
	const desc = "Easily create a zero dependency share/copy component.";
	const date = "10/15/22";

	const data = {
		title,
		date,
		desc,
	};
</script>

<PageHeader {data} />

<section>
	<h3>
		Let users easily share your website according to their browser's support
	</h3>
	<p>
		I was working on a <a href="https://splits.best">project</a>
		recently in which I wanted users to be able to invite their friends to join
		a team that they create by sharing the page with them. The
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share"
		>
			navigator API
		</a>
		provides two methods to make it easier to share a website depending on the
		user's browser/OS. The API allows enables you to quickly identify the support
		and utilize the best method for the user's system.
	</p>
</section>

<section>
	<h3>Share</h3>
	<p>
		To set up the share button, the <strong>.share</strong>
		method takes an object as an argument with three keys:
		<strong>title, text, and url.</strong>
		We can set these up as props to be able to assign them when we create the
		component.
	</p>
	<Code>
		{`<!-- ShareButton.svelte -->

<script>
	// sveltekit: import { page } from "$app/stores";

	export let text = "Check out this page!";
	export let domain = "https://blog.robino.dev";
	export let path = "/posts/navigator-share-svelte"; // sveltekit: $page.url.pathname;
	export let title = path.split("/").splice(-1); // default to end of path

	let url = domain + path;
	
	async function handleClick() {
		try {
			await navigator.share({ title, text, url });
		} catch (error) {
			console.log(error);
		}
	}
</script>

<button on:click={handleClick}>Share</button>
`}
	</Code>
</section>

<section>
	<h3>Copy</h3>
	<p>
		Some systems do not support the <strong>.share</strong>
		method, we can check the support with the
		<strong>.canShare</strong>
		method. In these cases, we can use the
		<strong>.clipboard.writeText</strong>
		method to copy the link instead. This method takes a string as a parameter,
		where we can pass in the
		<strong>url.</strong>
		Since the share menu will not be presented to the user, we can update
		<strong>complete</strong>
		to confirm the copy was successful.
	</p>
	<Code>
		{`<!-- ShareButton.svelte -->

<script>
	// sveltekit: import { page } from "$app/stores";

	export let text = "Check out this page!";
	export let domain = "https://blog.robino.dev";
	export let path = "/posts/navigator-share-svelte"; // sveltekit: $page.url.pathname;
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

<button on:click={handleClick}>
	{#if complete}
		Copied!
	{:else}
		Share
	{/if}
</button>`}
	</Code>
</section>

<section>
	<h3>Try it out</h3>
	<p>
		Test it in some different environments to see the API in action. On mac,
		you can test the difference using Chrome/Safari.
	</p>
	<ShareButton />
</section>

<section>
	<h3>References</h3>
	<ul>
		<li>
			<a
				href="https://svelte.dev/repl/ef8dd271735d440cb6c65936ccecfa9d?version=3.51.0"
			>
				Check out the REPL
			</a>
		</li>
		<li>
			<a href="https://syntax.fm/show/522/use-the-platform">
				Syntax Podcast #522 - Wes Bos and Scott Tolinski
			</a>
		</li>
		<li>
			<a
				href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share"
			>
				MDN Navigator API
			</a>
		</li>
	</ul>
</section>
