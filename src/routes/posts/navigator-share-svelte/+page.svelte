<script>
	import Code from "$lib/Code.svelte";
	import PageHeader from "$lib/PageHeader.svelte";

	const title =
		"Use the Navigator API to Create a Share/Copy Component with SvelteKit";
	const desc = "";
	const date = "10/15/22";
</script>

<svelte:head>
	<title>blog.robino.dev - {title}</title>
	<meta name="description" content={desc} />
</svelte:head>

<PageHeader {title} {date} />

<section>
	<h3>
		Let users easily share your website according to their browser's support
	</h3>
	<p>
		I was working on a <a href="https://splits.best">new project</a>
		recently and I wanted users to be able to invite their friends to join a
		team that they create. The
		<a
			href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share"
		>
			navigator API
		</a>
		provides two methods to make it a bit easier to share a website depending
		on the user's browser/OS. With the API, you can quickly identify the support
		and display the correct component to the user.
	</p>
</section>

<section>
	<h3>Share Component</h3>
	<p></p>
</section>

<section>
	<h3>Copy Component</h3>
	<p></p>
</section>

<section>
	<h3>Use navigator.canShare to display the correct component</h3>
</section>

<section>
	<h3>References</h3>
	<ul>
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
