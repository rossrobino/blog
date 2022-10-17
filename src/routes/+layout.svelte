<script>
	import "../app.css";

	function getCurrentDate() {
		const today = new Date();
		const dd = String(today.getDate()).padStart(2, "0");
		const mm = String(today.getMonth() + 1).padStart(2, "0");
		const yyyy = today.getFullYear();
		return yyyy + "-" + mm + "-" + dd;
	}
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
	<header>
		<h1 class="text-3xl md:text-4xl text-neutral-900 font-bold p-4">
			<a sveltekit:prefetch href="/">blog.robino.dev</a>
		</h1>
	</header>
	<main class="md:flex md:justify-center">
		<article class="text-left sm:max-w-screen-md px-4">
			<hr />
			<slot />
			<hr class="mt-3" />
		</article>
	</main>
	<footer class="flex justify-center py-2">
		<div class="grid grid-flow-col gap-3 w-full max-w-screen-md px-4">
			<div class="justify-self-start text-left">
				<p>
					Copyright © {getCurrentDate().split("-")[0]} -
					<a
						class="inline-block underline"
						href="https://robino.dev/"
						target="_blank"
						rel="noreferrer"
					>
						Ross Robino
					</a>
				</p>
			</div>
			<div class="justify-self-end">
				<a
					href="https://github.com/rossrobino/blog"
					target="_blank"
					rel="noreferrer"
				>
					<!-- GitHub Logo -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="32px"
						height="32px"
						class="fill-neutral-900"
					>
						<path
							d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</footer>
</div>
