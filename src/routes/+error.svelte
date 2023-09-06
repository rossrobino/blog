<script lang="ts">
	import { page } from "$app/stores";
</script>

<h1>Error</h1>

<h2>Status: {$page.status}</h2>

<pre>{$page?.error?.message}</pre>
