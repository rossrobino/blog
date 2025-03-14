---
title: Dynamic Import Best Practices
description: Performance, bundling, and optimal code loading strategies.
keywords: dynamic, javascript, import
date: 2025, 03, 14
---

## Static and dynamic imports

In JavaScript, there are two methods to import another JS module, _statically_, and _dynamically_.

Given the module `foo.js`,

```js
// foo.js
export const foo = {
	// a really big object!
};
```

`foo` can be imported statically,

```js {2}
// static.js
import { foo } from "./foo.js";

if (check) {
	console.log(foo);
}
```

or dynamically.

```js {3}
// dynamic.js
if (check) {
	const { foo } = await import("./foo.js");
	console.log(foo);
}
```

Static imports must be at the top level scope of the module, and will be ran first, regardless of if there is other code written before them.

Dynamic imports can be written in any asynchronous context, the import will not occur until the code is processed. In this example, if `check` is `false`, the import will not occur.

## Bundling

If you are using a bundler like Vite or Webpack when creating your project, it's important to be aware of how bundlers treat each of these imports.

Generally speaking (chunks can be created manually), code that is statically imported, will be bundled into a single file to reduce the number of imports that occur at runtime. The static example above would be bundled into something like this.

```js {2-4}
// static.js
const foo = {
	// placed inside of static.js
};

if (check) {
	console.log(foo);
}
```

On the other hand, dynamic import will remain. This ensures the module is only imported when it is needed. A _chunk_ will be created for the `foo.js` module.

```js
// foo-123.js
export const foo = {
	// still in a separate chunk
};
```

```js {3}
// dynamic.js
if (check) {
	const { foo } = await import("./foo-123.js");
	console.log(foo);
}
```

There is a cost to importing code---more memory usage and slower performance. Dynamic imports can be utilized to ensure only code that is needed is being processed. These optimizations can add up given the size of each module.

## Lazy loading

Say you are creating an app that runs on a node web server.

```js {1}
import { foo } from "./foo.js";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ hello: "world" }));

app.get("/foo", (c) => c.json(foo));
```

Here, with the static import, when the server first starts, `foo` is loaded in memory even when `/` is requested and `foo` is never used.

So, we can convert our code to use a dynamic import instead.

```js {8}
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ hello: "world" }));

app.get("/foo", async (c) => {
	const { foo } = await import("./foo.js");
	return c.json(foo);
});
```

Now, if `/` is requested first, the module will not be loaded. On the first request to `/foo`, the module is [loaded and cached](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#module_namespace_object), and then in subsequent requests to `/foo`, the cached value will be reused instead.

## Runtime considerations

### Server side

It's important to consider how your code is deployed before reaching for dynamic imports.

If you have a long running server that doesn't spin down and memory usage is not a concern, dynamic imports are probably less useful since the startup time will only occur once. You can import everything in the beginning and be ready for any request.

If you are in a serverless environment and your website doesn't have constant traffic, your server might not be "warm"---already started---when someone makes a request. This creates a "cold start". In this case, dynamic imports might help you mitigate the startup time if you can prevent loading code that isn't needed.

### Client side

On the client, when an HTML file is sent with script tags linked to it, it will immediately parse the scripts needed and request them as it loads the page. For scripts that are dynamically imported, this will not occur. The URL is instead inside of the JavaScript file, to be discovered at runtime. The browser will then make a request for that asset over the network and import it.

Since this can create a waterfall of client-side requests, users can add a `<link>` tag with the `rel=modulepreload` attribute to let the browser know to fetch the script in advance, but not import it yet.

```html
<link rel="modulepreload" href="./foo-123.js" />
```

## Conclusion

Dynamic imports offer an effective way to enhance application performance by loading code only when necessary. By comparing static and dynamic imports, developers can make informed decisions to balance initial load times with resource efficiency. Thanks for reading!
