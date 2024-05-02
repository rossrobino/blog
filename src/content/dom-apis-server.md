---
title: Revising JavaScript's Role in Server-Side Environments
description: Use the most powerful features of JavaScript on the server.
keywords: javascript, dom, api, ssg
date: 2024, 05, 02
---

## Understanding the limits of server-side JavaScript

While server-side JavaScript runtimes excel in various aspects, they lack support for browser-specific APIs due to their operational environment. The [Web-interoperable Runtimes Community Group (WinterCG)](https://wintercg.org/) is working to standardize functionalities across server-side platforms such as Node, Bun, Deno, Vercel Edge Functions, Cloudflare Workers. One example of recent success is universal support for the `fetch` API.

Despite these advancements, DOM APIs, notably `window.document` (frequently leading to [`ReferenceError: document is not defined`](https://www.google.com/search?q=document+is+not+defined)), are absent on the server. To experienced developers this makes sense, the DOM isn't available on the server.

Still, this prompts a thought: Given that server-side rendering involves constructing a DOM-like representation on the server, shouldn't the use of more universal APIs be feasible here as well? UI frameworks must provide rendering functions that work in different environments. For example, [Svelte 5 provides](https://svelte-5-preview.vercel.app/docs/imports#svelte) `mount` and `hydrate` for the client, and `render` for the server. Furthermore, Cloudflare has developed the [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) API, this is the closest example I've seen to including `window.document` directly on the server.

Since JavaScript was essentially developed to manipulate the DOM, why restrict its powerful APIs only to client-side rendering? Libraries like [jsdom](https://github.com/jsdom/jsdom), primarily tailored for testing by simulating a browser environment, are a testament to the demand for these capabilities on the server.

> JavaScript is great at manipulating the DOM.

— [The Primeagen](https://youtu.be/UdCXUVhVSEE?t=3202)

## Templating language dilemma

A key advantage of server-side JavaScript frameworks is their ability to enhance performance and user experience through server-side rendering, which efficiently generates HTML. This process often necessitates adopting specific templating languages like JSX, Vue, Svelte, or Markdown; each powerful yet requiring developers to adapt beyond standard JavaScript paradigms and embrace framework-specific coding practices.

This learning curve introduces complexity. What if server-side rendering could directly utilize DOM APIs, bypassing the steep learning process associated with templating languages?

### Table overflow

A common error I have run into and find on many blogs is when there is a table element that is wider than the rest of the page. It either makes the content too small, or gives the entire page a horizontal scroll.

A simple solution for this problem is to wrap the table element in a div and set `overflow-x: auto;`. If you are using markdown, this can quickly become a daunting task to accomplish on the server. With access to `querySelectorAll` it's easy to manipulate all of table elements with the same code I can run in the browser. Most JavaScript developers can look at the code and understand exactly what's occurring, since it's just DOM APIs.

```ts
const tables = document.querySelectorAll("table");
tables.forEach((table) => {
	const wrapper = document.createElement("div");
	wrapper.style.overflowX = "auto";
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

Comparatively, here's a few examples in different frameworks that I found:

- Next: https://nextjs.org/docs/pages/api-reference/components/head
- Vue: https://medium.com/@Taha_Shashtari/the-easy-way-to-change-page-title-in-vue-6caf05006863
- Svelte: https://svelte.dev/docs/special-elements#svelte-head
- Astro: https://youtu.be/Rg7Finb-Uxw?t=434
- Remix: https://remix.run/docs/en/main/route/meta

### Components

A major drawback of using web components is the fact that they do not have an easy path that supports server-side rendering. By putting DOM APIs on the server, this would unlock the ability to server-side render web components.

## Try it out

Incorporating DOM APIs into server-side rendering doesn't just mirror client-side practices; it enhances developer productivity and capitalizes on JavaScript's strengths. For those interested in exploring static site generation through this approach, check out [domco](https://domco.robino.dev), a Vite plugin that uses jsdom to statically render pages. This technique represents a significant potential in simplifying server-side JavaScript developments by standardizing and extending the utility of DOM manipulation capabilities.
