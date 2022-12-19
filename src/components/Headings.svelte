<script>
	export let headings = [];
	export let post = {};
	let isPost = Boolean(Object.keys(post).length);

	if (isPost) {
		headings = post.getHeadings();
	}

	function depth(heading) {
		if (heading.depth == 2) {
			return "ml-0";
		} else if (heading.depth == 3) {
			return "ml-3";
		} else if (heading.depth == 4) {
			return "ml-6";
		} else if (heading.depth == 5) {
			return "ml-9";
		} else if (heading.depth == 6) {
			return "ml-12";
		} else {
			return "ml-0";
		}
	}
</script>

{#each headings as heading}
	<div class="flex">
		<span class="text-neutral-300 mr-1 {depth(heading)}">#</span>
		<a class="font-normal" href={isPost ? `${post.url}#${heading.slug}` : `#${heading.slug}`}>
			{heading.text}
		</a>
	</div>
{/each}
