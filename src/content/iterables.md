---
title: Comprehensive Guide to JavaScript Iterables
description: A deep dive on Iterables, Iterable types, and generator functions.
keywords: javascript, typescript, iterable
date: 2025, 04, 09
---

## Defining an iterable

Iterables are used all the time when writing JavaScript. Arrays, sets, and maps are all examples of iterables. Iterables implement the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) which specifies that the iterable must have a `Symbol.iterator` method which implements the [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol).

Iterables come with some nice features, most notably, you can iterate through any iterable using a `for...of` loop.

```ts
const iterable = [1, 2, 3, 4, 5];

for (const value of iterable) {
	value; // 1, 2, 3...
}
```

## Broader input types

TypeScript's built-in `Iterable` type provides a nice way to broaden the type of an expected input. For example, if you have a function that capitalizes a list of strings provided by the user you might default to using an `Array` as the input.

```ts
const capitalize = (input: string[]) => {
	const result: string[] = [];
	for (const str of input) result.push(str.toUpperCase());
	return result;
};

capitalize(["upper", "case"]); // ["UPPER", "CASE"]
```

Since we aren't using any array specific methods here (only a `for...of` loop), we can make the input argument an `Iterable` to allow users to pass in any iterable of strings instead of just an array.

```ts {1,8}
const capitalize = (input: Iterable<string>) => {
	const result: string[] = [];
	for (const str of input) result.push(str.toUpperCase());
	return result;
};

capitalize(["upper", "case"]); // still works
capitalize(new Set(["upper", "case"])); // also works now
```

## Check if a value is an iterable

To check if an `unknown` is an `Iterable` you can first ensure the `unknown` is a `string`, or an `object` with a `Symbol.iterator` method.

```ts
const isIterable = (value: unknown) =>
	typeof value === "string" ||
	(value != null && typeof value === "object" && Symbol.iterator in value);
```

## Create your own iterable

Creating your own iterable might be useful if you are streaming or creating a library and want to provide a nice developer experience. The `Iterable` object should have a `Symbol.iterator` method that returns an `Iterator`.

Let's create our own `Translation` iterable that translates words from English to Spanish. We can use a class to give users a similar experience as creating a `Set` or `Map`. The user can supply the `words` in the `constructor` method, and the class will hold the dictionary for each word in a map.

```ts
class Translation {
	words: string[];
	i = 0;
	dict = new Map([
		["hello", "hola"],
		["goodbye", "adios"],
		// a ton of words...
	]);

	/**
	 * @param words English words to translate to Spanish.
	 */
	constructor(words: string[]) {
		this.words = words;
	}
}
```

It's a best practice when making an `Iterator` to make it also an `Iterable`, or an _iterable iterator_. We can accomplish this by giving our class a `next` method that returns an `IteratorResult`---making it an `Iterator`---and a `Symbol.iterator` method that returns `this`, since `this` is an `Iterator`.

The first type argument of the `IteratorResult` is the type of the `value` when the iterator is not `done`, the second argument is the return type of the `value` when it is done. Here we'll return the translated word when it's not done, and `undefined` when it completes.

```ts {10}
class Translation {
	// ...

	// makes Translation also an `Iterable`
	[Symbol.iterator]() {
		return this;
	}

	// makes Translation an `Iterator`
	next(): IteratorResult<string, undefined> {
		// TODO: return an `IteratorResult`
	}
}
```

Next we'll implement the optional [`return` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#returnvalue) that is called when the iterator is complete. Here we can reset `i` to `0` and return the result.

```ts {4-11}
class Translation {
	// ...

	return(): IteratorReturnResult<undefined> {
		const result = { done: true as const, value: undefined };

		// clean up
		this.i = 0;

		return result;
	}

	next(): IteratorResult<string, undefined> {
		// TODO: return an `IteratorResult`
	}
}
```

Within the `next` function, we'll check to see if we are done. If we have translated all of the words, we'll call the `return` method which satisfies the second argument of our `Iterator` type.

```ts {5}
class Translation {
	// ...

	next(): IteratorResult<string, undefined> {
		if (this.i === this.words.length) return this.return();

		// TODO: increment i, return the translated word
	}
}
```

If we are not done, we can translate the `word`, increment `i`, and return the `value`.

```ts {7-10}
class Translation {
	// ...

	next(): IteratorResult<string, undefined> {
		if (this.i === this.words.length) return this.return();

		const word = this.words[this.i++]!;
		const value = this.dict.get(word) ?? "not found";

		return { done: false, value };
	}
}
```

## Iterating

### For...of loop

Now we can use our `Translation` iterable with a `for...of` loop.

```ts
const translation = new Translation(["hello", "goodbye", "asdf"]);

for (const word of translation) console.log(word);

// hola
// adios
// not found
```

### Spread operator

You can also use the spread operator (`...iterable`) to iterate through an iterable, this will call the `next` function just like using a `for...of` loop.

```ts
const translation = new Translation(["hello", "goodbye", "asdf"]);

console.log([...translation]); // ["hola", "adios", "not found"]
```

### yield\*

Another JavaScript built in that accepts iterables is `yield*` within a generator function, which delegates the yield to the iterable, yielding each iteration value.

```ts
function* translate(words: string[]) {
	yield* new Translation(words);
}
```

## Return value

Notice how the final return `value` (`undefined`) is never logged when using the `for...of` the spread operator, or `yield*`. These iterations only accesses the values when `done` is `false`.

