---
title: Type-Safe Custom Element Attributes
description: How to achieve type-safety when using custom elements with your favorite framework.
keywords: javascript, dom, api, ssg
date: 2024, 04, 15
draft: true
---

## Overview

I created a [custom element library](https://drab.robino.dev) to share elements between the projects that I work on. One of the biggest drawbacks of using them is the developer experience and TypeScript support when you are using them inside of a templating file such as `svelte`, `astro`, `tsx`, or `vue`.

This post is a guide on how to use best utilize web components with TypeScript in your favorite framework.

## Create a Custom Element

Here's a custom element that displays a greeting based on the `username` attribute.

```ts
// myGreeting.ts

class MyGreeting extends HTMLElement {
	// property
	greeting = "Hello";

	constructor() {
		super();
	}

	get username() {
		return this.getAttribute("username") ?? "there";
	}

	set username(s: string) {
		this.setAttribute("username", s);
	}

	connectedCallback() {
		this.textContent = `${this.greeting} ${this.username}.`;
	}
}

// using vanilla js
customElements.define("my-greeting", MyGreeting);
```

```html
<my-greeting username="Ross"></my-greeting>
```

_\*If you see a better way to write any of these examples or a framework that is missing, please [create an issue or pull request](https://github.com/rossrobino/blog/issues)!_

## Astro

[Astro](https://docs.astro.build/en/guides/client-side-scripts/#web-components-with-custom-elements) is the one of the easiest frameworks to incorporate custom elements into since script tags only run on the client. Astro users also have the most to gain through the usage of custom elements over including another JavaScript framework. You don't have the cost of shipping a framework to the client to achieve interactivity.

```html
---
// Dialog.astro
import type { DialogAttributes } from "drab/dialog";

const dialogProps: DialogAttributes = {
	// type-safe attributes
};
---

<script>
	import { Dialog } from "drab/dialog";
	customElements.define("drab-dialog", Dialog);
</script>

<drab-dialog {...dialogProps}>...</drab-dialog>
```

## Enhance

[Enhance](https://enhance.dev) is an HTML-first full stack web framework that enables anyone to build multi-page dynamic web apps while staying as close to the web platform as possible.

```js
// app/elements/my-dialog.mjs
export default function MyDialog({ html }) {
	return html`
		<drab-dialog>...</drab-dialog>
		<script src="/_public/browser/drab-dialog.mjs" type="module"></script>
	`;
}
```

```js
// app/browser/drab-dialog.mjs
import { Dialog } from "drab/dialog";

customElements.define("drab-dialog", Dialog);
```

## React

```jsx
// dialog.tsx
"use client"; // required for React Server Components

import { useEffect } from "react";

export default function Dialog() {
	useEffect(() => {
		async function importElement() {
			if (!customElements.get("drab-dialog")) {
				const { Dialog } = await import("drab/dialog");
				customElements.define("drab-dialog", Dialog);
			}
		}
		importElement();
	}, []);

	return <drab-dialog>...</drab-dialog>;
}
```

```ts
// add a .d.ts file
import type { DialogAttributes } from "drab";

declare namespace JSX {
	interface IntrinsicElements {
		"drab-dialog": DialogAttributes & { children: any };
	}
}
```

## Solid

```jsx
// dialog.jsx
import { onMount } from "solid-js";

export default function Dialog() {
	onMount(async () => {
		if (!customElements.get("drab-dialog")) {
			const { Dialog } = await import("drab/dialog");
			customElements.define("drab-dialog", Dialog);
		}
	});

	return <drab-dialog>...</drab-dialog>;
}
```

```ts
// global.d.ts
/// <reference types="@solidjs/start/env" />

import "solid-js";
import type { DialogAttributes } from "drab";

type Merge<T, U> = Omit<T, keyof U> & U;

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"drab-dialog": Merge<DialogAttributes, JSX.HTMLAttributes<HTMLElement>>;
		}
	}
}
```

## Svelte

```svelte
<script lang="ts">
	import { onMount } from "svelte";
	import type { DialogAttributes } from "drab/dialog";

	onMount(async () => {
		if (!customElements.get("drab-dialog")) {
			const { Dialog } = await import("drab/dialog");
			customElements.define("drab-dialog", Dialog);
		}
	});

	const dialogProps: DialogAttributes = {
		// type-safe attributes
	};
</script>

<drab-dialog {...dialogProps}>...</drab-dialog>
```

## Vue

```vue
<!-- Dialog.vue -->
<script setup>
onMounted(async () => {
	if (!customElements.get("drab-dialog")) {
		const { Dialog } = await import("drab/dialog");
		customElements.define("drab-dialog", Dialog);
	}
});
</script>

<template>
	<drab-dialog>...</drab-dialog>
</template>
```

```js
// nuxt.config.ts
export default defineNuxtConfig({
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag.includes("-"),
		},
	},
});
```
