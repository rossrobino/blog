<script>
	export let data = {};
</script>

<svelte:head>
	<title>blog.robino.dev - {data.title}</title>
	<meta name="description" content={data.desc} />
</svelte:head>

<h2>{data.title}</h2>
<p><a href="https://robino.dev/">Ross Robino</a></p>
<p>{data.date}</p>
