---
title: Cross-Document View Transitions
description: Animate between pages in a multi-page application.
keywords: view transitions, css, html
date: 2024, 06, 11
---

## Browser support

[Cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) have landed in Chrome 126. This feature is a progressive enhancement that enables animations between pages with the same origin. Previously, there was no way to animate between navigation from one page to another without the use of a client-side JavaScript router. This feature allows users to animate between pages in multi-page applications using only CSS. For browsers that do not support the feature, navigation still occurs without animation.

Here's a minimal example showing how to enable cross-document transitions and how add animations to specific elements.

## HTML

Here are two almost identical pages that link to each other that we will transition between using CSS. Combine view transitions with the [Speculation Rules API](https://blog.robino.dev/posts/speculation-rules-api) to speed up navigation and ensure animations run as quickly as possible.

### page-1.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="/style.css" />
		<title>Page 1</title>
		<script type="speculationrules">
			{
				"prerender": [
					{
						"source": "list",
						"urls": ["/page-2/"]
					}
				]
			}
		</script>
	</head>
	<body>
		<main>
			<h1>Page 1</h1>
			<a href="/page-2/">Page 2</a>
		</main>
	</body>
</html>
```

### page-2.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="/style.css" />
		<title>Page 2</title>
		<script type="speculationrules">
			{
				"prerender": [
					{
						"source": "list",
						"urls": ["/page-1/"]
					}
				]
			}
		</script>
	</head>
	<body>
		<main>
			<a href="/page-1/">Page 1</a>
			<h1>Page 1</h1>
		</main>
	</body>
</html>
```

## CSS

### Cross-fade

Both pages link to the same CSS file---`style.css`.

We can start by adding the `@view-transition` rule to enable cross-document transitions. We'll also add a media query to disable them if users prefer reduced motion.

```css
@view-transition {
	navigation: auto;
}

@media (prefers-reduced-motion) {
	::view-transition-group(*),
	::view-transition-old(*),
	::view-transition-new(*) {
		animation: none !important;
	}
}
```

This example will provide a cross-fade animation by default.

### FLIP

If you want a specific element to move from one location to another during the navigation you can set a `view-transition-name` property on the element with CSS. _This property needs to target only one element on each page._ This allows the browser to take a snapshot of where this element is on the old page, and animate to it's next position on the new page.

```css
h1 {
	view-transition-name: heading;
}
```

Now when you navigate from one page to the other, the heading will interpolate between the two positions.

### Custom

Finally, you can also add a custom animation to the heading element. Add the exit animation under `view-transition-old` and the enter animation under `view-transition-new`. We will target the `heading` name with both of these selectors. This makes it possible to apply different animations to different elements.

Altogether, the CSS file now looks like this.

```css
/* style.css */

@view-transition {
	navigation: auto;
}

@media (prefers-reduced-motion) {
	::view-transition-group(*),
	::view-transition-old(*),
	::view-transition-new(*) {
		animation: none !important;
	}
}

h1 {
	view-transition-name: heading;
}

@keyframes slide-out {
	to {
		translate: 0 -100vh;
	}
}
@keyframes scale-in {
	from {
		scale: 0;
	}
}

::view-transition-old(heading) {
	animation: 1s ease-in-out slide-out;
}
::view-transition-new(heading) {
	animation: 1s ease-in-out scale-in;
}
```

You'll now see how the old heading slides out and the new heading scales into place.

Here's a [more extensive demo](https://view-transitions.netlify.app/stack-navigator/mpa/) from the Google team showcasing more of the cross-document transition features.

Thanks for reading!
