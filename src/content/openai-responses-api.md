---
title: OpenAI Responses API for TypeScript Developers
description: A simple overview of how to use the OpenAI Responses API with TypeScript, including setup, streaming responses, and managing conversation state without a database.
keywords: gpt, openai, responses, api, typescript, javascript
date: 2025, 04, 18
---

![OpenAI Responses API YouTube Tutorial](yt:J2yGW9MRnfY)

## Overview

OpenAI released a new [Responses API](https://platform.openai.com/docs/api-reference/responses) in March 2025. The Responses API is the successor to the [Chat Completions API](https://platform.openai.com/docs/api-reference/chat), and is the standard way to interact with OpenAI's LLMs. Check out OpenAI's [comparison](https://platform.openai.com/docs/guides/responses-vs-chat-completions?api-mode=responses) of the two APIs to understand the main differences between the two.

Here's how you can utilize the new API in a TypeScript server application.

## Setup

I'm going to use the [domco](https://domco.robino.dev) Vite plugin for this project, but you can use any popular JS server framework.

```bash
npm create domco@latest
```

Install the `openai` package, I'm going to use `dotenv` to manage environment variables. If you are using a different framework, environment variable setup might be done for you, so be sure to review the framework's documentation. I'm also using `zod` to validate form inputs.

```bash
npm i openai dotenv zod
```

[Create an API key](https://platform.openai.com/account/api-keys) and add it to a `.env` file in your root directory.

```txt
OPENAI_API_KEY="your-api-key"
```

Be sure `.env` is included in your `.gitignore` file as well so you do not commit secret information to your repository.

```txt
.env
```

## Frontend

Lets add a `<form>` to our HTML page to submit a message to our API, and a `<div>` element to put the response from the assistant into.

We'll also add a `<script>` tag pointing to `/client/main.ts` to add some client side JavaScript that will handle our form submission.

```html {9,14-19,22-24}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" type="image/svg+xml" href="/circle.svg" />
		<link rel="stylesheet" href="/client/style.css" />
		<title>domco-openai</title>
		<script type="module" src="/client/main.ts"></script>
	</head>
	<body class="prose">
		<header><h1>OpenAI Responses API</h1></header>
		<main>
			<form action="/chat" method="POST">
				<label for="message">Message</label>
				<textarea name="message" id="message"></textarea>

				<button>Send</button>
			</form>

			<h2>Assistant</h2>
			<div id="assistant">
				<!-- response goes here -->
			</div>
		</main>
	</body>
</html>
```

In `main.ts`, add an event listener to the form that will execute on the `submit` event. We'll handle the submission with JavaScript so we can easily stream the assistant's response into the page.

```ts
// get references to our elements
const form = document.querySelector("form")!;
const assistant = document.querySelector("#assistant")!;

// add a submit listener
form.addEventListener("submit", async (e) => {
	// prevent full page reload, instead handle with JS
	e.preventDefault();

	// set a loading state
	assistant.innerHTML = "Loading...";

	const { action, method } = form; // values from the corresponding attributes

	// creates FormData with all the elements from the form
	const body = new FormData(form);

	// make a request to our API
	const res = await fetch(action, { method, body });

	// obtain the reader from the body stream
	const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();

	if (!res.ok || !reader) {
		assistant.innerHTML = "nope";
		return;
	}

	// clear loading state
	assistant.innerHTML = "";

	while (true) {
		// read each value from the stream
		const { done, value } = await reader.read();

		if (done) break;

		// add each chunk to the assistant <div>
		if (value) assistant.innerHTML += value;
	}
});
```

Now if we submit our form, given the `/chat` action, we should see a `404` message in the console and our `nope` message in the response. We need to add a new `/chat` route on the backend to handle this request.

## Backend

### Setup

First, let's get the message from the form from `req.formData`. We can just return the message as text to start with.

```ts {13-24}
// src/server/+app.ts
import { html } from "client:page";
import * as z from "zod";

export default {
	async fetch(req: Request) {
		const url = new URL(req.url);

		if (url.pathname === "/") {
			return new Response(html, { headers: { "content-type": "text/html" } });
		}

		// create new route /chat
		if (req.method === "POST" && url.pathname === "/chat") {
			const data = await req.formData();

			// get the message based on the textarea's `name` attribute
			const message = z.string().parse(data.get("message")) ?? "Empty message.";

			// just send back for now
			return new Response(message, {
				headers: { "content-type": "text/plain" },
			});
		}

		return new Response("Not found", { status: 404 });
	},
};
```

Now when the form is submitted, the same message should be rendered below.

### OpenAI Client

To generate a response using the Responses API, create an `src/server/ai.ts` module, import the OpenAI client, and provide your API key.

```ts
// @/server/ai.ts
// side effect import sets up environment variables
import "dotenv/config";
import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set.");

export const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

Now we can import this module and use the `client` to create an AI response.

```ts {2,12-19}
// src/server/+app.ts
import * as ai from "@/server/ai";
import { html } from "client:page";

export default {
	async fetch(req: Request) {
		// ...

		if (req.method === "POST" && url.pathname === "/chat") {
			// ...

			const response = await ai.client.responses.create({
				input: message,
				model: "gpt-4.1-nano", // cheapest model
			});

			return new Response(response.output_text, {
				headers: { "content-type": "text/plain" },
			});
		}
	},
};
```

Send the `response.output_text` back as our response. You've now created a simple chat application with the Responses API!

## Streaming

Instead of waiting for the entire message to buffer on the server before sending it back we can _stream_ the response to the client as it comes in to give the user a faster response.

Add the `stream: true` property to the `responses.create` argument.

```ts {4}
const response = await ai.client.responses.create({
	input: message,
	model: "gpt-4.1-nano",
	stream: true,
});
```

Now the `response` is an [`AsyncIterable`](https://blog.robino.dev/posts/iterables) stream, so we can iterate through each `ResponseStreamEvent` to send the data as it streams in.

Create a new `ReadableStream` body to handle the stream.

```ts
const body = new ReadableStream<string>({
	async start(c) {
		for await (const event of response) {
			// TODO: enqueue the text
		}

		c.close(); // end the stream
	},
}).pipeThrough(new TextEncoderStream());
```

The `ResponseStreamEvent` has a `type` property that distinguishes what kind of event is being sent. The `"response.output_text.delta"` type is the one we are looking for. It contains the change in the output text since the last event in the `delta` property.

```ts {4-6}
const body = new ReadableStream({
	async start(c) {
		for await (const event of response) {
			if (event.type === "response.output_text.delta") {
				c.enqueue(event.delta); // send the difference since last time
			}
		}

		c.close();
	},
}).pipeThrough(new TextEncoderStream());
```

Now we can pass this stream into our `Response` constructor to stream the contents from our `/chat` route on the fly.

```ts
// ...

return new Response(body, { headers: { "content-type": "text/plain" } });
```

## Persisting conversation state

OpenAI makes it possible to retrieve previous messages from the same conversation using an ID. This is nice because you do not have to send any of the previous messages when you are having a multi-message conversation, or store anything in a database of your own.

Obtain the `id` from the `FormData`, pass it into the `previous_response_id` property.

Set `store: true` to instruct OpenAI to store the conversation.

```ts {4,10-11}
//...

// get the id from the hidden input element
const id = z.string().nullable().parse(data.get("id"));

const response = await ai.client.responses.create({
	input: message,
	model: "gpt-4.1-nano", // cheapest model
	stream: true,
	previous_response_id: id,
	store: true,
});
```

To obtain the `id` from the response when streaming, it is contained in the `"response.completed"` event instead of directly on the response object. Let's send this `id` to the client at the end of the stream.

```ts
// ...

else if (event.type === "response.completed" && !id) {
	c.enqueue(event.response.id);
}
```

Then when the form is submitted again it will contain the `id` within the `FormData`.

```ts
// src/client/main.ts

//...

while (true) {
	const { done, value } = await reader.read();

	if (done) break;

	const idPrefix = "resp_";

	if (value.includes(idPrefix)) {
		// parse the response id
		const [rest, id] = value.split(idPrefix);

		// in case it was sent with something before
		assistant.innerHTML += rest;

		// append a new hidden input to the form with the value of the id
		const input = document.createElement("input");
		input.type = "hidden";
		input.name = "id";
		input.value = idPrefix + id;

		form.append(input);
	} else if (value) {
		assistant.innerHTML += value;
	}
}
```

Now the assistant will remember the previous messages.

## Retrieving previous messages

In the case you need to get the previous messages in a conversation, you'll need to make two requests.

```ts
const [previous, latest] = await Promise.all([
	ai.client.responses.inputItems.list(response.id),
	ai.client.responses.retrieve(response.id),
]);

previous; // all previous messages excluding the latest
latest; // the latest message
```

## Conclusion

The Responses API provides a nice way to interact with OpenAI's LLMs. The final project is [located on GitHub](https://github.com/rossrobino/domco-examples/tree/main/apps/openai). Thanks for reading!
