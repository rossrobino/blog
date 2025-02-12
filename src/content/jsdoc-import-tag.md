---
title: JSDoc @import Tag
description: A better way to write types with JSDoc comments.
keywords: TypeScript, JavaScript, JSDoc
date: 2025, 02, 12
draft: true
---

<!-- <drab-youtube aria-label="YouTube Tutorial" uid="">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube> -->

## JSDoc types

It's nice to have type safety in `.js` files, you can configure TypeScript to also check these files in your `tsconfig.json` with these two compiler options.

```json
// tsconfig.json
{
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true
	}
}
```

I use this frequently in configuration files or in node scripts that I don't want to compile before running in CI.

## @type tag

When you need to use a type for something in a JavaScript file, you can write them in JSDoc `/** */` comments with a `@type` tags. Most frequently this is needed when you can't infer the type, for example the parameters of a function.

```js
/**
 * a and b are both typed as `number`
 *
 * @param {number} a
 * @param {number} b
 */
const add = (a, b) => a + b;
```

## @import tag

I used to struggle to remember the syntax for importing types from other modules.

```js
// prettier.config.js
/** @type {import("prettier").Config} */
export default {
	// prettier options
};
```

TypeScript 5.5 added support for [importing types with the @import tag](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#the-jsdoc-import-tag). This aligns with ESM import syntax and to me, it is much easier to remember. You can also reuse the type in multiple places if needed.

```js
// prettier.config.js
/** @import { Config } from "prettier" */

/** @type {Config} */
export default {
	// prettier options
};
```

## Caveats

If you are publishing a library to npm, it might seem easier to write it in JavaScript and publish the source code directly. Unfortunately, TypeScript will not pick up the types from your JSDoc comments when your package is imported from `node_modules` [by default](https://www.typescriptlang.org/tsconfig/#maxNodeModuleJsDepth). If you want users to have types with your package you will still need to generate `.d.ts` files and publish them alongside your `.js`.

Since either option requires some kind of build step, I think it's easier to just write `.ts` files and use the TypeScript `tsc` compiler for most packages. This ensures you have accurate `.d.ts` files that are generated from your `.ts` files.
