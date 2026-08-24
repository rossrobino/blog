---
title: Icons in CSS
description: A simple, performant way to use icons with TailwindCSS.
keywords: tailwind, css, icons, iconify
date: 2025, 04, 19
---

![YouTube Tutorial](yt:JKvYpUtgD_Q)

## Iconify

I came across [this section](https://svelte.dev/docs/kit/icons#CSS) in the Svelte documentation around including icons in your CSS. The section led me to the [Iconify documentation](https://iconify.design/docs/usage/css/) around how this works and the [Iconify TailwindCSS plugin](https://iconify.design/docs/usage/css/tailwind/tailwind4/).

There are some big advantages to this icon strategy.

- **Caching**: Static CSS files can be cached with immutable headers, the client only has to download the assets once. Compared to an HTML page that cannot be cached as aggressively.
- **Bundle size**: The icons aren't being sent in the HTML response. Instead they are included once in your CSS and then reused.

The docs also point out some disadvantages of this technique---not being able to animate icons, and you cannot target elements within SVGs.

## Tailwind plugin

Install the TailwindCSS plugin with your preferred package manager. Also you can install the JSON icon sets you would like to use. I'll use Phosphor for this example.

```bash
npm i -D @iconify/tailwind4 @iconify-json/ph
```

Then add the plugin to your TailwindCSS stylesheet.

```css {4-6}
/* tailwind.css */
@import "tailwindcss";

@plugin "@iconify/tailwind4" {
	scale: 1.3; /* optional sizing */
}
```

Now you can use the icons as class names.

```html
<span class="icon-[ph--x]"></span>
```

## How it works

Here's the generated class for the Phosphor X icon:

```css {6}
.icon-\[ph--x\] {
	-webkit-mask-image: var(--svg);
	mask-image: var(--svg);
	width: 1.3em;
	height: 1.3em;
	--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' width='256' height='256'%3E%3Cpath fill='black' d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z'/%3E%3C/svg%3E");
	display: inline-block;
	-webkit-mask-size: 100% 100%;
	mask-size: 100% 100%;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	background-color: currentColor;
}
```

The SVG gets inlined as a CSS custom property directly into our class, and then used as the `mask-image`. Since we are using Tailwind, only the icons we use get included in the bundle.
