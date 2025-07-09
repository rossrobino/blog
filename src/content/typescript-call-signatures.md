---
title: TypeScript Call Signatures
description: How to define extra properties on a function in TypeScript.
keywords: typescript
date: 2025, 07, 09
---

## Function properties

In JavaScript, you can tack properties onto a function after you create it. Functions are objects!

```ts
const fn = () => {
	console.log("base");
};

fn.prop = "property";

fn.sub = () => {
	console.log("sub function");
};

fn(); // calls the function
fn.prop; // accesses the property
fn.sub(); // calls the property function
```

This is also perfectly valid in TypeScript. `fn` will have both the inferred `prop` and `sub` properties on it.

## Call Signatures

Sometimes you need to provide an explicit type for a function up front instead of inferring from the assignments. For example, when you add a function as a property of a class.

In this case you can use TypeScript's [call signatures](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Call signatures allow you to define a type for the function using object syntax so you can also define the extra properties.

```ts {3}
type FunctionWithProperties = {
	// fn()
	(): void; // call signature

	// fn.prop
	prop: string;

	// fn.sub()
	sub: () => void;
};
```

Now if you define `fn` without adding the extra properties afterwards, you'll get a type error:

```ts
// Property 'prop' is missing in type '{ (): void; sub(): void; }'
// but required in type 'FunctionWithProperties'.
const fn: FunctionWithProperties = () => {
	console.log("base");
};

fn.sub = () => {
	console.log("sub function");
};

// Haven't defined `prop` yet, so we get the error.
```

It's probably best to avoid doing this most of the time, but it can provide a nice API if you are building a library.
