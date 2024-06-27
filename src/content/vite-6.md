---
title: Vite 6 - Exploring the Environment API
description: desc.
keywords: keyword
date: 2024, 01, 01
draft: true
---

<!-- <drab-youtube aria-label="YouTube Tutorial" uid="">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube> -->

## Create a new Vite project

```bash
npm create vite@latest
```

These are the options I chose and will be using in the tutorial.

- TypeScript
- Vanilla JS

I removed the code to create the demo project so I have an empty HTML page.

- Delete contents of `style.css`
- Delete `counter` module entirely
- Delete contents of `main.ts`
- Edit `index.html`:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/vite.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Vite + TS</title>
		<script type="module" src="/src/main.ts"></script>
		<link rel="stylesheet" href="/src/style.css" />
	</head>
	<body>
		<main></main>
	</body>
</html>
```

## Edit package.json

Find the most current version of Vite 6 on npm, edit `package.json`, and install.

https://www.npmjs.com/package/vite?activeTab=versions

## Add vite.config

Add a `vite.config.ts` file in the root directory. You can author the plugin in a separate module and import, but to keep things simple we will author it directly inline.

We will use the `transformIndexHtml` hook to obtain the HTML string of the `index.html` file. Check out [other available hooks](https://vitejs.dev/guide/api-plugin.html#universal-hooks) in the Vite documentation.

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		{
			name: "env-test",
			transformIndexHtml: {
				const ssrEnv = ctx.server?.environments.ssr;
					if (ssrEnv) {
						// resolves to `url` to a module `id`
						// load it (reading the file from the file system or through a plugin that implements a virtual module)
						// and then transform the code
						const transformResult =
							await ssrEnv?.transformRequest("src/ssr.ts");
						// this does not run the module
						if (transformResult) {
							console.log(transformResult.code);
						}
			},
		},
	],
});
```

```ts
// ssr.ts
const hello: string = "world!";
```
