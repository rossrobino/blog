---
title: Use TypeScript with SvelteKit and Supabase
description: Focus on writing product code with this powerful pair of tools.
keywords: svelte, supabase, typescript, types
date: 2023, 02, 01
---

## Full-stack types with one extra dependency

It's hard to avoid adding lots of different dependencies when creating a full-stack web application. Many projects use separate packages for rendering, routing, data fetching, creating an API, managing state, hosting a database/storage, and setting up authentication. Lee Robinson recently wrote [Why You Should Use a React Framework](https://leerob.io/blog/react-frameworks), in this post he highlights how developers should spend their time writing code that is unique to their application, and less time writing boilerplate to connect tools together. I believe we can take this one step further by utilizing SvelteKit, and even further by pairing it with Supabase.

[SvelteKit](https://kit.svelte.dev/) is the first party framework and the recommended way to build [Svelte](https://svelte.dev) applications. Among other features, it provides a powerful way to load data and render pages server side.

In addition, SvelteKit works nicely with [TypeScript](https://www.typescriptlang.org/), one nice feature of SvelteKit's `load` function is how the returned type is passed to its respective `layout` or `page`.

[Supabase](https://supabase.com/) is a popular **backend-as-a-service** tool. Some of the features it provides include a [PostgreSQL](https://www.postgresql.org/) database, [optional hosting](https://supabase.com/docs/guides/self-hosting), [authentication](https://supabase.com/docs/guides/auth/overview), [serverless APIs](https://supabase.com/docs/guides/api), and helper [querying libraries](https://supabase.com/docs/reference/javascript/installing). Supabase makes it simple for JavaScript developers to create robust, full-stack applications with the skills and language they already are familiar with.

## Generated types (without Prisma)

During development, it's useful to keep track of the type of data you expected from any particular request. With TypeScript, you can take advantage of typechecking and auto-completion as your write your queries and in your markup. This is often difficult to accomplish because you must keep track of and sync your types against your schema (tables, columns, types, etc.), or create a type for each request.

If you've used [Prisma](https://www.prisma.io/) before, you'll be familiar with the benefits of having schema types generated for you instead of creating them yourself. This is made possible because your schema is also housed in your project.

While you can use [Prisma with Supabase](https://supabase.com/docs/guides/integrations/prisma), it requires some extra configuration to take full advantage of features like [row level security](https://supabase.com/docs/guides/auth/row-level-security) or authentication. We do **not** have to use Prisma--or manually write our schema/types in our project--to get the same benefits using Supabase's [JavaScript client](https://supabase.com/docs/reference/javascript/installing). Instead of having to create a type for each query, it's possible to generate types based on your projects schema with the [Supabase CLI](https://supabase.com/docs/reference/cli/global-flags). Then you can easily utilize these types throughout your project.

Here's how to start creating full-stack, type safe, applications with SvelteKit and Supabase in under 40 lines of code.

## Create a Supabase project

- Login and create a new project at [supabase.com](https://supabase.com) using their web application.
- Create a table from the table editor--I'll name mine `todos`
- Add `description`
- Enable `Row Level Security`
- We will not need `Realtime` for this tutorial
- Add columns to your table:

| Name       | Type       | Default       |
| ---------- | ---------- | ------------- |
| id         | uuid       | uuid_generate |
| created_at | timestampz | now()         |
| title      | text       | Empty String  |
| complete   | bool       | false         |

- Use the `Insert Rows` button to add a few rows to the table with any data you like

### Row Level Security

Since [Row Level Security](https://supabase.com/docs/guides/auth#row-level-security) is enabled on our table, no one can currently create, read, update, or delete. We can add a `SELECT` policy to enable our database to be read.

- Navigate to `Authentication > Policies` and create a new policy. I've selected `Get started quickly > Enable read access to everyone`.

## Create a SvelteKit project

- Create a new SvelteKit project using the following commands. Select the `skeleton` project template and be sure to `add type checking with TypeScript`.

```bash
npm create svelte@latest
npm install
```

## Environment variables

- Create a `.env` file at the root of your project (outside of `src`) to put environment variables, these are found in `Settings > API` in the project dashboard. The Supabase client will use these variables to query the database.

```bash
PUBLIC_SUPABASE_URL="https://PROJECT_ID.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="ANON_KEY"
```

## Generate types

- Install the Supabase CLI as a development dependency

```bash
npm install -D supabase
```

- Generate a new **access token** for your account in your [organization settings](https://app.supabase.com/account/tokens) and use it to login

```bash
npx supabase login
```

- Add a new script to `package.json` as a shortcut to run the type generation command
- Replace `PROJECT_ID` with the id from your `PUBLIC_SUPABASE_URL` environment variable

```json
// package.json

{
	...
	"scripts": {
		...
		"update-types": "npx supabase gen types typescript --project-id \"PROJECT_ID\" --schema public > src/lib/db/types.ts"
	},
	...
}
```

- Now run this command to generate types into the `src/lib/db/types.ts` file

```bash
npm run update-types
```

Inspect the new file, these generated types should match our table schema. Each time you update your schema in Supabase (add a new table or column, change a type, etc.), you can run this command to sync your types with your project.

```ts
// src/lib/db/types.ts

...

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          complete: boolean
          created_at: string
          id: string
          title: string
        }
		...
```

## Supabase client

Next we can set up our client to query the database.

- Install the Supabase JavaScript client as a dependency

```bash
npm install @supabase/supabase-js
```

- Create a `src/lib/db/client.ts` file, this will be imported wherever we want to run our query (server or client side)

```ts
// src/lib/db/client.ts
// our generated types
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import type { Database } from "./types";
import { createClient } from "@supabase/supabase-js";

export const db = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
);
```

The generated types are imported here and applied to the client, then our responses from the client will be automatically typed! If you are seeing errors when importing the environment variables, be sure to run `npm run dev`.

## Load

Finally, we can fetch our data with a server side `load` function.

- Create a `src/routes/+page.server.ts` file

```ts
// src/routes/+page.server.ts
import { db } from "$lib/db/client";
import { error } from "@sveltejs/kit";

export const load = async () => {
	const { data: todos, error: db_error } = await db.from("todos").select();
	if (!todos) error(404, db_error);
	return { todos };
};
```

This loads the data server side for server side rendering. Check out the SvelteKit's [loading data](https://kit.svelte.dev/docs/load) documentation if you're unfamiliar with how this works.

As you type, you should see your table name appear as an argument in the `from` method due to our generated types!

![Auto-complete your database queries using the generated types.](/images/supabase-sveltekit/autocomplete.webp)

## Render

- Finally, create a `src/routes/+page.svelte` file to display the data on the page

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	let { data } = $props();
</script>

<h1>Todo List</h1>

{#each data.todos as { title, complete, created_at }}
	<h2>{complete ? "Done" : "Todo"} | {title}</h2>
	<p>{new Date(created_at).toLocaleDateString()}</p>
{/each}
```

Here's where we can take full advantage of TypeScript's type checking and autocompletion. You can press `ctrl` + `space` to get suggestions and the types from your schema. The best part is that this is all accomplished without having to manually create any types.

![Auto-complete when writing markup using the generated types.](/images/supabase-sveltekit/autocomplete2.webp)

## Conclusion

Supabase and SvelteKit together can equip you with a powerful toolset and eliminate many extra dependencies in your stack. SvelteKit and the Supabase client, combined with the generated types from the CLI gives you the power of TypeScript without the extra work. Thanks for reading!

## References

- [Supabase - Framework Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)
- [Supabase - Generating Types](https://supabase.com/docs/guides/api/generating-types)
- [SvelteKit documentation](https://kit.svelte.dev/docs)
