---
title: Simple Memoization in TypeScript
description: A tiny class to memoize a function in TS.
keywords: memo, cache, javascript, typescript
date: 2025, 11, 12
---

## Memoization

JavaScript isn't the fastest language, it's best to make sure repeated async operations and expensive computations aren't done repeatedly. Here's a `Memo` class that ensures whether it be an async function that has latency, or an expensive mathematical computation, the same operations are not running multiple times.

## Memo class

This memo class creates a trie for each function using each argument it is called with. Async calls link to the same result so they are not called twice even if the async call hasn't completed yet!

> If you are memoizing on a web server, be sure to create the memo instance within the scope of the request or in `AsyncLocalStorage` if you are caching sensitive data.

```ts
export class Memo {
	/** Already memoized functions. */
	#memoized = new WeakMap<Function, Function>();

	/** Symbol to store the result of each memoized function. */
	static #RESULT = Symbol();

	/**
	 * Calls to the returned function with the same arguments will
	 * return a cached result.
	 *
	 * @param fn Function to memoize.
	 * @returns The memoized function.
	 */
	use<A extends any[], R>(fn: (...args: A) => R) {
		if (this.#memoized.has(fn)) return this.#memoized.get(fn) as typeof fn;

		// closure will GC automatically
		const trie = new Map();

		const memo = (...args: A): R => {
			let node = trie;

			for (const arg of args) {
				// get/create a node for each arg
				// have to use `has` because arg could be `undefined`
				if (!node.has(arg)) node.set(arg, new Map());
				node = node.get(arg);
			}

			// set the final result if not there
			if (!node.has(Memo.#RESULT)) node.set(Memo.#RESULT, fn(...args));

			return node.get(Memo.#RESULT);
		};

		this.#memoized.set(fn, memo);

		return memo;
	}
}
```

## Usage

```ts
const memo = new Memo();

const add = memo.use((a: number, b: number) => a + b);

add(1, 2); // runs
add(1, 2); // cached
add(2, 3); // runs again, saves the new result separately
```
