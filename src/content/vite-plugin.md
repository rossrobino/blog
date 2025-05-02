---
title: Create Your Own Vite Plugin
description: Understand modern development tooling by building a basic Vite plugin with LinkeDOM.
keywords: javascript, typescript, vite, plugin
date: 2024, 06, 07
---

![YouTube Tutorial](yt:qYKzMnORnA0)

## Introduction

In this post, I'll show you how you can create a Vite plugin to reuse HTML partials in your web development projects.

## What are Vite plugins?

[Vite](https://vitejs.dev/) is a popular JavaScript bundler and development server, it also has a plugin system has become a large part of the JavaScript ecosystem. These plugins allow developers to add additional functionality to Vite's build and development pipeline.

It's useful to understand the basics of how these plugins work, I hope this tutorial helps people scratch the surface of what is going on in many of the modern frameworks that use Vite such as [SvelteKit](https://kit.svelte.dev), [Nuxt](https://nuxt.com/), [Astro](https://astro.build/), [Remix](https://remix.run/), and [Solid Start](https://start.solidjs.com/).

## Tutorial start - create a new project

In your terminal, navigate to the directory you would like to create your project in, and scaffold a new Vite project with the `create-vite` command line interface.

```bash
npm create vite@latest
```

These are the options I chose and will be using in the tutorial.

- TypeScript
- Vanilla JS

I removed the code to create the demo project so I have an empty HTML page.

- Delete `src/style.css`
- Delete `src/counter.ts`
- Delete contents of `main.ts`

## Install required dependencies

Add types for NodeJS and we'll use [LinkeDOM](https://github.com/WebReflection/linkedom) within our plugin for HTML parsing and modification on the server.

```bash
npm i -D @types/node
```

```bash
npm i linkedom
```

## Add vite.config

Add a `vite.config.ts` file in the root directory. You can author the plugin in a separate module and import, but to keep things simple we will author it directly inline.

We will use the `transformIndexHtml` hook to obtain the HTML string of the `index.html` file. Check out [other available hooks](https://vitejs.dev/guide/api-plugin.html#universal-hooks) in the Vite documentation.

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "html-partials",
			transformIndexHtml: {
				order: "pre",
				async handler(html) {
					console.log(html);
				},
			},
		},
	],
});
```

```bash
npm run dev
```

After running the dev server, you should now see the contents of `index.html` output in your console.

## Parse and modify HTML with LinkeDOM

Next we'll use LinkeDOM to make DOM methods available to parse the and modify the HTML string.

```ts
// vite.config.ts
import { parseHTML } from "linkedom";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "html-partials",
			transformIndexHtml: {
				order: "pre",
				async handler(html) {
					// create a DOM on the server
					const dom = parseHTML(html);

					// append some text
					dom.document.body.append("Hello world!");

					// return the updated html string
					return dom.document.toString();
				},
			},
		},
	],
});
```

Navigate to http://localhost:5173, you should see `Hello world!` in your browser. LinkeDOM makes it easy to use the browser APIs we already know on the server to modify the HTML.

## Create a partial

A key feature many JavaScript frameworks provide is the ability to author components or reuse markup throughout an application. We'll make a plugin that enables us to reuse _partials_ of HTML.

For every HTML partial stored in the `src/partials` directory, we should find the element with the same name as the file, and append the contents inside of that element.

Consider the following file structure.

```
.
└── src/
	└── partials/
		└── my-button.html
```

`my-button.html` contains a partial that we would like to reuse in our application. It contains a script and style tag that should also be added to the main document once, and then content that should be added inside of each `<my-button>` element found.

```html
<!-- src/partials/my-button.html -->

<script type="module">
	// @ts-check

	customElements.define(
		"my-button",
		class extends HTMLElement {
			trigger = this.querySelector("button");

			connectedCallback() {
				if (this.trigger) {
					this.trigger.addEventListener("click", () => alert("Alert!"));
				}
			}
		},
	);
</script>

<button><slot></slot></button>

<style>
	my-button button {
		border: none;
		background-color: darkblue;
		padding: 0.5rem 0.75rem;
		color: white;
	}
