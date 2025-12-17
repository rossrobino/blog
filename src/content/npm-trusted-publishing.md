---
title: NPM Trusted Publishing
description: How to publish with provenance to NPM using GitHub Actions and Changesets.
keywords: npm, workspaces, publish, javascript, github, actions, turbo, changesets
date: 2025, 12, 17
---

## Trusted publishing

NPM security requirements [recently got an upgrade](https://docs.npmjs.com/trusted-publishers), meaning package authors need to adjust their publishing workflows if they were using NPM tokens. I encountered a few issues migrating my projects so here are my notes on how I've set up my release automation with GitHub Actions, [Turborepo](https://turborepo.com/), [Changesets](https://github.com/changesets/changesets).

I'll walk through the process of upgrading a css library I maintain called `uico`, here's the [repository](https://github.com/rossrobino/uico) if you want to see more details.

> If you see any errors or improvements in this tutorial, please create an issue or PR.

## File structure

My file structure is a basic monorepo setup with NPM workspaces and `turbo`.

```txt
.
├── .changeset/
│   └── config.json
├── .github/
│   └── workflows/
│       └── release.yml
├── apps/
│   └── docs/
├── packages/
│   └── uico/
├── .gitignore
├── .prettierignore
├── LICENSE.md
├── package-lock.json
├── package.json
├── prettier.config.js
├── README.md
└── turbo.json
```

## package.json

- I've setup workspaces in the root `package.json`. The `workspaces` field contains where your other packages are located. In my case, I have `apps/docs/` and `packages/uico`, so I've declared these as workspaces.
- I use `turbo` to run scripts within my project.
- `changesets` manages npm updates in my project to easily comply with semver best practices and generate release notes. It will automatically manage version updates for packages that depend on one another.

```json
{
	"name": "uico-monorepo",
	"private": true,
	"type": "module",
	"packageManager": "npm@11.7.0",
	"workspaces": ["packages/*", "apps/*"],
	"scripts": {
		"dev": "turbo dev",
		"check": "turbo check",
		"build": "turbo build",
		"preview": "turbo preview",
		"format": "turbo format",
		"changeset": "changeset",
		"version": "changeset version",
		"release": "turbo build && changeset publish"
	},
	"devDependencies": {
		"@changesets/cli": "^2.29.8",
		"@robino/prettier": "^2.0.3",
		"@robino/tsconfig": "^1.1.1",
		"prettier": "^3.7.4",
		"turbo": "^2.6.3",
		"typescript": "^5.9.3"
	}
}
```

## GitHub Action

To create a GitHub action, add a `.github/workflows/release.yml` file with the workflow you want to execute. I've adapted this one from the latest one in the SvelteKit repository.

Previously I had an `NPM_TOKEN` value, which I have now removed since we can utilize Trusted Publishing.

```yml
name: Release

on:
  push:
    branches:
      - main

permissions: {}
jobs:
  release:
    if: github.repository == 'rossrobino/uico'
    permissions:
      id-token: write
      contents: write
      pull-requests: write
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 24.x

      - name: Install Dependencies
        run: npm i

      - name: Create Release Pull Request and Publish to npm
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

Navigate to your repository on GitHub: https://github.com/rossrobino/uico

Select **Settings**, then in the side panel select **Actions - General**. Select **Allow all actions and reusable workflows** for Actions Permissions, and **Read and write permissions** for Workflow Permissions. Also check the option to **Allow GitHub Actions to create and approve pull requests**, this allows `changesets` to create the PR

> If your repo is within an org, you may need to enable these options at the org level first **if they are disabled**.
>
> If you previously had an NPM secret token saved under the **Security - Secrets and variables - Actions** section, you can remove it since it's no longer valid.

## Trusted publishing with provenance

Next navigate to your package on npm: https://www.npmjs.com/package/uico

Login, and select the **Settings** tab, under Trusted Publisher select **GitHub Actions** and enter in the required information. The **Workflow Filename** in this case is `release.yml`.

If this is the only way your package should be published, you can select **Require two-factor authentication and disallow tokens (recommended)** and update your package settings.

[_Provenance_](https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/) will automatically be setup since we specified `NPM_CONFIG_PROVENANCE: true` in the `release.yml` file.

## Release

Now when you make a change to your library that you want to release, make a `changeset` and commit it to your `main` branch. From here, `changesets` will run and open a PR to modify the version numbers of your package accordingly, remove the changesets, and publish the release once the PR is merged.

You can continue to edit or add more changesets and merge the PR when you are ready.
