---
title: Document Svelte Projects with HTML and JSDoc Comments
description: Use documentation comments to thoroughly document your Svelte code.
keywords: svelte, documentation, JSDoc, TSDoc, comments
date: 2023, 08, 03
---

<drab-youtube aria-label="YouTube Tutorial" uid="IWvvXn1eAbE">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

## Benefits

Documenting code with [JSDoc](https://jsdoc.app/) comments not only simplifies the lives of maintainers and consumers, but it also offers several advantageous alternatives to regular comments. JSDoc comments enable hints to appear in convenient locations, making code documentation even more valuable. In this article, we will explore a few effective methods to document Svelte code using HTML and JSDoc comments.

## Components

Entire Svelte components can be documented with HTML comments that include `@component`.

[Svelte FAQ](https://svelte.dev/docs/faq#how-do-i-document-my-components)

````svelte
<!--
@component

- A component that repeats text a specific number of times.

@example

```svelte
<Repeat text="Repeat this" numberOfTimes={3} />
```
-->
````

You can utilize markdown syntax in this comment to write documentation. It will appear when the user hovers over the name of the component in most editors like VSCode.

## Props

[JSDoc isn't just for the no build step crowd](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns), TypeScript developers can also take advantage of it to document their work. Add a JSDoc comment (`/** comment */`) above any variable or type definition to document it with markdown syntax. When props are documented, you can hover over each prop when utilizing the component to read the documentation.

````svelte
<!--
@component

- A component that repeats text a specific number of times.

@example

```svelte
<Repeat text="Repeat this" numberOfTimes={3} />
```
-->

<script lang="ts">
	let {
		text,
		numberOfTimes,
	}: {
		/** text to repeat */
		text: string;

		/** number of times to repeat */
		numberOfTimes: number;
	} = $props();
</script>

{#each Array(numberOfTimes) as _}
	<div>{text}</div>
{/each}
````

## Variables and Functions

Finally, variables and functions can also be thoroughly documented. This enables developers to clearly understand the purpose and expected outcome of each function. Furthermore, markdown code blocks can be utilized to include examples. For the full list of options, check out the [JSDoc Documentation](https://jsdoc.app/).

````ts
/**
 * A function that adds two numbers.
 *
 * @param x the first number
 * @param y the second number
 * @returns the sum of the two numbers
 *
 * @example
 * ```ts
 * const result = addTwo(1, 2);
 * ```
 */
function addTwo(x: number, y: number) {
	return x + y;
}
````
