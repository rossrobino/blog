---
title: A Case for CSS Components
description: Reasons to use CSS stylesheets instead of JavaScript UI frameworks to author primitive components.
keywords: css, javascript, components
date: 2023, 08, 21
---

## JavaScript frameworks

JavaScript UI frameworks offer invaluable solutions for front-end developers, with one of their most significant advantages being the streamlined approach to component-based development. By leveraging components, developers are empowered to write less code while ensuring consistent reusability across their entire application.

While UI frameworks greatly enhance the process of authoring JavaScript components, it's important to resist the temptation to rely on them as a universal problem-solving tool. Not all components require JavaScript, such as a generic button, label, or card. In this article, I'll outline the case to author these components in a CSS stylesheet instead of creating a new framework component containing just styles and an HTML element.

---

## Creating a button

Consider buttons, as they are responsible for a range of actions based on the context. Although each button serves a distinct purpose, it's nice to maintain a consistent appearance across all of them.

Here are a few purposes of buttons in an application:

- Forms: `type="submit"` (default) or `type="reset"` to submit or reset a form
- Interactivity: `type="button"` for example, copying text from a code block
- Links: sometimes you need a link to look like a button

Each button needs to be styled consistently with a few different variations such as `primary` and `secondary`. You could create this component with a UI framework using props.

Here's how you might approach this using Svelte to build an all-purpose component for each of these use cases.

```svelte
<script lang="ts">
	let {
		variant = "primary",
		type = "submit",
		href = "",
		onclick = () => {},
	}: {
		variant?: "primary" | "secondary";
		type?: "submit" | "reset" | "button";
		href?: string;
		onclick?: () => {};
	} = $props();
</script>

{#if href}
	<a
		{href}
		class:primary={variant === "primary"}
		class:secondary={variant === "secondary"}
	>
		<slot />
	</a>
{:else}
	<button
		{type}
		onclick
		class:primary={variant === "primary"}
		class:secondary={variant === "secondary"}
	>
		<slot />
	</button>
{/if}

<style>
	a,
	button {
		border-radius: 5px;
	}
	.primary {
		background-color: blue;
	}
	.secondary {
		background-color: red;
	}
</style>
```

There are a few drawbacks of this implementation:

- We now have two different elements to account for that have different attributes and events. `href` only applies when the component is an `anchor`, while `type` only applies if it is a `button`.
- The variant classes have to be applied to both elements, or we must abstract and wrap them in a `div`.

Alternatively, we could create two different components, `Button` and `LinkButton` and style them accordingly. In this case, we need to ensure the CSS in each file stay in sync.

Or we may be tempted to use something like SvelteKit's `goto`, to accomplish navigations with JavaScript. Then we only have to use the `button` element and not have to deal with the `anchor` element. This works, but this is also where we add another dependency on the framework instead of using the platform's built in element designed for navigation. We also can't account for cases like these:

- What if JavaScript hasn't loaded yet, or never does?
- What if I want this code to work outside of SvelteKit in a framework like Astro?
- What if I move this project from SvelteKit to X in 5 years?
- What if a developer comes into this codebase and isn't familiar with SvelteKit?

With each tradeoff like this that takes place, the solution relies more heavily on JavaScript, and more niche knowledge of the particular framework.

---

## Start with CSS

Instead of trying to author the component in accordance with the JavaScript framework, the first step when building a component should be to see if we can just use CSS instead.

```css
.btn {
	border-radius: 5px;
}
.btn-p {
	background-color: blue;
}
.btn-s {
	background-color: red;
}
```

```html
<button class="btn btn-p" type="button">Open Modal</button>
<a class="btn btn-s" href="#main">Skip to Content</a>
```

Starting with CSS encourages developers to build more robust solutions that rely less on any particular JavaScript dependency, this implementation has a few advantages.

- Works with or without a framework
- The link functions without JavaScript
- Code is understandable to a broader range of developers
- The stylesheet can be shared across projects regardless of the framework or tooling utilized (check out [daisyUI](https://daisyui.com/) which works on every framework)

---

## Layers

To stay organized, use [layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) to separate **components** from **base** styles and **utilities**.

```css
@layer base {
	html {
		scroll-behavior: smooth;
	}
}

@layer components {
	.btn {
		border-radius: 5px;
		background-color: blue;
	}
	.btn-s {
		background-color: red;
	}
}

@layer utilities {
	.flex {
		display: flex;
	}
}
```

---

## Conclusion

Consider using CSS stylesheets to create primitive style components rather than a JavaScript framework when it makes sense. If a component can be built by styling a single HTML element, that may be a good use case for a CSS class instead. For more complex components, or components that are made of lots of different elements, JavaScript UI frameworks will likely provide a better experience.

Thanks for reading!

[Here's how you can use TailwindCSS in a stylesheet to build primitive components with just CSS.](https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes)
