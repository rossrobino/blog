---
title: Write Once, Run Anywhere
description: Write one schema in JavaScript and query data on the edge with Drizzle-ORM, SvelteKit, and Vercel Storage.
keywords: svelte, drizzle, orm, zod, vercel, postgres, sql, database
date: 2023, 05, 01
---

_At the time of this writing, Drizzle has not reached 1.0. Check out tools like [Prisma](https://www.prisma.io) for a production ready solution._

_Updated May 9th, 2024_

## I've heard this before...

Many projects set out with the goal of writing once, and running anywhere. Recently, there has been a trend of combining front-end and backend into the same project with tools like [Next.js](https://nextjs.org/) or [React Server Components](https://nextjs.org/docs/advanced-features/react-18/server-components). [Drizzle-ORM](https://github.com/drizzle-team/drizzle-orm) helps developers get closer to this promise at the database layer by allowing users to write their schema and query their data in JavaScript.

[Skip to tutorial](#tutorial----sveltekit-and-drizzle-orm)

### One data representation

Maintaining consistency between application code and database schema can be a challenging task, especially considering the involvement of multiple languages at each layer of the architecture. Developers want to have a single, unified source of truth for data representation that can be utilized across both their database and applications. This approach simplifies the process of ensuring that data being inserted from the application adheres to the database schema, while also ensuring that data retrieved from the database is accurately displayed within the application.

Incredible ORM tools like [Prisma](https://www.prisma.io/dataguide/types/relational/what-is-an-orm#:~:text=An%20ORM%2C%20or%20Object%20Relational,used%20in%20object%2Doriented%20programming.) enable this workflow for developers. Prisma provides it's own language to define a schema in a `.prisma` file, create database migrations, and generate types for the client. Another common practice is to generate types from the by introspecting a database schema, I wrote about how you can do this with Supabase [here](/posts/supabase-sveltekit).

### Any runtime

The "serverless" infrastructure has transformed the way we approach computing and development. Along with "serverless", the edge runtime has emerged as a [faster alternative to lambda functions](https://youtu.be/UPo_Xahee1g). Ideally, new applications can run in either environment.

### Drizzle-ORM

Drizzle-ORM is a project similar to Prisma, with a few notable distinctions:

1. Developers can author entirely in JavaScript
2. Supports the edge runtime (Prisma requires a data proxy as of May 1, 2023)

Drizzle takes developers one step closer to the write once, run anywhere workflow.

## Tutorial -- SvelteKit and Drizzle-ORM

Here's how to use Drizzle-ORM in a [SvelteKit](https://kit.svelte.dev/) project with [Vercel's Postgres Storage](https://vercel.com/docs/storage/vercel-postgres). Drizzle makes it easier to keep your services modular and swap out the database provider, check out the [Planetscale integration](https://orm.drizzle.team/docs/get-started-mysql#planetscale) for a similar developer experience.

### Create a SvelteKit project

- Create a new SvelteKit project using the following commands. I've selected the `skeleton` project template and `TypeScript`

```bash
npm create svelte@latest
```

- Follow the instructions to initialize a git repository, then publish it to your [GitHub](https://github.com) account

### Configure Vercel

#### Deploy

- Run the following commands install the [Vercel CLI](https://vercel.com/docs/cli) and link your local project

```bash
npm install -g vercel@latest
vercel login
vercel link
vercel git connect
```

- Make another commit to deploy your app, verify by navigating to the project in the Vercel dashboard and inspecting the deployment

#### Create a database

- Create a new Postgres database through the Vercel dashboard by selecting the "Storage" tab, and link it to your project
- Pull the environment variables to your local machine with the following command

```bash
vercel env pull .env.development.local
```

- You should see a `.env.development.local` file in your project's root directory containing the environment variables for your project (be sure to add `.env.*` files to your `.gitignore` file to ensure these variables are not committed to your repository. This is configured by default for new SvelteKit projects.)
- Run `vercel dev` to test your development environment

### Dependencies

- Next, install the required dependencies for the project.

```bash
npm install -D drizzle-orm drizzle-kit @vercel/postgres
```

### Define a schema

- Define a database schema, I'm going to create a table to track page views

```ts
// src/lib/db/schema.ts
import { integer, pgTable, serial } from "drizzle-orm/pg-core";

export const PageInsights = pgTable("page_insights", {
	id: serial("id").notNull(),
	views: integer("views").notNull(),
});
```

Here we can see how creating a schema is very similar to writing SQL. The benefits of writing it in TypeScript are that Drizzle will handle any migrations when the schema is changed, and we also get automatic types for any query made.

### Migrate

- Create a `drizzle.config.ts` file in the root directory of your project

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	breakpoints: true,
});
```

`out` is the path to the output directory, `schema` is the path to the schema file, `dialect` is the `postgresql` since we are using Vercel Postgres, and `breakpoints` is whether to execute each SQL statement in the migration individually. These can all be customized based on your preferences.

- For convenience I've also added a `migrate` script to `package.json`

```json
// package.json

{
	...
	"scripts": {
		...
		"migrate": "drizzle-kit generate"
	},
	...
}
```

- Run the migrate script to create a new migration

```bash
npm run migrate
```

You can see the output in the `drizzle` directory containing a `0000_...sql` file. This file contains the statements to keep your database in sync with your schema.

- Copy this statement and run it in the Vercel dashboard by navigating back to the "Storage" tab, selecting your database, and selecting the "Query" option

```sql
/* drizzle/0000_...sql */

CREATE TABLE IF NOT EXISTS "page_insights" (
	"id" serial NOT NULL,
	"views" integer NOT NULL
);
```

- Add some data with the following query:

```sql
INSERT INTO page_insights (views) VALUES (0)
```

You have now created a table! Each time you change the `src/lib/db/schema.ts` file, run `npm run migrate`. This will generate a new migration (`0001_...sql`) taking into account all of the changes made. The `drizzle` folder serves as a history of all of your migrations made.

### Create the database connection

Here's where the magic happens, all we need to do is pass Vercel's `sql` as a argument into `drizzle`. We can give this file a `.server` postfix to ensure it is only utilized on the server.

```ts
// src/lib/db/conn.server.ts
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const conn = drizzle(sql);
```

### Load data

- Create a `src/routes/+page.server.ts` file to load the data

Since the data isn't critical to our users, let's stream it by [returning a promise](https://kit.svelte.dev/docs/load#streaming-with-promises) in the `load` function.

```ts
// src/routes/+page.server.ts
import { conn } from "$lib/db/conn.server";
import { PageInsights } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export const load = () => {
	return { views: fetchViews() };
};

const fetchViews = async () => {
	const insights = await conn
		.select()
		.from(PageInsights)
		.where(eq(PageInsights.id, 1));

	const views = ++insights[0].views;

	await conn.update(PageInsights).set({ views }).where(eq(PageInsights.id, 1));

	return views;
};
```

Here we achieve full type safety from the database to the server to the client through the combination of Drizzle-ORM and SvelteKit's load functions--all without manually writing any types (be sure to run `vercel dev` again to generate types for this load function).

### Render

Finally, we can render our data to the page in `src/routes/+page.svelte`.

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	let { data } = $props();
</script>

<p>
	{#await data.views}
		Loading...
	{:then views}
		This page has been viewed {views} times.
	{:catch error}
		{error.message}
	{/await}
</p>
```

## Conclusion

Deploy your changes by pushing your changes to GitHub and verify your build in the Vercel Dashboard.

---

Drizzle-ORM simplifies the process of writing code once and running it on any platform, by allowing developers to write in JavaScript and execute it on the edge runtime. Drizzle-ORM provides the convenience of using SQL-like syntax, and ensures reusability across various database providers. Developers can confidently invest their time in mastering a versatile and efficient tool.

Thanks for reading!

For an example of this project, check out my personal site [here](https://github.com/rossrobino/robino/tree/0d21b5b58fe69a46d40fe95b02eb6e50d254d013). Also, check out the [drizzle-zod](https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-zod/README.md) module to infer [Zod](https://zod.dev/) schemas from Drizzle schemas.
