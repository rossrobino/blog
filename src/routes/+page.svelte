<script>
	import PostLi from "$lib/PostLi.svelte";
</script>

<svelte:head>
	<title>blog.robino.dev</title>
	<meta name="description" content="Ross Robino's Blog" />
</svelte:head>

<h3>
	Hello, I'm <a href="https://robino.dev">Ross</a>. I created this blog
	as a place to write and record topics I am learning. Check out my
	posts below.
</h3>

<ul>
	<PostLi
		urlEnd="navigator-share-svelte"
		text="Use the Navigator API to Create a Share/Copy Component with SvelteKit"
	/>
	<PostLi urlEnd="why-you-should-own-etfs" text="Why You Should Own ETFs" />
	<PostLi
		urlEnd="update-npm-dependencies"
		text="Interactively Update NPM Dependencies"
	/>
	<PostLi
		urlEnd="svelte-web-future"
		text="How Svelte is Changing the Future of the Web"
	/>
</ul>
