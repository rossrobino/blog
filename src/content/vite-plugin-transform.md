---
title: Transform Markdown into JavaScript with a Vite Plugin
description: How to use the transform hook in a Vite plugin to import markdown files into modules, converting them to HTML strings.
keywords: javascript, typescript, vite
date: 2024, 06, 28
---

![YouTube Tutorial](DUdozB7R-AE)

## Introduction

In this tutorial, I'll show you how you can use the `transform` hook within a Vite plugin. We'll create a way to import markdown files into JavaScript modules as a parsed HTML string.

If you haven't created a plugin before, check out this tutorial: [Create Your Own Vite Plugin](https://blog.robino.dev/posts/vite-plugin).

## Install dependencies

First, install [marked](https://marked.js.org/) as a dependency, we'll use it to convert our markdown into HTML.

```bash
npm i marked
```

## `transform` hook

We will use Rollup's `transform` hook within our plugin, it allows us to import files that are not JavaScript by first compiling them to a module within the plugin. Lots of frameworks make use of this hook if they use custom file types. For example, `vite-plugin-svelte` [uses this hook](https://github.com/sveltejs/vite-plugin-svelte/blob/23096cf3d8d26f1ab3b93259ceb582435ec8563b/packages/vite-plugin-svelte/src/index.js#L139) to convert `.svelte` files into JavaScript.

We'll follow the [example](https://vitejs.dev/guide/api-plugin.html#transforming-custom-file-types) from the Vite documentation and create our markdown plugin. Let's create a new plugin called `markdown` that converts `.md` files to JavaScript by adding it to our plugins array.

```ts
// vite.config.ts
import { parse } from "marked";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "markdown-html",
			async transform(code, id) {
				if (/\.(md)$/.test(id)) {
					// convert to html with `marked`
					const html = await parse(code);

					return {
						// return the .js file we would want to import
						code: `
							export const html = ${JSON.stringify(html)};
							export const md = ${JSON.stringify(code)};
						`,
						map: null,
					};
				}
			},
		},
	],
});
```

## Types

Next, since I'm using TypeScript, I need to also tell the TypeScript language server that markdown files can now be imported. Since all files within `src` are included in our `tsconfig`, we can add a declaration file anywhere inside `src` to declare markdown files as modules.

```ts
// src/types/md.d.ts
declare module "*.md" {
	export const html: string;
	export const md: string;
}
```

This marks all `.md` files as modules that export an object containing `html` and `md` strings.

## Test out the plugin

Next, create a `.md` file within your project to import.

```md
<!-- src/md/post.md -->

# Heading 1

This is a markdown file.

- list item 1
- list item 2
```

Then test out the functionality within `main.ts`.

```ts
// src/main.ts
import { html } from "./md/post.md";

document.body.insertAdjacentHTML("afterbegin", html);
```

Run `npm run dev` to start the dev server and see the markdown rendered on the page!

## Build time

It's important to note, this import occurs at _build_ time. Run `npm run build` to build your project and then inspect the `dist/assets/index...js` file. You'll see the processed HTML inlined into this JavaScript file.

## Conclusion

Utilize Rollup's `transform` hook within a plugin to compile non-JS files into modules at build time.

Thanks for reading!