</style>
```

## Create the plugin

Instead of just appending text to the body, we can write the logic for our plugin instead.

First, we can read the `src/partials` directory and get a list of all of the partials. Then we can process each of the partials accordingly.

```ts
// vite.config.ts
import { parseHTML } from "linkedom";
import fs from "node:fs/promises";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "html-partials",
			transformIndexHtml: {
				order: "pre",
				async handler(html) {
					// create a DOM on the server
					const dom = parseHTML(html);

					// get list of file names
					const partialFileNames = await fs.readdir("src/partials");

					// process each partial
					for (const fileName of partialFileNames) {
						// following code goes here...
					}

					// return the updated html string
					return dom.document.toString();
				},
			},
		},
	],
});
```

We'll need to get the `name` of the partial/custom element and the HTML text `content`. In addition to the the main `dom` we have already created from `index.html` we will create another `partialDom` for our partial.

```ts
// remove `.html`
const name = fileName.split(".").at(0);

// read the file as text
const content = await fs.readFile(`src/partials/${fileName}`, "utf-8");

if (name && content) {
	// create a dom based on the `content` with LinkeDOM
	const partialDom = parseHTML(content);

	// ...
}
```

Next, we need to copy the `<script>` and `<style>` tags from the `partialDom` to the head of the main `dom`, since they only need to be added and ran once.

```ts
const scriptsAndStyles = partialDom.document.querySelectorAll("script, style");

for (const el of scriptsAndStyles) {
	// copy the scripts and styles to the main dom
	dom.document.head.append(el.cloneNode(true));

	// remove from the partial
	el.remove();
}
```

Finally, we'll insert slotted content within the custom element into the partial, and then insert the processed partial into the main `dom`.

```ts
// find `my-button` elements in the main `dom`
const elements = dom.document.querySelectorAll(name);

for (const el of elements) {
	const slot = partialDom.document.querySelector("slot");

	// add the slotted content from the main `dom`
	// inside the slot in the partial
	if (slot?.parentElement) {
		slot.parentElement.innerHTML = el.innerHTML;
	}

	// replace content of the element with the final partial
	el.innerHTML = partialDom.document.toString();
}
```

Altogether, the entire module now looks like this.

```ts
// vite.config.ts
import { parseHTML } from "linkedom";
import fs from "node:fs/promises";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "html-partials",
			transformIndexHtml: {
				order: "pre",
				async handler(html) {
					// create a DOM on the server
					const dom = parseHTML(html);

					// get list of file names
					const partialFileNames = await fs.readdir("src/partials");

					// process each partial
					for (const fileName of partialFileNames) {
						// remove `.html`
						const name = fileName.split(".").at(0);

						// read the file as text
						const content = await fs.readFile(
							`src/partials/${fileName}`,
							"utf-8",
						);

						if (name && content) {
							// create a `partialDom` based on the `content` with LinkeDOM
							const partialDom = parseHTML(content);

							const scriptsAndStyles =
								partialDom.document.querySelectorAll("script, style");
							for (const el of scriptsAndStyles) {
								// copy the scripts and styles to the main dom
								dom.document.head.append(el.cloneNode(true));

								// remove from the partial
								el.remove();
							}

							// find `my-button` elements in the main `dom`
							const elements = dom.document.querySelectorAll(name);
							for (const el of elements) {
								const slot = partialDom.document.querySelector("slot");

								// add the slotted content from the main `dom`
								// inside the slot in the partial
								if (slot?.parentElement) {
									slot.parentElement.innerHTML = el.innerHTML;
								}

								// replace content of the element with the final partial
								el.innerHTML = partialDom.document.toString();
							}
						}
					}

					// return the updated html string
					return dom.document.toString();
				},
			},
		},
	],
});
```

We've now created a partials plugin in under 50 lines of code!

## Test

Update `index.html` to include your new partial by adding the `<my-button>` custom element with some slotted content.

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/vite.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Vite + TS</title>
	</head>
	<body>
		<!-- Add custom element -->
		<my-button>Alert</my-button>

		<script type="module" src="/src/main.ts"></script>
	</body>
</html>
```

If your dev server isn't still running, run the following command to restart and test the plugin!

```bash
npm run dev
```

You should see your `<script>` and `<style>` tags added to the head of the document using the browser dev tools, and when you click the button you should see the alert.

Finally, run Vite's build command.

```bash
npm run build
```

You will see the output of the modified HTML along with the bundled JavaScript from your partial in your `dist/` directory.

## Conclusion

While there are many cases this plugin does not consider, it is a starting point for understanding more about the Vite plugin ecosystem and bundling tools. For example, next you might want to add the `src/partials` files to the file watcher with the [configureServer hook](https://vitejs.dev/guide/api-plugin.html#configureserver) so our page will update when our partial files are modified.

You can read more about other [plugin options and hooks](https://vitejs.dev/guide/api-plugin.html) and find [first party and community plugins](https://vitejs.dev/plugins/) in the Vite documentation,

Thanks for reading!
