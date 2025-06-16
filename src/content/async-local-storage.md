---
title: Async Local Storage
description: Learn how to make use of AsyncLocalStorage in server-side JavaScript applications.
keywords: JavaScript, TypeScript, Node
date: 2025, 06, 12
---

![YouTube Tutorial](yt:127Ws7IBLR4)

## About

[`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) is a Node class that allows you to create an asynchronous context that can be accessed anywhere throughout your application. It has a `run` method that you can use to ensure the context stays local the function that it is called in.

For me, it was hard to understand without seeing an implementation so here's my attempt to explain.

## Framework implementations

A variety of server frameworks now use `AsyncLocalStorage` to create convenient helper functions that feel like magic.

### Next

For example, [Next](https://nextjs.org/) stores the request context within `AsyncLocalStorage` to create functions like [`after`](https://nextjs.org/docs/app/api-reference/functions/after).

Here's a snippet from their [documentation](https://nextjs.org/docs/app/api-reference/functions/after#platform-support) showing how serverless platforms can integrate it:

```ts
import { AsyncLocalStorage } from "node:async_hooks";

const RequestContextStorage = new AsyncLocalStorage<NextRequestContextValue>();

// Define and inject the accessor that next.js will use
const RequestContext: NextRequestContext = {
	get() {
		return RequestContextStorage.getStore();
	},
};

globalThis[Symbol.for("@next/request-context")] = RequestContext;

const handler = (req, res) => {
	const contextValue = { waitUntil: YOUR_WAITUNTIL };
	// Provide the value
	return RequestContextStorage.run(contextValue, () => nextJsHandler(req, res));
};
```

### SvelteKit

SvelteKit recently added the [`getRequestEvent`](https://svelte.dev/docs/kit/app-server#getRequestEvent) function that utilizes `AsyncLocalStorage` under the hood as well.

This enables you to access things on the `event` object like their optimized `fetch` without having to pass it down from the load function. This will be particularly useful in Svelte's new async components, since you could get the event within a deeply nested component and reuse the component anywhere without having to [prop drill](https://react.dev/learn/passing-data-deeply-with-context#the-problem-with-passing-props).

```ts
import { getRequestEvent } from "$app/server";

// no need to pass the `event` from `load`
const fn = () => {
	const { fetch } = getRequestEvent();
};
```

## Support

Support is great in popular server-side JavaScript runtimes with support in Node, Cloudflare, Deno, Bun, Vercel Edge Runtime and more.

At the current time, `AsyncLocalStorage` is not supported in the browser or in web containers, so it will not work on platforms like StackBlitz.

## Example

Here's a bare bones example of how you can use `AsyncLocalStorage` on a web server to store the current `Request` and make it easy to access in deeply nested functions.

### Without

Without `AsyncLocalStorage` if you want to access something on the request, you'll need to pass it down as an argument to whatever function needs it. This can quickly grow tedious in large application with deeply nested functions or components.

Here's a server that does an async task and then returns the current pathname as a `Response`. `req` is passed down to `getPathname` as an argument through each function between `fetch` and `getPathname`---in this case, `handler`. In practice, there could be many more functions as intermediaries that need to pass the request without modifying it.

```ts {2,3,7,9,13,14}
export default {
	async fetch(req: Request) {
		return handler(req); // pass to handler
	},
};

const handler = async (req: Request) => {
	await promise;
	const pathname = getPathname(req); // pass to getPathname
	return new Response(pathname);
};

const getPathname = (req: Request) => {
	const url = new URL(req.url); // use the argument
	return url.pathname;
};
```

At first glance, you might think you can assign the request to a global variable, and then use that variable where you need it.

```ts {1,5,17}
let globalRequest: Request; // global variable to store

export default {
	async fetch(req: Request) {
		globalRequest = req; // set at the start of the request
		return handler();
	},
};

const handler = async () => {
	await promise;
	const pathname = getPathname();
	return new Response(pathname);
};

const getPathname = () => {
	const url = new URL(globalRequest.url); // access the global variable
	return url.pathname;
};
```

There is a problem with this implementation: if multiple requests are being processed at the same time, the request will be overwritten with each new request. If one request is awaiting `promise` while another comes in, it will return the pathname of the second request.

### Implementation

`AsyncLocalStorage` provides a per-request solution for this exact problem with it's `run` method.

```ts {1-10,14-17,28}
import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<Request>();

// helper to get request anywhere within the scope of the `run`
const getRequest = () => {
	const req = asyncLocalStorage.getStore();
	if (!req) throw ReferenceError("Accessed outside of the run context.");
	return req;
};

export default {
	async fetch(req: Request) {
		// run with the current request as the context
		return asyncLocalStorage.run(req, () => {
			return handler(); // run forwards the result
		});
	},
};

const handler = async () => {
	await promise;
	const pathname = getPathname();
	return new Response(pathname);
};

const getPathname = () => {
	const req = getRequest(); // no need to pass the request down in an argument
	const url = new URL(req.url);
	return url.pathname;
};
```

Using the `req` as the first argument of `run` makes it available in `AsyncLocalStorage` within the scope of the function passed into the second argument---in this case, `handler`.

You can see how this might be useful, now `getPathname` can be called in any function or component within the scope of the run. If you have a component that uses the pathname and you need to use it in a variety of places, you don't need to prop drill the request object to it, just call the component where you need it!
