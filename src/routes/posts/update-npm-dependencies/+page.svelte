<script>
	import Code from "$lib/Code.svelte";
	import PageHeader from "$lib/PageHeader.svelte";

	const title = "Interactively Update NPM Dependencies";
	const desc =
		"Keeping up with your project's dependencies can be difficult and time consuming. Here's the best way I've found to manage my npm dependencies.";
	const date = "9/12/22";
</script>

<svelte:head>
	<title>blog.robino.dev - {title}</title>
	<meta name="description" content={desc} />
</svelte:head>

<PageHeader {title} {date} />

<section>
	<h3>Update your dependencies with two commands</h3>
	<p>
		Keeping up with a project's dependencies can be difficult and time
		consuming. After trying a variety of methods, here's the best way I've
		found to manage npm dependencies.
	</p>
</section>

<section>
	<h3>
		Install <a href="https://www.npmjs.com/package/npm-check-updates"
			>npm-check-updates</a
		> globally
	</h3>
	<p>Run this command to install the npm-check-updates package:</p>
	<Code>npm install -g npm-check-updates</Code>
	<p>
		This allows the use of ncu regardless of whether it's installed in the
		project directly.
	</p>

	<h3>Update project</h3>
	<p>
		Run this command from the workspace folder to start the interactive
		process:
	</p>
	<Code>ncu --interactive --format group</Code>

	<h3>Process</h3>
	<ul>
		<li>update all patch/minor updates, test</li>
		<li>update each major update independently, test</li>
	</ul>
</section>

<section>
	<h3>References</h3>
	<ul>
		<li>
			<a href="https://syntax.fm/show/425/updating-project-dependencies"
				>Syntax Podcast #425 - Wes Bos and Scott Tolinski</a
			>
		</li>
		<li>
			<a
				href="https://www.freecodecamp.org/news/how-to-update-npm-dependencies/"
				>How to Update NPM Dependencies by Natalie Pina</a
			>
		</li>
	</ul>
</section>
