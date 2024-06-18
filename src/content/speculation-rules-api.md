---
title: From Prefetch to Prerender, Optimize Performance with the Speculation Rules API
description: How adding this script tag to your site can dramatically improve navigation speed for multi-page applications.
keywords: javascript, custom elements, prefetch, prerender, speculation rules, performance
date: 2024, 02, 10
---

This video shows a demo of how you might utilize the Speculation Rules API. Read on for the full explanation.

<drab-youtube aria-label="YouTube Tutorial" uid="W4VjS7rSmB0">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

## Prefetching

_Prefetching_ is a popular and high impact performance optimization that web developers can utilize to speed up navigation and interactions for users. Developers can implement a prefetching strategy to load assets for other pages that the user is likely to navigate to next into the cache.

Here are a few use cases where you might enable prefetching:

- A news website might prefetch the assets for the headline article.
- A restaurant website might prefetch the assets for the menu page.

By the time the user clicks the link to navigate to the page, they already have all of the assets in their cache, the browser just needs to render the content.

During prefetching, the extent of how many of the assets are actually prefetched in advance depends on the implementation. Many frameworks use build time analysis to enable you to prefetch a large portion or all of the required assets for the next page. To accomplish this manually, developers need to track which assets are required to load each page and fetch them accordingly.

## Speculation Rules API

The `prerender` feature of the [Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) allows web developers to go further than simply caching the assets in advance. This API is supported in Chrome and Edge without a flag and enables a page to entirely "prerender" in the browser, including running client-side JavaScript.

It's important to note, this happens entirely on the client. Usually when I think of prerendering, it's usually in the context of build or server side optimizations. This _client-side_ prerendering takes place in the browser.

Google uses this technology in search. For example, type "calculator" into the search bar on Google when using Chrome. Open your dev tools and you will see a drop down in the upper right corner that says "Main".

![An image of the Chrome dev tools.](/images/speculation-rules-api/dev-tools.png)

Click this and select the "Search / Prerender" option. You can see the generated page if you were to complete the calculator search. Search for `"equals"` in the HTML to find the equals button!

Here's an over-simplified diagram of the difference between prefetching with a `<link rel="prefetch">` tag or using `fetch` (I'll refer to this as _prefetching_) compared to _prerendering_ using the Speculation Rules API.

![A diagram showing the steps the browser takes to load a web page. 1. Lookup, 2. HTTP Request, 2.1. Request to a CMS, 3. Requests more assets from the server, 4. Request more assets after processing JavaScript. When comparing prefetching to prerendering with the Speculation Rules API, the Speculation Rules API cover all 4 steps while prefetching stops at step 3. Prefetching does not run the client side JS.](/images/speculation-rules-api/diagram.png)

Here we can see how prerendering with Speculation Rules API goes further than simply prefetching the assets required. It entirely renders the page as if the user had already navigated to it in advance. For some sites this time is minimal, but for sites with a large amount of client-side JavaScript, this can completely eliminate the time to interactive. Step 4 can quickly add up if there is a waterfall of client-side requests.

## Developer experience comparison

### Prefetch

The simplest way to prefetch an asset in advance is by adding a `link` tag to the head of your HTML document, or using `fetch` with low priority.

```html
<link rel="prefetch" as="document" href="/menu" />
<link rel="prefetch" as="style" href="/menu.123456.css" />
<link rel="prefetch" as="script" href="/menu.123456.js" />
```

```js
fetch("/menu", { priority: "low" });
```

Caching the HTML is valuable on it's own, and often times scripts and styles are reused between pages. But, if you do want to cache JavaScript and CSS assets, it can be tricky. These file names are typically hashed by bundlers---so unless you are using a framework that supports this, it requires some manual effort.

### Prerender

The by prerendering with Speculation Rules API is easier reap all of the performance optimizations from, since you only need to provide the HTML page required. During the prerendering process the browser will find the other assets and request them as they are needed. To use the API, provide a `<script type="speculationrules">` with a JSON object containing the `urls` to prerender.

```html
<script type="speculationrules">
	{
		"prerender": [
			{
				"source": "list",
				"urls": ["/menu"]
			}
		]
	}
</script>
```

This makes it easy to prerender without needing to track which assets are required for each page.

_Recently there have been some [improvements to the Speculation Rules API](https://developer.chrome.com/blog/speculation-rules-improvements) with the addition of document rules. Document rules allow you to prefetch or prerender with different strategies based on the anchor tags on the page._

## Libraries

You can easily use this API today to prerender content in advance if it is supported by the browser by adding the script tag to the head of your HTML document. To make it easier to utilize these features there are also a few libraries available.

I contributed to Astro to add an [experimental feature](https://docs.astro.build/en/reference/configuration-reference/#experimentalclientprerender) to take advantage of this API. I have also created a [prefetch custom element](https://drab.robino.dev/docs/prefetch) that progressively enhances anchor tags to give a similar effect to Astro's implementation that you can utilize in any framework or without one.

These implementations will progressively enhance anchor tags depending on the strategy you provide to prefetch/prerender content based on the anchor's `href` attribute. There are different strategies available to allow you to prefetch immediately, when the anchor is visible, or when a user hovers over it.

## Caution

Prerendering with the Speculation Rules API runs scripts in advance, there are cases where you might not want this to occur. Here are a couple examples:

- You have some analytics on a page that are run on the client immediately when the page loads, they will run during the prerendering process.
- There's a resource intensive page that the user might not end up navigating to.

You can check if the page is currently prerendering by using `document.prerendering`. This enables you to have more control over what code executes during prerendering.

## Conclusion

Overall the Speculation Rules API is an easier way for developers to speed up multi-page applications by only needing to provide the HTML asset for the target page. It also enables developers to run client-side JavaScript in advance, to further speed up the time to interactive, and reduce layout shift.

Thanks for reading!
