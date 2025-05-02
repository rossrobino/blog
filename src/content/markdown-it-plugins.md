---
title: Create your own Markdown-It Plugin
description: Customize your markdown rendering with plugins.
keywords: md, markdown-it, plugin, html
date: 2025, 05, 02
---

## Markdown-It

[Markdown-It](https://github.com/markdown-it/markdown-it) is a popular markdown parser that converts markdown into HTML. It supports all the basic commonmark syntax out of the box.

It's nice to be able to extend the parser if you need more customization. For example, the [@shikijs/markdown-it](https://shiki.style/packages/markdown-it) plugin highlights code blocks with Shiki (in my opinion this is the best reason to use Markdown-It over another parser!). There are many other plugins made by the community, notably the [mdit-plugins](https://github.com/mdit-plugins/mdit-plugins) packages.

In this post we'll go through how to use the parser and how to create your own plugins.

## Install

To get started with Markdown-It, you can install the package from npm.

```bash
npm i markdown-it
```

The parser is a class with a `render` method that converts markdown into HTML.

```ts
import MarkdownIt from "markdown-it";

const mdIt = new MarkdownIt();

mdIt.render("# Hello world"); // <h1>Hello world</h1>
```

## Use

To add a plugin, you can _use_ the `use` method, you can use as many plugins as you like.

Here's an example from the [@mdit/plugin-img-lazyload](https://mdit-plugins.github.io/img-lazyload.html) plugin.

```ts
import { imgLazyload } from "@mdit/plugin-img-lazyload";

// ...

mdIt.use(imgLazyload);

mdIt.render("![Image](https://example.com/image.png)"); // <img alt="Image" src="https://example.com/image.png" loading="lazy">
```

## Create your own

Here's how you can create your own Markdown-It plugin. I'll create a `tableOverflow` plugin that adds a `<div style="overflow-x: auto">` element around each `<table>` element so they will not overflow off of the page horizontally.

### Types

`@types/markdown-it` provides some type helpers to ensure your plugin works with the `use` method.

```ts
import type { PluginSimple } from "markdown-it";

const plugin: PluginSimple = (mdIt) => {
	// modify the Markdown-It class with custom logic...
};
```

```ts
import type { PluginWithOptions } from "markdown-it";

const withOptions: PluginWithOptions<{ option: boolean }> = (
	mdIt,
	{ option } = {},
) => {
	// ...
};
```

### Render rules

Markdown-It creates an array of `tokens` that you can modify with a `RenderRule` in a plugin. The `tokens` get passed through each `RenderRule` as they are being parsed.

To add or modify a `RenderRule` within a plugin, you can set a property on the `mdIt.renderer.rules` object. It's a best practice when implementing a plugin to extend the original render rule rather than overwrite it. We'll create a proxy as the default if it's not set already.

In this case, we'll check to see if there's already `table_open` and `table_close` rules that another plugin has set. If they aren't defined, we'll set the originals to the proxy.

```ts {5-10}
import type { PluginSimple } from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";

const tableOverflow: PluginSimple = (mdIt) => {
	const proxy: RenderRule = (tokens, i, options, _env, self) =>
		self.renderToken(tokens, i, options);

	// create a reference to the original rules or use the proxy
	const originalTableOpenRenderer = mdIt.renderer.rules.table_open ?? proxy;
	const originalTableCloseRenderer = mdIt.renderer.rules.table_close ?? proxy;
};
```

### Custom rules

Next, we'll modify the rules on the Markdown-It instance. We'll use the original rule within our own rule, adding the `<div>` element before and after the table, and passing all the `args` directly into the original.

```ts {12-16}
import type { PluginSimple } from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";

const tableOverflow: PluginSimple = (mdIt) => {
	const proxy: RenderRule = (tokens, i, options, _env, self) =>
		self.renderToken(tokens, i, options);

	// create a reference to the original rules or use the proxy
	const originalTableOpen = mdIt.renderer.rules.table_open ?? proxy;
	const originalTableClose = mdIt.renderer.rules.table_close ?? proxy;

	mdIt.renderer.rules.table_open = (...args) =>
		`<div style="overflow-x: auto">` + originalTableOpen(...args);

	mdIt.renderer.rules.table_close = (...args) =>
		originalTableClose(...args) + "</div>";
};
```

Our `tableOverflow` plugin is now complete, we have updated the Markdown-It instance with our own rules via the plugin.

```ts
import MarkdownIt from "markdown-it";

const mdIt = new MarkdownIt().use(tableOverflow);
```

### Attributes

You can also modify a token within the plugin. For example, you can set an attribute on a token with the `attrSet` method. This is how the [@mdit/plugin-img-lazyload](https://github.com/mdit-plugins/mdit-plugins/tree/main/packages/img-lazyload) plugin works.

```ts {7}
import type { PluginSimple } from "markdown-it";

export const imgLazyLoad: PluginSimple = (md) => {
	const originalImage = md.renderer.rules.image!; // there's a default image rule (no need for proxy)

	md.renderer.rules.image = (tokens, i, options, env, self) => {
		tokens[i]?.attrSet("loading", "lazy");

		return originalImage(tokens, i, options, env, self);
	};
};
```

### Replacements

Here's another example of a YouTube embed plugin. Here we can replace the `<img>` element with an `<iframe>` if the image `src` starts with `"yt:"`.

```ts {11-23}
import type { PluginSimple } from "markdown-it";
import type MarkdownIt from "markdown-it";

export const youtubeEmbed: PluginSimple = (md: MarkdownIt) => {
	const originalImage = md.renderer.rules.image!;

	md.renderer.rules.image = (tokens, i, opts, env, self) => {
		const token = tokens[i];
		const src = token?.attrGet("src");

		if (src?.startsWith("yt:")) {
			const title = token?.content || token?.attrGet("alt") || "YouTube video";

			return `
<iframe
	loading="lazy"
	allowfullscreen
	title="${title}"
	src="https://www.youtube-nocookie.com/embed/${src.slice(3)}"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
></iframe>
	`.trim();
		}

		return originalImage(tokens, i, opts, env, self);
	};
};
```

So now the following code will produce a YouTube embed rather than an image.

```md
![Title](yt:uid)
```

## Conclusion

Those are the basics of creating your own custom Markdown-It plugin. You can use the [Markdown-It website](https://markdown-it.github.io/) in debug mode to view a list of the tokens generated from any stream of markdown to understand which rules apply to which elements and more properties that can be set or modified.

Thanks for reading!
