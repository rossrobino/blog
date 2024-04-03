---
title: Scope JavaScript and CSS with the Web Platform
description: CSS @scope combined with custom elements in JavaScript introduces a more native approach to scoping, allowing for cleaner and more manageable code in web development.
keywords: css, javascript, scope
date: 2024, 03, 13
---

## Built-in scoping

JavaScript frameworks offer solutions to ensure the code you are writing only affects the areas of the application that you want it to. CSS `@scope` support has recently arrived in Safari 17.4. By using custom elements and `@scope`, developers can now take advantage of scoping built directly into the platform.

## JavaScript

Use [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) to scope JavaScript to a specific element. `this` allows you to query only within the element. You can do this with regular elements as well, but custom elements provide a nice declarative barrier during authoring.

```html
<script>
	customElements.define(
		"my-custom-element",
		class extends HTMLElement {
			connectedCallback() {
				const div = this.querySelector("div");

				div.textContent; // "Inside"
			}
		},
	);
</script>

<div>Outside</div>

<my-custom-element>
	<div>Inside</div>
</my-custom-element>
```

<script type="module">
	customElements.define(
		"my-custom-element",
		class extends HTMLElement {
			connectedCallback() {
				const div = this.querySelector("div");

				div.textContent; // "Inside"
			}
		},
	);
</script>

<div>Outside</div>

<my-custom-element>
	<div>Inside</div>
</my-custom-element>

## CSS

Styles within [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) apply to the parent element and children.

```html
<div>Not styled</div>

<my-custom-element>
	<div>Styled</div>
	<style>
		@scope {
			div {
				color: green;
			}
		}
	</style>
</my-custom-element>
```
