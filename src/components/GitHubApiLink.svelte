<script>
	let input = "rossrobino";
</script>

<input type="text" placeholder="username" class="my-2" bind:value={input} />

<div>
	<a href="https://api.github.com/users/{input}">
		{`https://api.github.com/users/${input}`}
	</a>
</div>
<div>
	<a href="https://api.github.com/users/{input}/repos">
		{`https://api.github.com/users/${input}/repos`}
	</a>
</div>
<div>
	<a href="https://api.github.com/users/{input}/followers">
		{`https://api.github.com/users/${input}/followers`}
	</a>
</div>
