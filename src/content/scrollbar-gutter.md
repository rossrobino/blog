---
title: How to Prevent Scrollbar Layout Shift
description: Prevent layout shift caused when removing the scroll from an element with the CSS scrollbar-gutter property.
keywords: CSS, layout shift, modal, dialog, scrollbar
date: 2025, 05, 01
---

## The problem

A common issue when removing the scroll from an element with JavaScript is that is causes the width of the content to change when the scrollbar is hidden. For example, this happens when you are building a modal element that sets the `overflow` of the body element to `hidden` when the modal is open.

## Scrollbar gutter

I came across the [`scrollbar-gutter`](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter) property when watching this [video from Kevin Powell](https://youtu.be/jSCgZqoebsM?si=399Yv2GrOIlf_y9G). It allows you to maintain the width of the scrollbar gutter even when the element isn't scrollable. It makes for a simple solution to layout shift problem.

Instead of hiding the scrollbar entirely, the thumb becomes hidden and the gutter remains.

## Examples

### CSS

Using CSS you can set the property on the `:root` to `stable` to apply it to the page, or whichever element you need to target.

```css
:root {
	scrollbar-gutter: stable;
}
```

### JavaScript

Here's an example of how to remove the page scroll when opening a `<dialog>` element. With the `scrollbar-gutter` property set to `stable`, the page will maintain the same width and no layout shift will occur.

```js
const dialog = document.querySelector("dialog");

const show = () => {
	dialog.showModal();
	document.body.style.overflow = "hidden";
};

const close = () => {
	dialog.close();
	document.body.style.overflow = "";
};
```
