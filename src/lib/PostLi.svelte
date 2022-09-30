<script>
	export let urlEnd = "";
	export let text = "";
</script>

<li>
	<a sveltekit:prefetch href="/posts/{urlEnd}">
		{text}
	</a>
</li>
