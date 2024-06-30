---
title: Code Snippets
description: A collection of useful web development snippets.
keywords: JavaScript, TypeScript, HTML, CSS
date: 2024, 06, 27
draft: true
---

## Add anchors to headings

```ts
const headings = document.querySelectorAll("h2");
for (const heading of headings) {
	const anchor = document.createElement("a");
	anchor.href = `#${heading.id}`;
	anchor.textContent = heading.textContent;
	heading.replaceChildren(anchor);
}
```
