---
title: HTTP Forms
description: TODO
keywords: keyword
date: 2026, 03, 20
draft: true
---

## HTML

HTML forms are the fundamental building block that allow users to submit data to a web server. HTML forms can be submitted as either a GET or POST request (other HTTP methods are not supported).

The `action` attribute specifies the URL or pathname of the route that handles the submission.

```html
<form method="POST" action="/post-handler">
	<div>
		<label for="name">name</label>
		<input id="name" type="text" name="name" />
	</div>
	<div>
		<label for="title">title</label>
		<input id="title" type="text" name="title" />
	</div>
	<button>Submit</button>
</form>
```

HTML forms can be submitted without client side JavaScript, or programmatically with JavaScript.

```ts
document.querySelector("form").requestSubmit(); // uses the form's current method and enctype
```

## Request

Submitting the form creates a `Request` to the route specified in the `action`.

For POST requests, `request.body` is a `ReadableStream<Uint8Array>` that streams the values the user submitted in the form.

For example, if a user submits the form above with `name` set to `ross` and `title` set to `developer`, the raw request body can be read with `await req.text()`.

```ts
const text = await req.text();
```

The buffered text from the request would look like this:

```txt
name=ross&title=developer
```

---

For GET requests, the inputs are added to the URL as `URLSearchParams`.

If the same form were submitted with `method="GET"`, `req.url` would contain the query string.

```txt
https://example.com/post-handler?name=ross&title=developer
```

You can then parse the URL and read each value from `searchParams`.

```ts
const url = new URL(req.url);

console.log(url.searchParams.get("name"));
// ross

console.log(url.searchParams.get("title"));
// developer
```

## Multipart

The `enctype` attribute can be used to change the encoding type of the form submission. Most commonly, `enctype="multipart/form-data"` allows forms to be submitted with `File` inputs.

```html
<form method="POST" action="/post-handler" enctype="multipart/form-data">
	<div>
		<label for="name">name</label>
		<input id="name" type="text" name="name" />
	</div>
	<div>
		<label for="title">title</label>
		<input id="title" type="text" name="title" />
	</div>
	<div>
		<label for="video">video</label>
		<input id="video" type="file" name="video" accept="video/*" />
	</div>
	<button>Submit</button>
</form>
```

If you build a `FormData` object and send it with `fetch`, the browser sends it as `multipart/form-data` automatically regardless of the form's `enctype` attribute.

```ts
const form = document.querySelector("form");

await fetch("/post-handler", { method: "POST", body: new FormData(form) });
```

Instead of encoding the body as a single query string, multipart submissions split the request into sections separated by a boundary. This boundary is sent in the `Content-Type` header of the request for the server to use to find where each part starts and ends.

```txt
Content-Type: multipart/form-data; boundary=----formBoundary123
```

If the user uploads a large video file named `video.mp4`, the file part can take a while to load across the network. This is why large uploads are better handled as a stream instead of being buffered all at once.

```txt
------formBoundary123
Content-Disposition: form-data; name="name"

ross
------formBoundary123
Content-Disposition: form-data; name="title"

developer
------formBoundary123
Content-Disposition: form-data; name="video"; filename="video.mp4"
Content-Type: video/mp4

megabytes of binary video data...
------formBoundary123--
```

## Server

Web servers can read the request created from the form. The incoming `Request` object is made available modern JavaScript servers typically on the argument of the request handler. For example, Hono makes the `Request` available on the `Context` within each middleware.

### Form data

The `Request.formData` method is a built-in method available to parse the `body` of a POST request. It works the same regardless of the `enctype` attribute of the form.

The main disadvantage of using this method is that it forces you to load the entire body of the request into your server memory instead of being able to stream through your server to another source.

```ts
await req.formData();
```

### Search params

For GET requests, the data is contained within the `Request.url` string directly instead of within the body. The easiest way to obtain the data is creating a `URL` object with the URL string, and then accessing the `searchParams` property from there.

```ts
new URL(req.url).searchParams;
```

## Security

Since users are able to submit any sort of form data or search parameters to your server, you must treat them as untrusted data.

- Invalid values - for example, too long, wrong format
- Extra data - attackers can send extra keys that your server doesn't expect
- Large requests - overload server with a very large file

Frameworks provide a variety of ways to validate user inputs. Primarily libraries like Zod allow users to validate inputs at runtime to ensure data is the correct type.
