---
title: Create a Svelte Component Library
description: How to create a npm package with SvelteKit to share your components between projects.
keywords: svelte, components, library, npm
date: 2023, 01, 12
---

<drab-youtube aria-label="YouTube Tutorial" uid="_5IZi9xyDFY">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

## svelte-package 2.0

_This post was updated on Mar 22, 2023 to account for the changes in svelte-package 2.0. This update simplified the process for setting up a component library. See instructions on migrating an existing project [here](https://github.com/sveltejs/kit/pull/8922). You can also now find more information on svelte-package in the [documentation](https://kit.svelte.dev/docs/packaging)._

## Create a new SvelteKit project

If you frequently have components that you share between projects and want to keep a single repository of them, you can create a package on [npm](https://www.npmjs.com/). Here's how to create a [Svelte](https://svelte.dev) component library with [SvelteKit](https://kit.svelte.dev).

## Setup

- Navigate to a directory in your terminal where you will create your project
- Run `npm create svelte@latest`, configure your project with the CLI, select the `Library skeleton project` template, I'm going to use TypeScript in this tutorial
- Update `README.md` with information about your project

## Project information

Since this is a library project, it's important to add in your relevant information to the `package.json` file so it will appear in npm when the package is published. The template sets much of this up for us, but we will need to edit a few fields.

You can read more on this in the [svelte-package documentation](https://kit.svelte.dev/docs/packaging).

```json
{
	"name": "@rossrobino/components",
	"version": "0.0.1",
	"description": "A reusable Svelte component library",
	"keywords": [
		"components",
		"documentation",
		"Svelte",
		"SvelteKit"
	],
	"homepage": "https://components.com",
	"license": "MIT",
	"author": {
		"name": "Ross Robino",
		"url": "https://robino.dev"
	},
	"repository": "github:rossrobino/components",
	"sideEffects": false,
	...
```

### sideEffects

An important note if you are planning on including CSS in your components--set the `sideEffects` field to `false`, if you want bundlers like Vite to be more aggressive with tree-shaking. If this field is not set, all of the CSS for every one of your exported components will be included when one component is imported. If your package does include modules with [side effects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) that occur upon importing, you can specify them with an array of paths to the modules.

Find the latest information on this setting on this [pull request](https://github.com/sveltejs/kit/pull/10691) I made.

## lib directory

The contents of the `src/lib` directory are what will be packaged upon running `npm run package`. This is where components can reside for the project as well as an `index.ts` file that exports the components for the package.

## Create a component

Create a component to export in your package, here's my `YouTube.svelte` component as an example.

```svelte
<!-- src/lib/YouTube.svelte -->

<script lang="ts">
	let { uid, title }: { uid: string; title: string } = $props();
</script>

<iframe
	src="https://www.youtube.com/embed/{uid}"
	{title}
	frameborder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen
></iframe>
```

## Export

Import and export the component from `src/lib/index.ts`.

```ts
// src/lib/index.ts

import YouTube from "./YouTube.svelte";

export { YouTube };
```

## Test locally

Do a quick test of your component on `src/routes/+page.svelte` by importing it to the page and running `npm run dev -- --open`.

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	import YouTube from "$lib/YouTube.svelte";
</script>

<YouTube uid="gouiY85kD2o" title="Renegade - Kevin Olusola" />
```

Ensure that the component is working as expected, then you are ready to create a package.

## Package

Now we can package the library and publish it on [npm](https://www.npmjs.com/) for anyone to use. Repeat these steps each time you want to update your package.

- Set the `version` in `package.json`, this will have to be bumped up each time you publish the package (major.minor.patch)--you can leave this at `0.0.1` to start
- Run `npm install` to sync your `package-lock.json` with the current version information
- Run `npm run package` to execute the `package` script in `package.json`
- You can verify the output of your build in the `dist` directory
- Commit changes to your repository
- Run `npm publish --access public` to publicly publish your package on npm (if you don't have an account you will need to create one and log in)

## Test in a separate project

After verifying on the npm website that your package has been published, you can now use your package in a separate project.

- Set up a new SvelteKit project or use a different existing one
- Run `npm install -D yourPackageName` to install it as a dev dependency
- Import in `src/routes/+page.svelte` like before, but edit the import path to point to your package instead
- Lastly, run `npm run dev -- --open` to see your imported component in action

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	import { YouTube } from "@rossrobino/components";
</script>

<YouTube uid="gouiY85kD2o" title="Renegade - Kevin Olusola" />
```

## Conclusion

You have now built a Svelte component library you can access from any of your other SvelteKit projects to share code between them.

Thanks for reading!
