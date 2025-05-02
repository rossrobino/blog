---
title: DIY Streaming with Custom Elements
description: How to stream HTML to the client with vanilla JavaScript.
keywords: javascript, streaming, custom-elements
date: 2024, 10, 01
---

![YouTube Tutorial](yt:ArQqBo5gpd8)

## Overview

In this tutorial I'll show you how you can implement out of order streaming using vanilla JavaScript. Streaming can help speed up your website by enabling you to stream data from your server to the user after the initial paint, without the user having to make an extra request for additional data. With streaming, users can see information on your page and load other resources, before all the HTML has loaded.

I'm going to be using [domco](https://domco.robino.dev) for this example, but you can utilize any server framework that supports streaming. This server code uses the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) API, so it will look very similar to API routes in NextJS or SvelteKit. By running `npm create domco@latest` you can get a similar template to this post if you want to create your own.

If you want to see the final code, you can find it here in the [domco examples repository](https://github.com/rossrobino/domco-examples/tree/main/apps/streaming).

## Create an HTML template

First, create the HTML template. This template will be split into two chunks, one to send first which the user will see right away, and then another to send after the data has finished streaming. On the server this template will be split into two chunks using the `%stream%` identifier.

Also add in some target elements for the data to be streamed into.

```html
<!-- src/client/+page.html -->
<!-- START CHUNK -->
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Streaming</title>
	</head>
	<body>
		<main>
			<h1>Streaming</h1>

			<!-- streaming targets -->
			<div class="greeting">Loading greeting...</div>

			<div id="message">Loading message...</div>

			<load-data>Loading data...</load-data>

			<p>Streaming with a custom element</p>
		</main>

		<!-- custom elements will be streamed in here -->
		%stream%

		<!-- END CHUNK -->
	</body>
</html>
```

## `StreamHtml` custom element

Next create the `StreamHtml` [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements). This will be the vessel for our streamed data to arrive in. When the browser sees these elements come in it will immediately run the [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks) method. In this method, set the `innerHtml` of the target elements to the contents of the `html` attribute on the `StreamHtml` element.

```js
// src/client/stream-html.js
class StreamHtml extends HTMLElement {
	connectedCallback() {
		// selector for targets that needs the streamed data
		const selector = this.getAttribute("target") ?? "";

		document.querySelectorAll(selector).forEach((target) => {
			// set the target's html to the contents of the `html` attribute
			target.innerHTML = this.getAttribute("html") ?? "";
		});
	}
}

customElements.define("stream-html", StreamHtml);
```

## Create the request handler

On the server, instead of just sending the HTML directly, break it into a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of strings to send back as the [`Response.body`](https://developer.mozilla.org/en-US/docs/Web/API/Response/body). Send the first chunk of the HTML with the custom element script, and then send the second chunk at the end.

> Note: the custom element script needs to be render blocking (not `type=module`) so that it will execute before the HTML has finished streaming.

```ts
// src/server/+func.ts
import streamHtmlElement from "../client/stream-html?raw";
import { html } from "client:page";
import type { App } from "domco";

// import the raw text of the custom element to inline into a script tag
// (you could also just inline the string directly if you aren't using Vite)
const streamHtmlScriptChunk = `<script>${streamHtmlElement}</script>`;

export default {
	fetch(req) {
		// split html into two chunks
		const [startChunk, endChunk] = html.split("%stream%");

		// create a new stream of strings
		const body = new ReadableStream<string>({
			async start(controller) {
				// send the first chunk and the script tag
				controller.enqueue(startChunk + streamHtmlScriptChunk);

				// TODO: stream the custom elements

				// send the last chunk (other half of original html)
				controller.enqueue(endChunk);

				controller.close();
			},
		});

		// return the stream as the response body
		return new Response(body, { headers: { "Content-Type": "text/html" } });
	},
} satisfies App;
```

### Serialize HTML into the custom element

Next, create some helper functions to serialize the HTML into the `StreamHtml` custom element.

```ts
// serialize html into the StreamHtml custom element
const streamHtml = (target: string, html: string) =>
	`<stream-html target="${target}" html="${escape(html)}"></stream-html>`;

// since we put the html into a data attribute it must be escaped
const escape = (unsafe: string) =>
	unsafe
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
```

### Run loaders asynchronously

Finally, create some loaders to fetch data, in this example I'll use this `randomDelay` function to simulate latency, but in a real application these could be `fetch` calls or database queries that would each take a random amount of time.

Altogether, the server module now looks like this.

```ts {16-37,49-53}
// src/server/+func.ts
import streamHtmlElement from "../client/stream-html?raw";
import { html } from "client:page";
import type { App } from "domco";

const streamHtmlScriptChunk = `<script>${streamHtmlElement}</script>`;

export default {
	fetch(req) {
		const [startChunk, endChunk] = html.split("%stream%");

		const body = new ReadableStream<string>({
			async start(controller) {
				controller.enqueue(startChunk + streamHtmlScript);

				// an array of loaders to load asynchronously
				const loaders = [
					async () => {
						await randomDelay();
						return streamHtml(".greeting", "<h2>Greetings!</h2>");
					},
					async () => {
						await randomDelay();
						return streamHtml("#message", "<p>Message</p>");
					},
					async () => {
						await randomDelay();
						return streamHtml("load-data", "<p><code>1234</code></p>");
					},
				];

				await Promise.all(
					loaders.map(async (loader) => {
						const chunk = await loader();
						controller.enqueue(chunk);
					}),
				);

				controller.enqueue(endChunk);

				controller.close();
			},
		});

		return new Response(body, { headers: { "Content-Type": "text/html" } });
	},
} satisfies App;

// simulate latency in loaders
const randomDelay = () => {
	const ms = Math.floor(Math.random() * 3000);
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const escape = (unsafe: string) =>
	unsafe
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

const streamHtml = (target: string, html: string) =>
	`<stream-html target="${target}" html="${escape(html)}"></stream-html>`;
```

You should now see your HTML streamed into your page.

> NOTE: Safari requires a minimum amount of bytes in the first chunk to support streaming, see this [issue](https://github.com/sveltejs/kit/issues/10315) for more details.

## Conclusion

You can stream HTML with just a few lines of JavaScript using custom elements. Check out the network tab of your development tools to see the HTML stream slowly come in as the page loads. I hope this example provides a look under the hood of how HTML streaming works. Thanks for reading!
