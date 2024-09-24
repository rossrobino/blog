<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="prose">
	<h1>Error</h1>

	<h2>Status: {$page.status}</h2>

	<pre><code>{#each $page?.error?.message.split("\n") ?? [] as line}<span
					class="line">{line}</span>{/each}</code></pre>
</div>
