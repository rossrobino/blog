---
title: Interactively Update NPM Dependencies
description: Keeping up with your project's dependencies can be difficult and time consuming. Here's the best way I've found to keep up with them.
keywords: blog, npm, dependencies, ncu, format
date: 2022, 09, 12
---

## Update your dependencies with two commands

Keeping up with a project's dependencies can be difficult and time consuming. After trying a variety of methods, here's the best way I've found to manage npm dependencies.

## Install globally

[npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

Run this command to install the npm-check-updates package:

```zsh
npm install -g npm-check-updates
```

This allows the use of ncu regardless of whether it's installed in the project directly.

## Update project

Run this command from the workspace folder to start the interactive process:

```zsh
ncu --interactive --format group
```

## Process

- update all patch/minor updates, test
- update each major update independently, test

## References

- [Syntax Podcast #425 - Wes Bos and Scott Tolinski](https://syntax.fm/show/425/updating-project-dependencies)
- [How to Update NPM Dependencies by Natalie Pina](https://www.freecodecamp.org/news/how-to-update-npm-dependencies/)
