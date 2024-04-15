---
title: Server Rendering with DOM APIs
description: Use the most powerful features of JavaScript on the server.
keywords: javascript, dom, api, ssg
date: 2024, 04, 03
draft: true
---

## JavaScript strengths

Server-side JavaScript runtimes do not support all of the browser APIs, this makes sense as the code is running in a different environment. Many APIs are standard, the [Web-interoperable Runtimes Community Group (WinterCG)](https://wintercg.org/) is an effort to standardize server-side JavaScript runtimes like Node, Bun, Deno, Vercel Edge Functions, Cloudflare Workers, etc. For example the `fetch` API is supported across all of these runtimes.

Notably missing from all of the server-side runtimes are the DOM APIs, mainly `window.document`. How many times have you seen beginners with this error: [`ReferenceError: document is not defined`](https://www.google.com/search?q=document+is+not+defined)? To experienced developers this makes sense, there isn't a DOM on the server.

I question whether this should be the case---server-side rendering is really the process of creating a representation of the DOM on the server. Cloudflare Workers provides the [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) API, this is the closest example I've seen to including `window.document` directly in the runtime.

JavaScript was created to programmatically manipulate the DOM, instead of this only occurring on the client, why can't these APIs be used to render on the server? Many libraries have been created to rectify this gap between runtimes, the most popular being [jsdom](https://github.com/jsdom/jsdom). The primary use case for this is testing. By simulating the browser environment, UI tests can be quickly executed on the server.

> JavaScript is great at manipulating the DOM.

— [The Primeagen](https://youtu.be/UdCXUVhVSEE?t=3202)

## Templating Languages

One of the main benefits of using a JavaScript UI framework is to take advantage of server-side rendering. By generating HTML on the server, you can increase performance and reduce layout shift. In order to take advantage of server-side rendering you often find yourself bound to a templating language such as jsx, vue, svelte, or markdown.

While these languages (_they are languages_) are powerful, you must switch context from what you might learn in a JavaScript class to a niche way of authoring your code with added dependencies.

## Why not?

Server-side rendering by using DOM APIs allows you to not have to deal with learning the intricacies of these templating languages.

I made a [SSG Vite plugin](https://domco.robino.dev) that enables you to use jsdom on the server to write the same browser supported JavaScript to generate a static site. Here are some examples of common problems I have come across that templating languages make difficult that have a simple solution with DOM APIs.

### Table overflow

A common error I have and find on many blogs is when there is a table element that is wider than the rest of the page. It either makes the content too small or gives the entire page a horizontal scroll.

A simple solution for this problem is to wrap the table element in a div and set `overflow-x: auto;` with CSS. If you are using markdown, this can quickly become a daunting task to accomplish on the server. With access to `querySelectorAll` it's easy to manipulate all of table elements with the same code I can run in the browser. Most JavaScript developers can look at the code and understand exactly what's occurring, since it's just DOM APIs.

```ts
const tables = document.querySelectorAll("table");
tables.forEach((table) => {
	const wrapper = document.createElement("div");
	wrapper.classList.add("overflow-x-auto");
	table.parentNode?.insertBefore(wrapper, table);
	wrapper.appendChild(table);
});
```

### Title

Here's another example, you want to update the `title` tag in the head of the document on the server.

With DOM APIs:

```js
document.title = "Title";
```

Here's a few examples in different frameworks that I found:

- Next: https://nextjs.org/docs/pages/api-reference/components/head
- Vue: https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863
- Svelte: https://svelte.dev/docs/special-elements#svelte-head
- Astro: https://youtu.be/Rg7Finb-Uxw?t=434
- Remix: https://remix.run/docs/en/main/route/meta

### Components

A major drawback of using web components is the fact that they do not have an easy path that supports server-side rendering. By putting DOM APIs on the server, this would unlock the ability to server-side render web components as well.

## Conclusion

Thanks for reading! I've found using DOM APIs for server-side rendering productive. If you would like to try out static site generation with DOM APIs check out the [domco](https://domco.robino.dev) project.
