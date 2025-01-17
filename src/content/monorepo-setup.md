---
title: How to Configure a TypeScript Monorepo
description: Configure a monorepo with npm workspaces, TypeScript, Turborepo, Vitest, Prettier, and Changesets.
keywords: keyword
date: 2025, 01, 01
draft: true
---

<!-- <drab-youtube aria-label="YouTube Tutorial" uid="">
    <iframe data-content loading="lazy"></iframe>
</drab-youtube> -->

## When to use a monorepo

If you are developing multiple applications or packages that closely depend on one another, monorepos can speed up your development time. Monorepos allow you to set up set up multiple projects in one repository and make it easier to share code between them.

## Tooling

In this tutorial, I'll show you how I've been setting up some projects that I work on using the following (free) tools:

- Node.js with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) - module resolution
- [TypeScript](https://www.typescriptlang.org/) - Types!
- [Turborepo](https://turbo.build/repo/docs) - parallel CI tasks
- [Vitest](https://vitest.dev/) - Testing
- [Prettier](https://prettier.io/) - formatting
- [Changesets](https://github.com/changesets/changesets) / [GitHub Actions](https://github.com/features/actions) - publishing

## Structuring your project

Here's the file structure that you can utilize to configure your monorepo. I'll walk through each of these and link to an example in the following sections, for further details on each file, watch the tutorial above.

```
.changeset/
└── config.json
.github/
└── workflows/
    └── release.yaml
apps/
├── app-1
├── app-2
└── ...
packages/
├── package-a
├── package-b
└── ...
.gitignore
.prettierignore
CONTRIBUTING.md
LICENSE.md
package-lock.json (generated - npm install)
package.json
prettier.config.js
README.md
turbo.json
```

## package.json

[Example](https://github.com/rossrobino/robino/blob/main/package.json)

At the heart of your project is the `package.json` file. There should be one of the files in the root directory of your project as well as in each of your apps or packages. These files primarily configure Node.js and npm.

https://github.com/changesets/changesets/blob/main/docs/config-file-options.md
