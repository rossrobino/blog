---
title: How to Create a Carousel using Modern Web Standards
description: Learn to build an interactive carousel using CSS scroll-snap and progressively enhance it with JavaScript.
keywords: CSS, carousel, TypeScript, JavaScript, HTML, scroll snap
date: 2024, 06, 25
---

<drab-youtube aria-label="YouTube Tutorial" uid="aNSUZiBjRRI">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube>

## Tutorial

A carousel is a common UI element many applications have in place. It can be nice to display images or cards of information. Here's how to create a carousel with CSS `scroll-snap` and progressively enhance the carousel with buttons on either side.

First we'll set up the carousel with just HTML and CSS. Here we can use custom elements without JavaScript to avoid having to use class names for our CSS. Custom elements do not require JS!

I'm setting some placeholder images with [Lorem Picsum](https://picsum.photos/).

## HTML

```html
<carousel-container aria-label="Image carousel">
	<carousel-content>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=1"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=2"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=3"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=4"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=5"
		/>
	</carousel-content>
</carousel-container>
```

## CSS

```css
carousel-container {
	display: flex;
	align-items: center;
	gap: 1rem;
}

carousel-content {
	display: flex;
	gap: 1rem;
	padding-block: 1rem;
	overflow-x: scroll;

	/* the children of the carousel */
	& > * {
		border-radius: 25%;
		width: 200px;
		height: 200px;
	}
}
```

Next, we can use `scroll-snap` CSS properties to make sure that when the user scrolls, the item they scroll to is automatically centered.

```css {6,13}
carousel-content {
	display: flex;
	gap: 1rem;
	padding-block: 1rem;
	overflow-x: scroll;
	scroll-snap-type: x;

	/* the children of the carousel */
	& > * {
		border-radius: 25%;
		width: 200px;
		height: 200px;
		scroll-snap-align: center;
	}
}
```

## Progressive enhancement

Many design systems include buttons with a carousel for the user to click to scroll instead of having to use the scrollbar. We can provide this progressive enhancement with web components that use JavaScript. We can create a `carousel-trigger` element that uses a `direction` attribute that specifies which direction the content should scroll.

```html
<carousel-trigger direction="backward"></carousel-trigger>
```

To create the trigger, we'll create `CarouselContent` and `CarouselTrigger` classes and define them in the custom elements registry.

First the `CarouselContent` class will provide a method to shift the carousel forward or backward.

```ts
class CarouselContent extends HTMLElement {
	shift(direction: "forward" | "backward") {
		// total width of the scroll area / how many items there are
		const scrollLength = this.scrollWidth / this.childElementCount;

		// scroll forward or backward depending on the direction
		this.scrollBy({
			left: direction === "forward" ? scrollLength : -scrollLength,
		});
	}
}

customElements.define("carousel-content", CarouselContent);
```

Next we'll create the `CarouselTrigger` class to create the buttons and call the `shift` function when they are clicked.

```ts
class CarouselTrigger extends HTMLElement {
	get direction() {
		return this.getAttribute("direction") as "forward" | "backward";
	}

	/** returns the `carousel-content` element within the same parent */
	get content() {
		return this.parentElement?.querySelector(
			"carousel-content",
		) as CarouselContent;
	}

	connectedCallback() {
		this.role = "button";
		this.ariaHidden = "true";
		this.classList.add("button", "button-ghost", "button-icon");
		// https://lucide.dev/icons/
		this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

		if (this.direction === "backward") this.style.rotate = "180deg";

		this.addEventListener("click", () => this.content.shift(this.direction));
	}
}

customElements.define("carousel-trigger", CarouselTrigger);
```

Finally, if JavaScript hasn't loaded, we do not want to show these buttons since they will not work. We can use CSS to hide the triggers if they are not defined in the custom elements registry.

```css
carousel-trigger:not(:defined) {
	display: none;
}
```

We'll also add `scroll-behavior: smooth` to ensure our carousel smoothly scrolls to the next image when the trigger is activated.

```css {6}
carousel-content {
	display: flex;
	gap: 1rem;
	padding-block: 1rem;
	overflow-x: scroll;
	scroll-behavior: smooth;
	scroll-snap-type: x;

	& > * {
		border-radius: 25%;
		width: 200px;
		height: 200px;
		scroll-snap-align: center;
	}
}
```

Altogether the code looks like this:

```html
<script type="module" src="client.ts"></script>

<style>
	carousel-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	carousel-content {
		display: flex;
		gap: 1rem;
		padding-block: 1rem;
		overflow-x: scroll;
		scroll-behavior: smooth;
		scroll-snap-type: x;

		& > * {
			border-radius: 25%;
			width: 200px;
			height: 200px;
			scroll-snap-align: center;
		}
	}

	carousel-trigger:not(:defined) {
		display: none;
	}
</style>

<carousel-container aria-label="Image carousel">
	<carousel-trigger direction="backward"></carousel-trigger>
	<carousel-content>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=1"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=2"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=3"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=4"
		/>
		<img
			alt="A random image from picsum.photos"
			src="https://picsum.photos/200?random=5"
		/>
	</carousel-content>
	<carousel-trigger direction="forward"></carousel-trigger>
</carousel-container>
```

```ts
class CarouselContent extends HTMLElement {
	shift(direction: "forward" | "backward") {
		const scrollLength = this.scrollWidth / this.childElementCount;
		this.scrollBy({
			left: direction === "forward" ? scrollLength : -scrollLength,
		});
	}
}

class CarouselTrigger extends HTMLElement {
	get direction() {
		return this.getAttribute("direction") as "forward" | "backward";
	}

	get content() {
		return this.parentElement?.querySelector(
			"carousel-content",
		) as CarouselContent;
	}

	connectedCallback() {
		this.role = "button";
		this.ariaHidden = "true";
		this.classList.add("button", "button-ghost", "button-icon");
		this.innerHTML = /* html */ `
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
		`;
		// rotate if backward
		if (this.direction === "backward") this.style.rotate = "180deg";

		this.addEventListener("click", () => this.content.shift(this.direction));
	}
}

customElements.define("carousel-content", CarouselContent);
customElements.define("carousel-trigger", CarouselTrigger);
```

## Conclusion

Starting with a basic structure, we utilized CSS `scroll-snap` properties for smooth scrolling, and progressively enhanced the carousel with navigation buttons using custom web components. This approach not only ensures a more modular and maintainable codebase but also enhances user experience across different platforms and devices. Keep experimenting and customizing to fit your specific needs, and enjoy the flexibility that comes with combining modern web standards and progressive enhancement techniques.
