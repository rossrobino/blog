---
title: Create a Headings Component for an Astro Project with Svelte
description: Display headings for each markdown post as links.
keywords: blog, svelte, astro, headings, components
date: 2022, 12, 22
---

## Markdown headings

Heading tags are the standard way to structure markdown content. [Astro](https://docs.astro.build/en/getting-started/) makes it simple to to parse markdown out of the box, and handles mdx content with a first party [mdx integration](https://docs.astro.build/en/guides/integrations-guide/mdx/).

I enjoy using [Svelte](https://svelte.dev/) to create my components, Astro provides another first party [Svelte integration](https://docs.astro.build/en/guides/integrations-guide/svelte/) to work with Svelte.

Here's how I created a component to parse all of the headings from a file or a list of headings and display them as links (see above).

## Headings component

First, we will create a `Headings.svelte` component. We will want to use this in two different places, so we will build it with that flexibility in mind. We can pass in either an imported `file`, or just the `headings` from the file in a layout.

Each `.md` or `.mdx` file can be imported with a built in Astro method which we will implement in the [next section](#import-in-other-pages). Imported files contain a [variety of data points](https://docs.astro.build/en/reference/api-reference/#markdown-files), we can utilize these two:

- `url` contains the path to file
- `headings` contains a list of heading objects

Each [heading object](https://docs.astro.build/en/core-concepts/layouts/#markdown-layout-props) contained in `headings` has the following keys among others that we can reference:

- `depth` displays the level of the heading, `<h2>` would have a depth of 2
- `slug` contains the [automatically generated id](https://docs.astro.build/en/guides/markdown-content/#heading-ids) which we will utilize in our link

```svelte
<!-- Headings.svelte -->

<script>
	// props - accepts entire file or just the headings
	let { headings = [], file = {} } = $props();

	// check if the file has any keys
	const isFile = Boolean(Object.keys(file).length);

	// if the file has keys, use the headings from the file instead
	// of the headings prop
	if (isFile) headings = file.getHeadings();
</script>

<!-- iterate through each heading -->
{#each headings as heading}
	<div>
		<!-- 
			prefix each heading with a # and indent accordingly 
			with css classes depending on the heading.depth
		-->
		<span
			class:ml-3={heading.depth == 3}
			class:ml-6={heading.depth == 4}
			class:ml-9={heading.depth == 5}
			class:ml-12={heading.depth == 6}
		>
			#
		</span>
		<!-- 
			Check if we are passing in a file or the headings:

			If we are passing in a file, this means we are referencing the
			files from another page, so we will link to the full path.

			If we are passing in just the headings, we can link to the 
			#id so the link will jump to the right spot on the page.
		-->
		<a href={isFile ? `${file.url}#${heading.slug}` : `#${heading.slug}`}>
			{heading.text}
		</a>
	</div>
{/each}

<style>
	div {
		display: flex;
		margin-bottom: 0.5rem;
	}
	span {
		margin-left: 0.25rem;
	}
	.ml-3 {
		margin-left: 0.75rem;
	}
	.ml-6 {
		margin-left: 1.5rem;
	}
	.ml-9 {
		margin-left: 2.25rem;
	}
	.ml-12 {
		margin-left: 3rem;
	}
</style>
```

## Try it out

We can now use this in our markdown layouts by providing `headings`, or in another page by passing in the entire file through the `file` prop.

### Markdown layout

Here, we can create a layout for posts to display the `headings` from our markdown file.

```astro
---
// @layouts/post/Post.astro

import Headings from "@components/Headings.svelte";

const { headings } = Astro.props;
---

<Headings headings={headings} />

<hr />

<slot />
```

Utilize this layout in our markdown file in `src/pages/posts/`:

```mdx
---
layout: "@layouts/post/Post.astro"
---

# Heading 1

## Heading 2

### Heading 3
```

### Import in other pages

You may want to display your headings as a preview outside of the page itself ([example](https://blog.robino.dev)).

We can import our files from `src/pages/posts` into the page we want to display them using Astro's [glob](https://docs.astro.build/en/reference/api-reference/#astroglob) method. Then we can pass a post into the `Headings` component to display the headings from that post.

```astro
---
// src/pages/index.astro

import Headings from "@components/Headings.svelte";

const posts = await Astro.glob("./posts/*");
---

<!-- pass the first post into the component -->
<Headings file={post[0]} />
```

## Performance

Because Astro runs at build time, this `Headings` component will be sent to the client as HTML and CSS with no JavaScript.

I've really enjoyed using Astro to create this blog. The first party `.mdx` integration and `Astro.glob` make it easy to maintain my content. I'd recommend it to others creating static sites and wanting to author their pages in markdown.

Thanks for reading!