In some cases you might want to return a value at the end once the loop has completed. Let's return all of the words and their translations as an object.

- Create an object of `values` to hold the translations.
- Update the return type argument to the `IteratorResult` and `IteratorReturnResult` to be a `Record<string, string>`.
- Add each translated word into `values` as its translated.
- Return `values` as the final value when translations are complete.
- Clean up `values` within the `return` method.

```ts {3,5,10,15-16,19}
class Translation {
	// ...
	values: Record<string, string> = {};

	next(): Iterator<string, Record<string, string>> {
		if (this.i === this.words.length) return this.return();

		const word = this.words[i++]!;
		const value = this.dict.get(word) ?? "not found";
		this.values[word] = value;

		return { done: false, value };
	}

	return(): IteratorReturnResult<Record<string, string>> {
		const result = { done: true as const, value: { ...this.values } };

		this.i = 0;
		this.values = {}; // clean up values too

		return result;
	}
}
```

Now to access the return value will need to call `next` directly on the iterator instead of using a `for...of` loop. When `done` is `true`, we'll break out of the `while` loop and log the final result's value.

```ts
const translation = new Translation(["hello", "goodbye", "asdf"]);

let result = translation.next();
while (!result.done) result = translation.next();

console.log(result.value); // { hello: "hola", goodbye: "adios", asdf: "not found" }
```

You could also call `return` early to create an early return and run the clean up.

## Async

To make an iterator asynchronous, change the iterator method to `Symbol.asyncIterator`, and the `next` method to be asynchronous. For example, maybe we would want to call an API to do the translations.

```ts {4,8}
class Translation {
	// ...

	async next(): Promise<IteratorResult<string, Record<string, string>>> {
		// await fetch...
	}

	[Symbol.asyncIterator]() {
		return this;
	}
}
```

Then when iterating over the translation you can use a `for await...of` loop to unwrap the `next` promise with each iteration.

```ts
const translation = new Translation(["hello", "goodbye", "asdf"]);

for await (const word of translation) console.log(word);
```

## Generators

Generator functions provide an easier way to construct an iterable iterator. Let's recreate our translation with a generator function.

```ts {12,16}
const dict = new Map([
	["hello", "hola"],
	["goodbye", "adios"],
	// ...
]);

function* translate(words: string[]) {
	const values: Record<string, string> = {};

	for (const word of words) {
		const value = dict.get(word) ?? "not found";
		yield value;
		values[word] = value;
	}

	return values;
}

const translation = translate(["hello", "goodbye", "asdf"]);

for (const word of translation) console.log(word);
```

As you can see, generators greatly reduce the amount of code needed to create an iterable iterator! Instead of writing a `next` function, the generator `yield`s each translated value. Instead of the `return` function, the `values` simply returned. There is also no clean up required since `values` is recreated with each call to `translate`.

I'd recommend using a generator to create an iterable whenever possible, they will reduce the amount of code you have to write and make your code much more readable.

## Merging iterables

If you have many iterables you need to combine into one there are various ways to accomplish this. Here are two methods for synchronous and asynchronous that also include the final `return` value when `done` is `true`.

### Synchronous

For synchronous iterables, it's fairly straightforward. You can iterate through each iterable and yield the result with a generator function.

```ts
function* mergeSync<T, R>(...iterables: Iterable<T, R>[]) {
	for (const iterable of iterables) {
		const iterator = iterable[Symbol.iterator]();

		let result;
		while (true) {
			yield (result = iterator.next());
			if (result.done) break;
		}
	}
}
```

### Asynchronous

In order to effectively combine async iterables, we need to ensure they execute in parallel, returning the fastest promise from each one as they all resolve.

I've adapted a few different [stack overflow answers](https://stackoverflow.com/questions/50585456/how-can-i-interleave-merge-async-iterables) into this function that has worked for me that merges `AsyncGenerators`.

```ts
const next = async <T, R>(iterator: AsyncIterator<T, R>, index: number) => ({
	index,
	result: await iterator.next(),
});

/**
 * Merges `AsyncGenerator[]` into a single `AsyncGenerator`, resolving all in parallel.
 * The return of each `AsyncGenerator` is yielded from the generator with `done: true`.
 *
 * @param generators Resolved in parallel.
 * @param r Passed into each `iterator.return()`
 * @yields `IteratorResult` and `index` of the resolved generator.
 */
export async function* merge<T, R>(generators: AsyncGenerator<T, R>[], r: R) {
	// get the `Iterator` from each `AsyncGenerator`
	const iterators = generators.map((gen) => gen[Symbol.asyncIterator]());
	// create a map of active promises that return the result and the index
	// using the `next` function above
	const promises = new Map<number, Promise<any>>();

	iterators.forEach((iterator, index) =>
		promises.set(index, next(iterator, index)),
	);

	// current result
	let current: Awaited<ReturnType<typeof next>>;

	try {
		while (promises.size > 0) {
			yield (current = await Promise.race(promises.values()));

			if (current.result.done) {
				promises.delete(current.index);
			} else {
				promises.set(
					current.index,
					next(iterators[current.index]!, current.index),
				);
			}
		}
	} finally {
		for (const iterator of iterators) {
			// catch - could have already returned
			iterator.return(r).catch(() => {});
		}
	}
}
```

## Conclusion

JavaScript iterables help you write clean and efficient code. In this guide, you’ve seen how built-in iterables like arrays and sets work, learned to verify if a value is iterable, built your own custom iterable, and learned how to merge synchronous and asynchronous sources.

Thanks for reading!
