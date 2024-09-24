---
title: Interactively Update NPM Dependencies
description: Keeping up with your project's dependencies can be difficult and time consuming. Here's the best way I've found to keep up with them.
keywords: npm, dependencies, ncu, format
date: 2022, 09, 12
---

## Update your dependencies

Keeping up with a project's dependencies can be difficult and time consuming. After trying a variety of methods, here's the best way I've found to manage npm dependencies with [npm-check-updates](https://github.com/raineorshine/npm-check-updates).

## Script

Add this `script` to your `package.json`, you can name it whatever you prefer, I name mine `deps`. Alternatively, you can run the script in the command line directly.

```json {3}
{
	"scripts": {
		"deps": "npx npm-check-updates@latest --interactive --format group"
	}
}
```

By specifying `@latest` you can ensure that you are always using the latest version of the `npm-check-updates` package. By using `npx` instead of installing the package as a dependency, it saves time if other people are contributing to your project. They will not need to install the `npm-check-updates` when they run `npm install` to start their dev environment.

## Update project

Run this command from the workspace folder to run the command and start the interactive process.

```bash
npm run deps
```

## Process

- Update all patch/minor updates, test
- Update each major update independently, test

## References

- [Syntax Podcast #425 - Wes Bos and Scott Tolinski](https://syntax.fm/show/425/updating-project-dependencies)
- [How to Update NPM Dependencies by Natalie Pina](https://www.freecodecamp.org/news/how-to-update-npm-dependencies/)
