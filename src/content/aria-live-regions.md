---
title: ARIA Live Regions
description: Learn how to use ARIA attributes to announce dynamic content changes to screen readers.
keywords: ARIA, live regions, accessibility, a11y, html
date: 2024, 06, 18
---

![YouTube Tutorial](EGFUQ2ypnrE)

## Enhancing interactivity

As web applications become more interactive, maintaining accessibility can become a challenge. Screen readers typically read content sequentially, making it difficult to convey updates that occur asynchronously. [ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live) allow developers to notify users about these updates effectively.

In this tutorial, we'll explore how to make interactive websites more accessible using ARIA live regions. I'm using VoiceOver on MacOS and Safari to test this tutorial.

---

## Weather application example

I've created a basic weather application that fetches data from [Open-Mateo](https://open-meteo.com). The application updates a `span` element with the fetched temperature data.

```html
<script type="module">
	// @ts-check

	const getWeather = async () => {
		const p = document.querySelector("p");
		const span = document.querySelector("span");

		if (p && span) {
			span.textContent = "loading...";
			const res = await fetch(
				"https://api.open-meteo.com/v1/forecast?latitude=43&longitude=-86&current=temperature",
			);
			const { current } = await res.json();
			span.textContent = `${current.temperature} degrees.`;
		}
	};

	const button = document.querySelector("button");
	if (button) button.addEventListener("click", getWeather);
</script>

<h1>aria-live</h1>

<p>
	The current temperature is
	<span>unknown. Select "Get Weather" to fetch the current temperature.</span>
</p>

<button class="button button-primary">Get Weather</button>
```

Currently, when using a screen reader, clicking the button does not announce any changes. This is where ARIA live regions become essential.

## aria-live

The `aria-live` attribute specifies an element as a live region, instructing screen readers to announce any content changes within that region. The attribute has three possible values.

1. `off` - default; no announcements
2. `polite` - announces changes when current reading has finished
3. `assertive` - announces changes immediately

So we can mark our `p` tag as an ARIA live region by adding the `aria-live=polite` attribute.

```html
<p aria-live="polite">
	The current temperature is
	<span>unknown. Select "Get Weather" to fetch the current temperature.</span>
</p>
```

Now, when the "Get Weather" button is clicked, the screen reader will announce the contents of the `span` element:

> loading...

> 30.1 degrees.

## aria-atomic

To instruct the screen reader to read the entire contents of the `p` tag rather than just the `span`, add the `aria-atomic` attribute to the live region:

```html
<p aria-live="polite" aria-atomic="true">
	The current temperature is
	<span>unknown. Select "Get Weather" to fetch the current temperature.</span>
</p>
```

The `aria-atomic` attribute can be set to `true` or `false`. The screen reader will traverse up the DOM tree from the changed element until it hits either the `aria-live` region, or the `aria-atomic=true` attribute. If the `aria-atomic=true` attribute is found, it will read the contents of that element instead of just the one that was updated.

Now after selecting "Get Weather" the reader will read out:

> The current temperature is loading...

> The current temperature is 30.1 degrees.

## aria-busy

Right now, if the text content is updated with the result before the screen reader finishes reading "The current temperature is loading..." it will cut off and just read out the result. The `aria-busy` attribute can help manage this by muting updates until the final content is ready.

We can set this attribute with JavaScript in our event handler.

```ts {6,12}
const getWeather = async () => {
	const p = document.querySelector("p");
	const span = document.querySelector("span");

	if (p && span) {
		p.ariaBusy = "true";
		span.textContent = "loading...";
		const res = await fetch(
			"https://api.open-meteo.com/v1/forecast?latitude=43&longitude=-86&current=temperature",
		);
		const { current } = await res.json();
		p.ariaBusy = "false";
		span.textContent = `${current.temperature} degrees.`;
	}
};
```

Now the screen reader will be muted during the loading state changes and will just read the updated message.

> The current temperature is 30.1 degrees.

## Conclusion

Ensuring accessibility in dynamic web applications can be complex. ARIA live regions provide a powerful tool to convey real-time updates to screen reader users.
