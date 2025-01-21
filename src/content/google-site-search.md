---
title: Simple Site Search
description: How to make a Google Site Search like on deno.com
keywords: site search, google, html, form
date: 2025, 01, 21
draft: true
---

<!-- <drab-youtube aria-label="YouTube Tutorial" uid="">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube> -->

## Google site search

I recently learned by using the site search on [deno.com](https://deno.com) that you can search specific sites on Google by including `site:example.com` in your search. For example, I can search for the term "html" on my blog with this search entry.

`html site:blog.robino.dev`

Their implementation is very simple and can be used on any indexed site. Here's how you can implement a simple search feature on your site using an HTML form.

## Zero JavaScript site search

Create an HTML form that performs a `get` request to google.com/search. The `<form>` will have two `<input>` elements that have `name=q` attributes. The first will be input for th user's search, and the second will be a hidden input with the `value` attribute set to `"site:..."` - the site you want to search. These will be used by the browser to create the URL string.

```html
<form action="https://google.com/search" method="get">
	<input type="search" name="q" placeholder="Search blog.robino.dev" />
	<input type="hidden" name="q" value="site:blog.robino.dev" />
</form>
```

For example, when you search for "html", the form would create a `get` request to:

https://www.google.com/search?q=html&q=site%3Ablog.robino.dev

You can try it out below:

<form action="https://google.com/search" method="get" class="flex gap-4">
	<input type="search" name="q" placeholder="Search blog.robino.dev" />
	<input type="hidden" name="q" value="site:blog.robino.dev" />
</form>

## Indexed pages only

If you have pages that are not indexed on Google, they will not appear in the search. Be sure to register your site on the Google Search Console to ensure it gets indexed properly. Pages that exist behind authentication will not be able to be searched using this method.

Thanks for reading!
