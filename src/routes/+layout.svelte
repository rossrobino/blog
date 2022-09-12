<script>
	import "../app.css";
</script>

<div
	class="
		flex 
		flex-col 
		justify-between 
		min-h-screen 
		text-center 
		font-serif 
		bg-neutral-50
		selection:bg-emerald-300
		vp-dyn
		"
>
	<div>
		<header>
			<h1 class="text-3xl sm:text-4xl text-neutral-900 font-bold p-4">
				<a sveltekit:prefetch href="/">blog.robino.dev</a>
			</h1>
		</header>
		<main class="sm:flex sm:justify-center">
			<article class="text-left sm:max-w-screen-md px-6">
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
