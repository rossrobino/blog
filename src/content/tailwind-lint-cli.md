---
title: tailwint - Tailwind Lint CLI
description: Let your agent fix your Tailwind lint issues.
keywords: tailwindcss, css, ai, cli
date: 2026, 08, 25
---

## Tailwind lint

TailwindCSS provides a built in linter in their VSCode IDE plugin that provides suggestions like this:

```txt
The class `tracking-[0.025em]` can be written as `tracking-wide` tailwindcss(suggestCanonicalClasses)
```

When migrating from v3 to v4, I have had countless improvements highlighted from this handy feature.

## Agents

Now that I am delegating more work to AI agents, I realized I'm missing these opportunities if I don't open these files in my IDE. Tailwind does not currently provide a programmatic linter to fix these automatically.

I found a project that does exactly this and uses the Tailwind language server to accomplish it. [`tailwint`](https://github.com/peterwangsc/tailwint) is a Tailwind linter and auto-fixer for CI. You can install it as a development dependency,

```bash
npm i -D tailwint
```

and add it as a lint script in `package.json`.

```json
{ "scripts": { "lint": "tailwint --fix" } }
```

Run `npm run lint`, to programmatically fix these issues. Thanks [peterwangsc](https://github.com/peterwangsc) for this great library.
