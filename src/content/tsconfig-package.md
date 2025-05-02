---
title: Package Your TSConfig
description: How to publish and share your TypeScript configuration between projects.
keywords: typescript, tsconfig, npm, package
date: 2025, 01, 17
---

![YouTube Tutorial](yt:DNwYmgz3pCc)

## Directory structure

Your project will need to contain at minimum a `package.json` and another `.json` file containing your shared TSConfig. I have one TSConfig that I use in library development with `tsc` and another in app development when using a bundler. I have also included a `README.md` and a `LICENSE.md`.

```txt
.
├── bundler.json
├── LICENSE.md
├── package.json
├── README.md
└── tsc.json
```

## Preparing to share your TSConfig

Here are a couple of helpful fields that make it easier to share your TSConfig between projects.

- `$schema` is a field you can add to any `.json` file to provide types for the file in editors like VSCode, regardless of the filename. When you are building a package, you might have multiple configuration files with different names than `tsconfig`. This field ensures you get auto-complete when creating the configuration files.
- `${configDir}` is a [new configuration](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#the-configdir-template-variable-for-configuration-files) as of TypeScript 5.5 you can use to reference the directory that the `tsconfig` is contained in. This is crucial to sharing the configuration between projects. For example, `outDir` will always be relative to the user's `tsconfig` instead of relative to the location of your package in `node_modules` after being installed.

For more information on each of these options check out Matt Pocock's [TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet). See [this repository](https://github.com/rossrobino/robino/tree/main/packages/tsconfig) for the latest version of my TSConfig files.

```json
// tsc.json
{
	"$schema": "https://json.schemastore.org/tsconfig",
	"compilerOptions": {
		"outDir": "${configDir}/dist"
		// ...
	},
	"include": ["${configDir}/src", "${configDir}/**/*.test.*"],
	"exclude": [
		"${configDir}/**/*.test.*",
		"${configDir}/node_modules",
		"${configDir}/dist"
	]
}
```

## Package configuration

A TSConfig package can be published with minimal configuration. Specify the following fields in your `package.json`.

Replace `@robino/tsconfig` with the name of your package you will publish to npm. Replace the `MIT` license if you wish to use a different license.

I've specified that this TSConfig needs to use TypeScript 5.5 or later because I'm using the `configDir` feature.

Any `dependencies` specified will be installed alongside your package when it is installed. I find it helpful to install the types for Node.js since I use Node APIs in most of my projects. This will make it so you have types when importing modules like `"node:fs"` by just installing your package, and you will manage the version in a central location.

```json
// package.json
{
	"name": "@robino/tsconfig",
	"description": "Shared TypeScript configurations.",
	"license": "MIT",
	"version": "0.0.1",
	"files": ["tsc.json", "bundler.json", "README.md", "LICENSE.md"],
	"peerDependencies": { "typescript": ">=5.5.0" },
	"dependencies": { "@types/node": "^22.0.0" }
}
```

There is no need to specify the `main`, or `exports` fields, TypeScript will find the files referenced by the entire path.

When you are ready, publish your package to npm using the `npm publish` command or your preferred method.

## Extending and overriding

Once you have published your package, you can use your configurations in another project by installing them as a development dependency. For example, to install my package:

```bash
npm i -D @robino/tsconfig
```

Any TSConfig can extend another configuration by using the `extends` option. Any fields provided in addition to the `extends` options will override the extended configuration.

```json {3,6}
// tsconfig.json
{
	"extends": "@robino/tsconfig/tsc.json",
	"compilerOptions": {
		// overrides the "target" of @robino/tsconfig/tsc.json
		"target": "ES2020"
	}
}
```

---

Thanks for reading!
