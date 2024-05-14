---
title: Use Zod to Validate Forms on the Server with SvelteKit
description: Render issues from Zod with a Svelte component.
keywords: svelte, zod, errors, components
date: 2023, 03, 25
---

## What is Zod?

[Zod](https://zod.dev/) is a schema validation library that works nicely with [SvelteKit](https://kit.svelte.dev/). It provides an easy API to quickly validate forms across an application with reusable schemas. Many popular projects use Zod to accomplish type checking at runtime. The [Astro](https://docs.astro.build/en/getting-started/) team uses Zod in their [Content Collections](https://docs.astro.build/en/guides/content-collections/) feature to validate Markdown frontmatter. It can also be used with TypeScript or JavaScript. Here's how to use Zod to validate forms on the server with SvelteKit.

## Install

First create a new SvelteKit project and then add Zod as a development dependency.

```bash
npm create svelte@latest
npm install -D zod
```

## Create a UserSchema

Consider this Zod `UserSchema`, it expects a user will have an email and a password. Here, Zod can also be used to transform data with the `trim` and `toLowerCase` methods. If the parse is successful, the transformed data will be available in `safeParse.data`.

```ts
// src/lib/zodSchemas.ts

import { z } from "zod";

export const UserSchema = z.object({
	email: z.string().email().trim().toLowerCase(),
	password: z
		.string()
		.regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
			message:
				"Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
		}),
});
```

## The safeParse method

`safeParse` can be utlized on any Zod schema to validate an object without creating a runtime error. For example, we could validate a `user` object with our `UserSchema` like this:

```ts
const user = {
	email: "invalid@email",
	password: "invalidPassword",
};

const safeParse = UserSchema.safeParse(user);
```

This would produce an `error` with an array of `ZodIssue`(s).

## ZodIssue

Next we can take a look at the `ZodIssue` object. This object is created with the `safeParse` method if there are any issues in the validation. After running the code above, `safeParse.error.issues` would contain the following `ZodIssue`(s) since both fields were invalid (`email` is missing a `.com`, `password` doesn't contain a number).

```ts
// safeParse.error.issues

[
	{
		validation: "email",
		code: "invalid_string",
		message: "Invalid email",
		path: ["email"],
	},
	{
		validation: "regex",
		code: "invalid_string",
		message:
			"Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
		path: ["password"],
	},
];
```

## SvelteKit example

With SvelteKit, we can implement these methods to create a form with server side validation.

## Create a form

```svelte
<!-- src/routes/+page.svelte -->

<form method="POST">
	<div>
		<label>
			Email
			<input type="email" name="email" required />
		</label>
	</div>

	<div>
		<label>
			Password
			<input type="password" name="password" required />
		</label>
	</div>

	<button>Sign Up</button>
</form>
```

The `name` attribute on each input element is required to get the form data in the `+page.server.ts` file.

## Validate on the server

Next we can create an action for our form to validate the user's inputs on the server. If the `safeParse` is unsuccessful, we will return an array of `ZodIssue`(s) to render to the user.

```ts
// src/routes/+page.server.ts

import { fail, redirect } from "@sveltejs/kit";
import { UserSchema } from "$lib/zodSchemas";

export const actions = {
	default: async ({ request }) => {
		// get form data from event.request
		const formData = await request.formData();

		// use .get() with the corresponding name of the input element
		// to create a user object
		const user = {
			email: String(formData.get("email")),
			password: String(formData.get("password")),
		};

		// zod validation using .safeParse
		const safeParse = UserSchema.safeParse(user);

		// if invalid - return the array of ZodIssues
		if (!safeParse.success) {
			return fail(400, { issues: safeParse.error.issues });
		}

		// sign up user...
		// transformed is data available in `safeParse.data`

		// where to send if login successful
		redirect(303, "/app");
	},
};
```

## ZodIssues component

If there's any validation issues, we want to display the messages provided by our `UserSchema`. We can create a reusable component to render these messages in an unordered list.

```svelte
<!-- src/lib/components/ZodIssues.svelte -->

<script lang="ts">
	import type { ZodIssue } from "zod";

	let { issues }: { issues: ZodIssue[] } = $props();
</script>

<ul>
	{#each issues as { message, path }}
		<li>{path[0]} - {message}</li>
	{/each}
</ul>
```

In case of an invalid form, we can now utilize our `ZodIssues.svelte` component to display the issues.

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	import ZodIssues from "$lib/components/ZodIssues.svelte";

	let { form } = $props();
</script>

<form method="POST">
	<div>
		<label>
			Email
			<input type="email" name="email" required />
		</label>
	</div>

	<div>
		<label>
			Password
			<input type="password" name="password" required />
		</label>
	</div>

	<button>Sign Up</button>
</form>

<!-- if there are issues -->
{#if form?.issues}
	<ZodIssues issues={form.issues} />
{/if}
```

## Conclusion

It's important to validate forms on the server instead of the client because anyone can modify client side code. Zod makes it easy to be consistent, you can easily reuse schemas in other actions, or utilize parts of a schema with the `pick` method.

Thanks for reading!
