---
title: Fast Response Times with ETags
description: How to use ETags in server-side JavaScript to speed up your website.
keywords: etag, javascript, performance, cache
date: 2024, 10, 08
---

## Caching basics

When creating a web application, a common performance optimization is to save many of the files that are required to run your application on users' devices so that the next time they visit the page it will load faster. This is called caching, you can [open your browser cache](https://developer.chrome.com/docs/devtools/storage/cache) and see all of the different assets that have been saved to your computer.

For each `Response` sent from your application, you can set [`headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers) in the `Response` that tell the browser to cache the request in various ways.

### Linked assets

Many assets such as JS and CSS can be cached for a long time since they have a unique hashed filenames that are generated during the build. These assets are requested indirectly by the client---for example via `<link>` or `<script>` tags---after the initial HTML response is received.

A linked stylesheet might look like this.

```html {10}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>etag</title>
		<link
			rel="stylesheet"
			crossorigin
			href="/_immutable/assets/main.Cs4aW6Ww.css"
		/>
	</head>
	<body>
		...
	</body>
</html>
```

Each time the CSS file is updated, a new hash will be generated for the file using its content. The client will always make the request to the correct, newest asset, since the link is provided in the HTML.

These assets are often all output during the build process into an `immutable/` directory and served with immutable cache headers.

```json
{ "Cache-Control": "public, immutable, max-age=31536000" }
```

By doing this, users only ever have to download these assets once, they are saved to their computer for up to a year and loaded from the cache in subsequent requests.

### HTML

One response that generally cannot have a hashed URL is the HTML response. Users need to be able to navigate to the same URL and always receive the most up to date HTML page. You wouldn't want to have to send a new link to your users every time you updated your website!

This response can still be sped up by using [ETags (entity tags)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag). Etags allow you to check if the file has been modified since the last time it was requested. If it hasn't, you can just send a small response saying that it is the same as last time, instead of sending the entire response again.

## ETag Tutorial

<drab-youtube aria-label="YouTube Tutorial" uid="xdmHEamUtA0">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

In this tutorial, I'll show you how to implement ETags to speed up an HTML response. I'm going to be using [domco](https://domco.robino.dev), but this example can be used in any server-side JavaScript framework that supports setting custom headers on a response.

Run `npm create domco@latest` to get a similar template as the one in this tutorial. The final example can be found in [this repository](https://github.com/rossrobino/domco-examples/tree/main/apps/etag) as well.

Here's an example of sending a HTML response without an ETag.

```ts
import { html } from "client:page";
import type { Handler } from "domco";

export const handler: Handler = (req) => {
	return new Response(html, {
		headers: {
			"Content-Type": "text/html",
		},
	});
};
```

Currently, this response requires `Response.body`---the `html`---to be sent over the network with each request.

## Creating a hash

The first step to utilizing ETags is to find a hashing algorithm to use to create the tag and to check if the content has changed.

Since ETags will often be generated on every request, it's important to choose an efficient method to create a unique, consistent hash. The hash must produce the same output, given the same input, in order to understand if the content has changed since the last time the hash was created. So methods like using the current time will not work if the ETag is generated for each request, since the time will be different each time the function is run.

### Framework examples

Here's how a variety of popular frameworks generate ETags, I've linked to the code where the ETag is created. All of these methods have proved to work well in widespread production use.

- [sirv](https://github.com/lukeed/sirv/blob/50b1964b8a8342e14a711d47f793298c2a7aeeb7/packages/sirv/index.js#L113) uses a combination of the file size and the last modified time. This works great for static assets, but it won't work if you are generating a string of HTML dynamically since there is no file to read.
- [Next.js](https://github.com/vercel/next.js/blob/8cbabd3931ac3670947a8fa659bb4eccca47231d/packages/next/src/server/lib/etag.ts#L46) and [Astro](https://github.com/withastro/astro/blob/bb6d37f94a283433994f9243189cb4386df0e11a/packages/astro/src/assets/utils/etag.ts) both use the same FNV-1a algorithm from this [fnv-plus project](https://github.com/tjwebb/fnv-plus).
- [SvelteKit](https://github.com/sveltejs/kit/blob/25d459104814b0c2dc6b4cf73b680378a29d8200/packages/kit/src/runtime/hash.js) uses a JavaScript implementation of the [DJB2 algorithm](http://www.cse.yorku.ca/~oz/hash.html).
- [Hono](https://github.com/honojs/hono/blob/31b4cd414c258db841cce77473615c13fc611d8b/src/middleware/etag/index.ts#L66) uses the [SHA1](https://github.com/honojs/hono/blob/31b4cd414c258db841cce77473615c13fc611d8b/src/utils/crypto.ts#L19) algorithm via the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest). The [etag](https://github.com/jshttp/etag/blob/36e457a99da03db227701276c15255ee3fbf96bb/index.js#L47) package (used in Express) also uses SHA1 via the [Node Crypto API](https://nodejs.org/api/crypto.html).

### DJB2

I'm going to use the DJB2 algorithm from SvelteKit for this tutorial, [I modified it to use TypeScript](https://gist.github.com/rossrobino/2ac79c99d79bc6f3798d4bfba0173a25).

## Sending the ETag to the client

Next, we can create an ETag using the HTML string, and send it to the client in a response header along with the HTML.

```ts {6,13}
import { html } from "client:page";
import type { Handler } from "domco";

export const handler: Handler = (req) => {
	// surround the hash with double quotes
	const eTag = `"${djb2(html)}"`;

	return new Response(html, {
		headers: {
			// other headers should remain the same
			"Content-Type": "text/html",
			// send it as the "Etag" header
			ETag: eTag,
		},
	});
};
```

Now, the client's browser will automatically send this hash back in subsequent requests in the `If-None-Match` header.

```ts {6}
import { html } from "client:page";
import type { Handler } from "domco";

export const handler: Handler = (req) => {
	// hash is sent back in this header
	console.log(req.headers.get("If-None-Match")); // ex: "1wnhp22"

	const eTag = `"${djb2(html)}"`;

	return new Response(html, {
		headers: {
			"Content-Type": "text/html",
			ETag: eTag,
		},
	});
};
```

## Check for changes

You can check if the content is still the same as what the user has by comparing their hash, to the one you are currently generating.

If the content hasn't been modified, we can send `null` instead of sending the content again, with a [`304` status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) to tell the client that the response is `Not Modified`.

```ts {9,12,14}
import { html } from "client:page";
import type { Handler } from "domco";

export const handler: Handler = (req) => {
	const eTag = `"${djb2(html)}"`;

	// Check if the hash sent from the client matches the hash
	// generated. If it does, the content hasn't been modified.
	const notModified = eTag === req.headers.get("If-None-Match");

	// send `null` instead of the html in the body
	return new Response(notModified ? null : html, {
		// change the status to 304 - not modified
		status: notModified ? 304 : 200,
		headers: {
			"Content-Type": "text/html",
			ETag: eTag,
		},
	});
};
```

Now when the user refreshes the page, a much smaller response will be sent instead of the entire HTML page being sent over the network again.

## Conclusion

I hope this provides some insight into how you can speed up your web application with different caching techniques. For large HTML pages or for slow connections, ETags can really speed up the loading time of a website.

Thanks for reading!
