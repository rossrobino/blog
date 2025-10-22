---
title: The State of JavaScript Server Frameworks
description: An overview of modern backend JS frameworks and their features.
keywords: javascript, router, web server, http, middleware, regular expression, trie
date: 2025, 10, 22
---

## Frameworks

Here's an overview of some modern options for backend JavaScript server frameworks. I've tried to include frameworks that use **code-based (not file based) routing** that do not require a bundler like Vite or Webpack. So options such as Next, Nuxt, SvelteKit are not included.

In this article, I'll outline the basic components of these frameworks and differentiators. I hope this helps people decide which modern backend framework best suits their needs and programming style.

> If you have a correction, or see a missing framework you want added to this list, please [submit an issue or PR](https://github.com/rossrobino/blog/blob/main/src/content/js-server-frameworks.md)!

<drab-tablesort content="tbody" trigger="th">

| Framework                                                                   | Platform | Creator                                                                                          | Matcher                                                                | Middleware | Details                                                            |
| --------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| [Koa](https://koajs.com/)                                                   | Node     | [TJ Holowaychuk](https://github.com/tj), Express team                                            | regex - [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) | Compose    | Express successor; popularized await next() middleware             |
| [Fastify](https://fastify.dev/)                                             | Node     | [Matteo Collina](https://github.com/mcollina), [Tomas Della Vedova](https://github.com/delvedor) | trie - [`find-my-way`](https://github.com/delvedor/find-my-way)        | Hooks      | Created by Node maintainers, JSON Schema validation, plugin system |
| [Polka](https://github.com/lukeed/polka)                                    | Node     | [Luke Edwards](https://github.com/lukeed)                                                        | regex - [`trouter`](https://github.com/lukeed/trouter)                 | Chain      | Very small Express alternative                                     |
| [H3](https://h3.dev/)                                                       | Fetch    | [Pooya Parsa](https://github.com/pi0), unjs team                                                 | trie - [`rou3`](https://github.com/h3js/rou3)                          | Compose    | Core of Nitro/Nuxt server, cross-platform                          |
| [Hono](https://hono.dev/)                                                   | Fetch    | [Yusuke Wada](https://github.com/yusukebe)                                                       | regex & trie                                                           | Compose    | Tiny, fast, cross-platform, middleware ecosystem                   |
| [itty-router](https://itty.dev/itty-router/)                                | Fetch    | [Kevin R Whitley](https://github.com/kwhitley)                                                   | regex                                                                  | Chain      | Ultra-small router                                                 |
| [Elysia](https://elysiajs.com/)                                             | Fetch    | [SaltyAom](https://github.com/saltyaom)                                                          | trie - [`memoirist`](https://github.com/SaltyAom/memoirist)            | Hooks      | Bun-optimized, strong schema typing, plugin support                |
| [Remix](https://github.com/remix-run/remix/tree/main/packages/fetch-router) | Fetch    | [Michael Jackson](https://github.com/mjackson), Remix team                                       | regex & trie                                                           | Compose    | Full featured router for Remix, supports full URL matching         |
| [ovr](https://ovr.robino.dev)                                               | Fetch    | [Ross Robino](https://github.com/rossrobino)                                                     | trie                                                                   | Compose    | Built for streaming HTML and building CRUD applications.           |
| [Oak](https://oakserver.org/)                                               | Fetch    | [Kitson Kelly](https://github.com/kitsonk)                                                       | regex - [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) | Compose    | Deno’s mainstream server framework                                 |

</drab-tablesort>

<e-chart chart-name="server-framework-stars"></e-chart>

> This chart shows the total number of npm downloads between 2024-10-20 and 2025-10-20 and the approximate GitHub stars on 2025-10-20. Downloads is not the best popularity metric particularly for the Oak framework as it is Deno first and Deno does not default to npm. Remix's `fetch-router` is also a brand new package for Remix v3, separate from Remix v2.

## Routing

There are two popular matching strategies used in most modern frameworks, [**regular expression**](https://en.wikipedia.org/wiki/Regular_expression) and [**trie**](https://en.wikipedia.org/wiki/Trie) based. In addition, each router has specific implementation details. For example in Elysia, a new trie is created for each HTTP method. Routers also can have [multiple matching strategies](https://github.com/remix-run/remix/tree/main/packages/route-pattern/src/lib) users can choose from, or [automatically](https://hono.dev/docs/concepts/routers#smartrouter) switch between based on the application's added routes.

### Regular expression

Regular expression based routers first convert the route's pattern into a regular expression that a URL can be matched to. Perhaps the most well known package for this conversion is [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp), there's also the lighter weight [`regexparam`](https://github.com/lukeed/regexparam).

| Pattern    | Regular Expression      | Matched URL         |
| ---------- | ----------------------- | ------------------- |
| `/users/*` | `/^\/users\/(.*)\/?$/i` | `/users/rossrobino` |

Most framework implementations take each pattern entered by the user, and compile them into their corresponding regular expressions. Then when a request is received, they loop over the compiled regular expressions and test the request's URL against each one until a match is found.

Looping over these expressions is generally very fast up front, but performance can degrade as you add more routes. More patterns will be iterated over before hitting the match as users add more into routes to their application.

> [Hono's `RegExpRouter`](https://hono.dev/docs/concepts/routers#regexprouter) addresses this shortcoming by compiling all of the routes into a single massive regular expression, this is a great differentiator for Hono's router.

Regular expression routers are great for fast startup performance and dynamically routing capabilities.

### Trie

Trie (pronounced _try_) based matchers construct a tree of nodes containing the segments of the route pattern. For example, the pattern `/users/*` could be broken into four nodes: `/`, `users`, `/`, and `*`. A popular trie based routing package is [`find-my-way`](https://github.com/delvedor/find-my-way) that is used within Fastify.

For each request, the router takes the URL and breaks it into segments and traverses the tree for the match. The links between nodes are contained in a map---so each lookup is constant. For example, `/users/rossrobino` could be broken into `/`, `users`, `/`, and `rossrobino`. In this case, each segment would match the corresponding node since `*` matches anything. But `/nope` would not be found, `/` would match the first node, but `nope` would not be contained in the map.

Commonly, the [radix trie](https://en.wikipedia.org/wiki/Radix_tree) is used for web servers, it further optimizes the data structure to only create new nodes when required. For example, `/dashboard/home` and `/dashboard/insights` might be added. Instead of splitting the pattern into segments, only three nodes need to be created to account for these patterns: `/dashboard/`, `home`, and `insights`, with the latter nodes holding the store for each match.

Trie data structures are ideal for larger applications since the lookup time does not increase as you add more patterns. It's also a more flexible approach since the matching is done in JavaScript code instead of a regular expression, so more pattern types are often supported in trie routers. Remix's new `fetch-router` [supports matching the entire URL](https://github.com/remix-run/remix/tree/main/packages/route-pattern#examples)!

The disadvantages of using a trie structure are startup performance and the ability to dynamically add routes. It takes time to _construct_ the trie based on all the user's route patterns, and the trie must be modified if a new pattern is dynamically added after the initialization since a new node might break up existing ones.

## Middleware

_Middleware_ and _handler_ are common terms used for the code that users write to handle requests within the framework. Middleware can be composed together in various ways including in a chain, using a composition function, or using hooks.

### Chain

The simplest form of middleware is a linear chain. Popularized by [`connect`](https://github.com/senchalabs/connect?tab=readme-ov-file#use-middleware) (used in Express), it allows users to create a stack of middleware and call the `next` one in the stack.

```ts
import express from "express";

const app = express();

app.use((req, res, next) => {
	console.log(1);

	res.on("finish", () => {
		console.log(3); // after res.send
	});

	next(); // calls the next middleware

	// code here runs immediately, doesn't guarantee `next` is executed before
});

app.get("/", (req, res) => {
	console.log(2);
	res.send("Response");
});
```

This method works well, it's easy to understand what code is running when during each request. The primary limitation of this API is that users cannot access the response from middleware after the `next` function has ran since each middleware is synchronous. Instead, events like `finish` can be listened for.

### Compose

Most of the modern routers listed above have middleware based on the [`@koa/compose`](https://github.com/koajs/compose) API. Composing middleware with async/await marked the third major iteration of middleware design by the Express/Koa team, succeeding `connect` and [generator based](https://github.com/koajs/convert?tab=readme-ov-file#usage) middleware previously used in Koa. This was made possible with the `async` and `await` language features added in `ES2015`.

```ts
import Koa from "koa";

const app = new Koa();

app.use(async (c, next) => {
	console.log(1);
	await next(); // dispatches the next middleware - in this case `handler`
	console.log(3); // after `handler` runs
});

app.use((c) => {
	console.log(2); // runs before 3
	c.body = "Response";
});
```

This flexible design allows you to easily compose middleware together, and coordinate the flow of each function without having to listen for events and use callbacks.

### Hooks

Another alternative to coordinate what actions are taken on each request is event based middleware or _hooks_. Elysia is a great example of using [lifecycle events](https://elysiajs.com/essential/life-cycle.html#lifecycle) instead of composing middleware. It has events like `onRequest`, `beforeHandle`, and `afterResponse` that users can hook into and execute code at the right time within the lifecycle.

Here's an example of Elysia's `beforeHandle` and `afterHandle` events:

```ts
import { Elysia } from "elysia";

const app = new Elysia();

app.get(
	"/",
	() => {
		console.log(2);
		return "Response";
	},
	{
		beforeHandle() {
			console.log(1);
		},
		afterHandle() {
			console.log(3);
		},
	},
);
```

## Platform

When it comes to servers, NodeJS is the most popular and considered the standard JavaScript server runtime to use. Because of this, other newer server runtimes like Bun, Deno, and Cloudflare Workers try to be compatible with most of the Node built-in server side APIs like `node:http`.

All of this to say, most of these frameworks _should_ be compatible with Node, Deno, and Bun runtimes either natively or through adapters. Be sure to check each framework's documentation for supported platforms. Frameworks like Hono and H3 prioritize cross-platform compatibility which makes them flexible options to use if you need to change your runtime.

If you are coming from frontend and are familiar with the web `Request` and `Response` objects, then it probably makes sense to use a Fetch based framework on the backend so you don't need to learn two APIs.

### Node

If you are using a Fetch based framework on Node, you'll need to convert the web standard `Request` and `Response` objects into their [Node alternatives](https://nodejs.org/api/http.html#class-httpclientrequest). Here are my favorite packages to accomplish this conversion with minimal overhead.

- [`srvx`](https://srvx.h3.dev/) (unjs)
- [`@remix-run/node-fetch-server`](https://github.com/remix-run/remix/tree/main/packages/node-fetch-server)
- [`@hono/node-server`](https://github.com/honojs/node-server)

### Fetch

Other runtimes including Bun, Deno, or Cloudflare Workers have standardized on an API for Fetch based servers, where you export a default object from the server entry point with a `fetch` method that adheres to the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). These runtimes will pick up this export and use it to start their web servers.

```ts
export default {
	fetch(request: Request) {
		return new Response("Hello World");
	},
};
```

Thanks to each project's Node compatibility, you can also import `node:http` and create a server using Node's APIs, this makes it possible to run Fastify on Bun for example.

## Build and development tooling

Node, Bun, and Deno now all provide built `--watch` modes and TypeScript support. You can simply run your `server.ts` entrypoint to start your server in development or production.

For deploying to a cloud infrastructure providers such as Vercel, Cloudflare, or Deno Deploy, you'll need to configure your server to be used within the target platform. There are a few projects that accomplish this for you and also provide integration with Vite for development and build time features.

- [`domco`](https://domco.robino.dev) - simple, lightweight full-stack solution
- [`nitro`](https://nitro.build) - supports almost any platform or runtime you can think of
- [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/get-started/) - first party solution for Cloudflare

## HTML templating

Some frameworks have built-in features or plugins to make it easier to render HTML dynamically. These features take care of things like escaping HTML without having to add a full UI framework.

[Hono](https://hono.dev/docs/guides/jsx#usage) and [ovr](https://ovr.robino.dev/03-app#jsx) both have built-in JSX import sources. This makes it easy to return JSX from an endpoint to generate HTML.

Another common helper many frameworks provide is an `html` function that uses tagged template literals. For example [Fastify](https://github.com/mcollina/fastify-html), [Hono](https://hono.dev/docs/helpers/html#html), and [Remix](https://github.com/remix-run/remix/tree/main/packages/fetch-router#html-responses-with-the-html-helper) all provide similar functions. Many editors support syntax highlighting within these strings as well.

## Communicating with the client

If you need to accept data from the client, you can do this either via JavaScript (for example `fetch`), or through HTML `<form>` submissions.

Some frameworks provide additional features and type safety for these communications. It's useful to be able to keep the frontend in sync with the backend for these types of requests. For example, if you change a route's pattern from `/post/:id` to `/posts/:slug`, it's nice to ensure every place where that route is requested in the client are still linked properly.

### Forms

ovr provides helpers to ensure that `<form>` elements always have the correct `method` and `action` attributes set based on the route's pattern.

```tsx
import { Get } from "ovr";

const page = new Get("/hello/:name", () => {
	return (
		// <form method="GET" action="/hello/world?search=param#hash">
		<page.Form
			params={{ name: "world" }}
			search={{ search: "param" }}
			hash="hash"
		>
			...
		</page.Form>
	);
});
```

### RPC

[Hono](https://hono.dev/docs/guides/rpc#client) and [Elysia](https://elysiajs.com/eden/overview.html#eden-treaty-recommended) provide minimal remote procedure call (RPC) clients you can use in combination with the server applications. These allow you to programmatically communicate with your server instead of manually writing `fetch("/posts/hello-world")` calls and parse the data manually.

Here's an RPC example from the Hono documentation:

```ts
// server
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";

const app = new Hono();

const route = app.post(
	"/posts",
	zValidator("form", z.object({ title: z.string(), body: z.string() })),
	(c) => {
		// ...

		return c.json({ ok: true, message: "Created!" }, 201);
	},
);

export type AppType = typeof route;
```

```ts
// client
import type { AppType } from ".";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:8787/");

const res = await client.posts.$post({
	form: { title: "Hello", body: "Hono is a cool project" },
});
```

In a real app, you would have the client code above within a form submit handler or some other user driven event.

## Performance

All of these frameworks are fast. If you are serving a large number of requests and need to consider performance here are some benchmarks people have done comparing some of these options with varying results.

If you are exclusively on Node and need to ensure you have the highest possible performance, choosing a Node framework like Fastify or Polka instead of a Fetch based one might be a good option.

- Web Frameworks Benchmark (be sure to note the runtime if you add more options)
  - https://web-frameworks-benchmark.netlify.app/compare?f=h3,express,hono-node,koa,fastify,polka
  - https://web-frameworks-benchmark.netlify.app/result?f=express,fastify,h3,hono-node,koa,polka
- [Hono Benchmarks](https://hono.dev/docs/concepts/benchmarks)
- [Bun HTTP Framework Benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark)

## Recommendations

Overall, I think **H3 and Hono are excellent all around options**. I prefer the composable middleware, and I'm more familiar with the Fetch API so I like frameworks built with these features. Both have great performance across platforms, and are widely used in production within large projects like Nuxt (H3) and within Cloudflare (Hono).

I'm partial to **ovr for templating**, I think it provides a nice balance of backend capabilities while making it easy to submit forms with JSX and built-in route helpers. ovr [makes it really simple](https://ovr.robino.dev/demo/todo) to scaffold type-safe, HTML first, CRUD applications.

Check out **Polka for Node specific projects** if you already are familiar with Node's HTTP module. It's fast, has a very small footprint, and has widespread usage like in SvelteKit's [`adapter-node`](https://svelte.dev/docs/kit/adapter-node). It's a nice [upgrade from Express](https://github.com/lukeed/polka?tab=readme-ov-file#comparisons) with minimal API changes.
