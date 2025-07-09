---
title: TypeScript Editor Preferences
description: Some hidden TypeScript preferences to speed up your workflow.
keywords: typescript
date: 2025, 07, 10
---

## TypeScript Preferences

In addition to the well-known `tsconfig.json`, TypeScript also integrates with your editor. In VSCode, you can set `typescript.preferences` in your `settings.json` file.

Here are a few that I think are worth setting on top of the defaults.

## Import module specifier

This preference will change the default auto-import to a non-relative import if possible.

```json
{ "typescript.preferences.importModuleSpecifier": "non-relative" }
```

For example, if you auto-import `foo` from the `foo.js` module, by default you'll get a relative path:

```ts
import { foo } from "../../foo";
```

If you have an alias set up, TypeScript will use the non-relative import instead.

```ts
import { foo } from "@/foo";
```

I like this setting because it makes it easier to copy and paste imports between modules.

## Prefer type only auto imports

This preference will default to prefixing imports with `type` wherever possible.

```json
{ "typescript.preferences.preferTypeOnlyAutoImports": true }
```

For example, classes can be used as the actual class, or as a type.

```ts
// my-class.ts
export class MyClass {
	// ...
}

// class
const foo = new MyClass();

// type
type Bar = { myClass: MyClass };
```

If for example you are creating a function that takes the class as an argument, TypeScript will auto-import the class. In this case, you only need to use the class as a type, not in the actual code, so you can prefix the import with `type` to ensure the import doesn't appear in your final `.js` module.

```ts
import type { MyClass } from "@/my-class";

const fn = (arg: MyClass) => {
	// ...
};
```

## Go to source definition

`preferGoToSourceDefinition` instructs TypeScript to prefer going to the source definition when you `cmd/ctrl` click on something instead of going to type definition. This is nice to see the source code instead of viewing the `d.ts` definition file.

```json
{ "typescript.preferGoToSourceDefinition": true }
```
