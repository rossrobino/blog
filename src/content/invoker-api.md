---
title: Invoker Commands API
description: More than just opening and closing dialogs!
keywords: invoker, javascript, html
date: 2025, 10, 16
---

## Introduction

The [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) addresses one of the key shortcomings of the [HTML Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)---opening and closing without client-side JavaScript. It also introduces [custom commands](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API#creating_custom_commands) allowing developers to create their own actions that can be utilized from the `command` attribute.

## Attributes

The `command` and `commandfor` attributes are the main controllers of the Invoker Commands API. The trigger element _must have both_ of these attributes set in order for the `command` event to fire.

- `command` - action to take upon clicking the trigger element, [built-in](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command) or [custom](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API#creating_custom_commands)
- `commandfor` - `id` of the target element to execute the action on

> As a best practice, also add the `type=button` attribute to to any buttons that trigger commands to override the default `type=submit`. This ensures accessibility and proper functionality within `<form>` elements.

## Opening and closing dialogs

The [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) has enabled developers to create popovers that open and close without the use of client-side JavaScript. The `<dialog>` element had been left behind until now, developers had to use the [`HTMLDialogElement.showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) and [`HTMLDialogElement.requestClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose) JavaScript methods.

With the Invoker Commands API, you can control dialog visibility without JavaScript. The `command` attributes mirror the instance methods adapted to kebab-case, for example `show-modal` and `request-close`.

---

```html
<button commandfor="dialog-id" command="show-modal" type="button">
	Show Dialog
</button>

<dialog id="dialog-id">
	<h2>Dialog</h2>

	<p>
		Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni
		necessitatibus provident, totam vel a hic, numquam molestiae error doloribus
		ab ducimus alias iste incidunt aliquid sint, inventore ea? Nihil,
		perspiciatis?
	</p>

	<button commandfor="dialog-id" command="request-close" type="button">
		Close
	</button>
</dialog>
```

<button commandfor="dialog-id" command="show-modal" type="button">Show Dialog</button>

<dialog id="dialog-id" class="backdrop:bg-background/60 m-auto opacity-0 transition-[display,opacity] transition-discrete duration-300 backdrop:opacity-0 backdrop:backdrop-blur-lg backdrop:transition-[display,opacity] backdrop:transition-discrete backdrop:duration-300 open:opacity-100 open:backdrop:opacity-100 starting:open:opacity-0 starting:open:backdrop:opacity-0 border border-secondary rounded-md p-4">
<h2 class="mt-0">Dialog</h2>
<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni necessitatibus provident, totam vel a hic, numquam molestiae error doloribus ab ducimus alias iste incidunt aliquid sint, inventore ea? Nihil, perspiciatis?</p>
<button commandfor="dialog-id" command="request-close">Close</button>
</dialog>

---

Popover API methods are also available as values for the `command` attribute, for example `command=show-popover`. See the full list of values [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#command).

## Custom commands

A powerful feature of the Invoker Commands API is custom commands. It unlocks some new patterns that make writing vanilla JS a bit more declarative. For example, we can switch the background color of the div with a custom `--change-color` command. Custom commands must be prefixed with `--`.

```html
<button
	type="button"
	command="--change-color"
	commandfor="content"
	data-color="red"
>
	Red
</button>
<button
	type="button"
	command="--change-color"
	commandfor="content"
	data-color="blue"
>
	Blue
</button>
<button
	type="button"
	command="--change-color"
	commandfor="content"
	data-color="green"
>
	Green
</button>

<div id="content"></div>
```

Instead of adding an event listener to the `<button>` elements, it can be added to the `content` instead. This makes it easy to create different commands for certain components that can be triggered from anywhere in your application via HTML attributes.

```js
content.addEventListener("command", (e) => {
	if (e.command === "--change-color") {
		content.style.backgroundColor = e.source.dataset.color;
	}
});
```

<div class="grid gap-4 grid-cols-3">
<button class="secondary" commandfor="content" command="--change-color" type="button" data-color="red">Red</button>
<button class="secondary" commandfor="content" command="--change-color" type="button" data-color="blue">Blue</button>
<button class="secondary" commandfor="content" command="--change-color" type="button" data-color="green">Green</button>
</div>

<div class="text-4xl font-bold flex justify-center pt-6"><div id="content" class="p-8 bg-gray-500 rounded-md"></div></div>

<script type="module">
content.addEventListener("command", (e) => {
	if (e.command === "--change-color") {
		content.style.backgroundColor = e.source.dataset.color;
	}
})
</script>

---

## Self target

If you don't need a separate target element, you can set the `commandfor` to target the trigger element with the same `id`. `commandfor` is required for the event to fire.

> In most cases, if you are targeting the same element, `addEventListener` is probably a better option.

```html
<button
	command="--custom-command"
	commandfor="self-id"
	id="self-id"
	type="button"
>
	Self Target
</button>
```

## Listening for any command

[You can listen for all commands](https://developer.mozilla.org/en-US/docs/Web/API/CommandEvent/source#examples) by adding an event listener to `document.body` with the [`capture` option](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#capture).

For example, you can log all `command` events on _any_ element with the following code:

```js
document.body.addEventListener(
	"command",
	(e) => {
		console.log(e);
	},
	{ capture: true },
);
```

## Conclusion

I'm interested to see how developers use this API when it's supported across browsers. It could be a nice API to create a library of custom commands that users could access simply with HTML attributes.

Thanks for reading!
