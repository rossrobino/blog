---
title: Optimize JavaScript Performance
description: Common performance optimizations and pitfalls.
keywords: javascript, performance
date: 2025, 02, 15
draft: true
---

<!-- <drab-youtube aria-label="YouTube Tutorial" uid="">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube> -->

## How to test

### performance.now

Whether you are in the browser or a server runtime like Node, you can use the `performance.now()` method to mark the current time in milliseconds since the start of the process. This is a quick way to get an idea of how long something is taking to occur.

```js
const start = performance.now();

// do something

const time = performance.now() - start;
```

### Benchmarking tools

If you are really wanting to understand the performance of different operations, I would recommend using a benchmarking tool. I'm going to be using [mitata](https://github.com/evanwashere/mitata) for the tests in this post. mitata will run the code you are benchmarking many times and provide a summary of the average execution time for you.

Another site I like to use is for quick testing in the browser is [perf.link](https://perf.link).

## awaiting in a loop

A common optimization that can be made in JavaScript is doing asynchronous tasks concurrently instead of sequentially. While JavaScript is run sequentially, any work that has latency can be done off of the main thread concurrently so the latency time can overlap.

### Benchmarking

#### Sequential

We can compare the difference in this benchmark. In the `sequential` function, we are using `await` directly within the loop.

```ts {14-15}
import { run, bench, boxplot } from "mitata";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const files = await readdir(".", { withFileTypes: true, recursive: true });

const sequential = async () => {
	const content: Map<string, string> = new Map();

	for (const file of files) {
		if (file.isFile()) {
			const filePath = join(file.parentPath, file.name);
			// await within the loop
			const text = await readFile(filePath, "utf-8");
			content.set(filePath, text);
		}
	}
};
```

#### Concurrent

In the `concurrent` function, we create an array of promises (you can also use `Array.map`) that get queued and resolved together using `Promise.all`.

```ts {5,12-15,18,23}
const concurrent = async () => {
	const content: Map<string, string> = new Map();

	// create an array of tasks
	const tasks: Promise<void>[] = [];

	for (const file of files) {
		if (file.isFile()) {
			const filePath = join(file.parentPath, file.name);

			// create an async task, does not resolve immediately
			const task = async () => {
				const text = await readFile(filePath, "utf-8");
				content.set(filePath, text);
			};

			// push into array
			tasks.push(task());
		}
	}

	// resolve tasks in parallel
	await Promise.all(tasks);
};
```

#### Result

For reading 28 files, we can see the async concurrent function was over twice as fast as the async sequential function.

```txt
benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
sequential                   907.09 µs/iter 925.46 µs    ▆█▅▆▂
                      (825.42 µs … 1.20 ms)   1.08 ms ▁▃▇██████▆▅▃▂▂▃▂▁▂▁▁▁
                  gc(937.67 µs …   2.50 ms) 201.44 kb ( 38.22 kb…676.49 kb)

concurrent                   389.95 µs/iter 407.79 µs       ▇▇█▇▆▃▄▃
                    (314.96 µs … 498.54 µs) 474.92 µs ▁▁▂▄▄█████████▅▄▃▂▂▁▂
                  gc(948.63 µs …   2.22 ms) 200.79 kb ( 34.27 kb…832.88 kb)

                             ┌                                            ┐
                                                           ╷  ┌─┬┐        ╷
                  sequential                               ├──┤ │├────────┤
                                                           ╵  └─┴┘        ╵
                             ╷  ┌┬┐   ╷
                  concurrent ├──┤│├───┤
                             ╵  └┴┘   ╵
                             └                                            ┘
                             314.96 µs          698.27 µs           1.08 ms
```

Here's a visualization of what takes place when you utilize `Promise.all` to resolve promises concurrently.

![sequential vs concurrent](/images/optimize-js-perf/seq-vs-con.png)

## Asynchronous overhead

Let's run the same benchmark using `readFileSync` instead of the asynchronous `readFile`.

```ts
import { readFileSync } from "node:fs";

const sync = async () => {
	const content: Map<string, string> = new Map();

	for (const file of files) {
		if (file.isFile()) {
			const filePath = join(file.parentPath, file.name);
			const text = readFileSync(filePath, "utf-8");
			content.set(filePath, text);
		}
	}
};
```

```txt
benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
sequential                   916.75 µs/iter 934.13 µs    ▃███
                      (845.79 µs … 1.15 ms)   1.08 ms ▃▅███████▆▅▄▂▂▂▂▁▁▂▁▂
                  gc(929.46 µs …   2.52 ms) 200.79 kb ( 26.68 kb…676.45 kb)

concurrent                   382.99 µs/iter 399.13 µs    ▃█▇█▆▇▃
                    (326.83 µs … 546.21 µs) 486.96 µs ▂▃█████████▅▅▄▃▃▂▁▁▁▁
                  gc(964.88 µs …   2.76 ms) 197.98 kb ( 28.51 kb…512.99 kb)

sync sequential              185.60 µs/iter 185.33 µs  █
                    (177.00 µs … 404.33 µs) 271.08 µs ▄██▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(950.38 µs …   3.33 ms)  23.38 kb ( 20.23 kb…150.61 kb)

                             ┌                                            ┐
                                                              ╷ ┌─┬┐      ╷
                  sequential                                  ├─┤ │├──────┤
                                                              ╵ └─┴┘      ╵
                                    ╷ ┌┬┐   ╷
                  concurrent        ├─┤│├───┤
                                    ╵ └┴┘   ╵
                             ┬    ╷
             sync sequential │────┤
                             ┴    ╵
                             └                                            ┘
                             177.00 µs          627.98 µs           1.08 ms
```

When using Node, `readFileSync` is actually faster than using `readFile` concurrently! What is going on? If we take a look at the performance inspector we can better understand what is happening in the background.

### sync

The synchronous read is fairly straightforward, each read occurs in succession.

![sync read](/images/optimize-js-perf/sync-read.png)

### async

You can see the asynchronous read is more complicated, note the idle time when we are waiting for C++ to to process code.

![async read](/images/optimize-js-perf/async-read.png)

There are extra tasks that take place whenever asynchronous operations are executed, including running callbacks, handoffs that take place between JavaScript and C++ (in Node), [different memory management](https://github.com/nodejs/performance/issues/151#issuecomment-1994145240) solutions, and more.

So, `readFileSync` might look something like this.

![sync vs concurrent](/images/optimize-js-perf/sync-vs-con.png)

### Runtime differences

There are also differences between runtimes. Here are the results of running the same benchmark using [Bun](https://bun.sh/) instead of Node.

```txt
benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
sequential                   344.41 µs/iter 331.08 µs  █
                      (282.71 µs … 1.17 ms) 739.50 µs ▃██▃▁▁▁▁▁▁▁▁▁▁▁▂▂▁▁▁▁
                  gc(407.58 µs …   1.48 ms)   1.89 kb (  0.00  b…192.00 kb)

concurrent                   143.67 µs/iter 144.38 µs  █▅▃
                    (103.00 µs … 502.92 µs) 389.88 µs ████▄▂▁▁▁▁▁▁▁▁▁▁▁▁▂▂▁
                  gc(363.38 µs … 981.88 µs) 489.24  b (  0.00  b…112.00 kb)

sync sequential              158.11 µs/iter 158.63 µs   █▃
                    (146.96 µs … 386.29 µs) 215.00 µs ▂▇██▅▃▂▂▂▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(375.75 µs … 728.67 µs)  11.17  b (  0.00  b… 16.00 kb)

                             ┌                                            ┐
                                          ╷┌──┬                           ╷
                  sequential              ├┤  │───────────────────────────┤
                                          ╵└──┴                           ╵
                             ╷┌─┬                ╷
                  concurrent ├┤ │────────────────┤
                             ╵└─┴                ╵
                                ╷┬   ╷
             sync sequential    ├│───┤
                                ╵┴   ╵
                             └                                            ┘
                             103.00 µs         421.25 µs          739.50 µs
```

In Bun's case, the concurrent run is the fastest on average.

### Which is best?

All of this to say, there isn't a one size fits all solution---the right method could even depend on your runtime! The performance also depends on the size of the files and the number of files being read. Once you are reading enough files at the same time, the performance benefit of using asynchronous methods concurrently becomes more obvious.

If you are creating a web server that runs asynchronously, you should use the asynchronous `readFile` so you do not block other requests that come in.

If you are making a CLI tool and reading one file that should block operations until it is read, it's probably safe to use `readFileSync` instead and avoid the overhead of asynchronous execution.

### Best practice

When you have a variable that could be a promise that you need to await, or could be the actual value, it's a best practice to check if the value is a promise before `await`ing it.

```ts {5}
type MaybePromise<T> = T | Promise<T>;

const noCheck = async (a: MaybePromise<number>, b: MaybePromise<number>) => {
	// no check, awaited either way
	return (await a) + (await b);
};
```

```ts {3-4}
const check = async (a: MaybePromise<number>, b: MaybePromise<number>) => {
	// await only if the values are promises
	if (a instanceof Promise) a = await a;
	if (b instanceof Promise) b = await b;

	return a + b;
};
```

Here are the results of running the test if one of the arguments is a `number` instead of a `Promise<number>`.

```txt
benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
noCheck                      135.51 ns/iter 135.50 ns  █▄
                    (129.35 ns … 193.94 ns) 168.41 ns ▄██▇▃▂▂▂▁▂▂▂▁▁▁▁▁▁▁▁▁
                  gc(913.58 µs …   6.73 ms) 942.89  b (800.97  b…  1.13 kb)

check                         99.78 ns/iter  99.44 ns ▂█
                     (96.34 ns … 158.85 ns) 130.93 ns ███▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
                  gc(921.92 µs …   2.31 ms) 694.53  b (536.94  b…845.83  b)

                             ┌                                            ┐
                                                  ╷┌─┬                    ╷
                     noCheck                      ├┤ │────────────────────┤
                                                  ╵└─┴                    ╵
                             ╷┌┬                   ╷
                       check ├┤│───────────────────┤
                             ╵└┴                   ╵
                             └                                            ┘
                             96.34 ns          132.38 ns          168.41 ns
```

Here's a full comparison based on the arguments passed in.

| Argument types                       | Comparison            |
| ------------------------------------ | --------------------- |
| `number`, `number`                   | `check` is 58% faster |
| `number`, `Promise<number>`          | `check` is 26% faster |
| `Promise<number>`, `Promise<number>` | `check` is 1% slower  |

Checking to see if the value is a promise took about 1ns, while awaiting a value that is not a promise took around 36ns.

## Maps

## WeakMap

## Sets

## Array method chaining

## Conclusion

I enjoy knowing that I am writing the most optimal code possible. While some of these examples should be implemented in any code you might write, others are micro-benchmarks and are less important.
