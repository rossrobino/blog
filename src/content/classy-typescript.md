---
title: Classy Typescript
description: A case for object oriented programming with modern TypeScript.
keywords: typescript, javascript, classes, oop
date: 2025, 12, 23
---

## Classy code

In the age of AI writing a larger percentage of code, one thing that I take pride in is code style, naming, and API design. I just released [ovr@v6.0.0](https://ovrjs.com) and refactored the entire codebase to have everything defined on classes. Here's the entire top-level API:

```ts
import { App, JSX, type Middleware, Multipart, Render, Route } from "ovr";
```

There are a variety of benefits that I've realized through writing my code like this.

## Classy types

Classes significantly help you write more JavaScript than TypeScript since they can be used directly as the type. Instead of creating separate types for objects that are returned from functions, you can simply use the class as the type.

You can also take advantage of [_declaration merging_](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). This allows you to create a type with the same name as a runtime object, and _merge_ them together. This is possible with functions but doesn't look quite right since you generally have lowercase function names an camel case types `createApp.Options` is simply worse than `App.Options`.

For example, in `ovr`, the `App` _class_ is merged with the `App` _namespace_, this allows the `Options` type to be available as `App.Options` instead of exporting a separate `AppOptions` type.

### Function

Instead of writing code like this:

```ts
export interface App = {
	// ...
};

export interface AppOptions = {
	// ...
};

export const createApp = (options: AppOptions) => {
	// ...

	const app: App = {
		// ...
	};

	return app;
};
```

Which the consumer would have three different imports for.

```ts
import { type App, type AppOptions, createApp } from "ovr";
```

### Class

Everything can be exported with one merged declaration.

```ts
export namespace App {
	export interface Options {
		// ...
	}
}

export class App {
	constructor(options: App.Options) {
		// ...
	}
}
```

```ts
import { App } from "ovr";
```

As a library maintainer, you don't have to remember to explicitly export the types, as a consumer you aren't overwhelmed with separate options types for each class: `AppOptions`, `MultipartOptions`, and `RenderOptions`. Each is simply available on respective class: `App.Options`, `Multipart.Options`, and `Render.Options`.

## Private fields

Have truly private properties is easy with classes, it makes it very obvious what is part of your public API. No need for different casing rules prefixed properties such as `_property` or `~property`.

There is also no need to use the `public` or `private` typescript keywords. Simply start the property name with a `#` and it is private at _runtime_---it's just JavaScript. This also allows these properties to be minified by bundlers.

```ts
export class App {
	#property = "private";

	#method() {
		return "private";
	}

	static #staticProperty = "private";
}
```

## Static methods

Static methods make it really easy to group methods onto the class. Unused static methods can be treeshaken by bundlers so besides a few extra characters for accessing, there is little downside to using them as much as possible.

For example, the `Route` class in `ovr` takes an HTTP `method` as the first argument of the constructor. I wanted a helper function to make it easier to create a `GET` route and also add on additional features. Instead of having to create a separate `createGetRoute` factory function, I just added `Route.get` as a static method to create the route with the modifications.

Again, one less export for consumers to remember, since everything is on the `Route` declaration.

## Exceptions

There are cases where using classes exclusively doesn't make sense. One example I still use a separate type for is to type function parameters. In `ovr` users can create `Middleware` which are functions that take `Middleware.Context` and `Middleware.Next` as arguments. I don't want to add a runtime `Middleware` class, since they are just functions, so I export a separate type in this case. Then users don't have to explicitly type the parameters.

```ts
import type { Middleware } from "ovr";

const mw: Middleware = (c, next) => {
	// ...
};
```

Stay classy.
