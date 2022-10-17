<script>
	import "../app.css";
</script>

<svelte:head>
	<!-- Google tag (gtag.js) -->
	<script
		async
		src="https://www.googletagmanager.com/gtag/js?id=G-LSTLRM2XQG"
	></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag("js", new Date());
		gtag("config", "G-LSTLRM2XQG");
	</script>
</svelte:head>

<div
	class="
		flex 
		flex-col 
		justify-between 
		min-h-screen 
		text-center 
		font-serif 
		bg-neutral-50
		selection:bg-yellow-300
		selection:text-neutral-800
		vp-dyn
		"
>
	<div>
		<header>
			<h1 class="text-3xl md:text-4xl text-neutral-900 font-bold p-4">
				<a sveltekit:prefetch href="/">blog.robino.dev</a>
			</h1>
		</header>
		<main class="md:flex md:justify-center">
			<article class="text-left sm:max-w-screen-md px-5">
				<hr />
				<slot />
				<hr class="mt-3" />
			</article>
		</main>
	</div>
	<footer class="text-xl sm:text-2xl p-4">
		<a href="https://github.com/rossrobino/blog">View project on GitHub</a>
	</footer>
</div>
