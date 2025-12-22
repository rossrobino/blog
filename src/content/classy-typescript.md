---
title: Classy Typescript
description: desc.
keywords: keyword
date: 2025, 12, 31
draft: true
---

## Classy code

In the age of AI writing a larger percentage of code, one thing that I take pride in is code style, naming, and API design. I just released [ovr@6](https://ovrjs.com) and refactored the entire codebase to have everything defined on classes. Here's the entire API:

```ts
import { App, JSX, type Middleware, Multipart, Render, Route } from "ovr";
```

## Benefits of using classes for everything in ts

- Declaration merging
- Private vars
- static methods that can use the private vars
- Use class as the type

have a namespace the same name as a type so that you can add other types to it that look like properties but also use it as the actual type
https://www.typescriptlang.org/docs/handbook/declaration-merging.html
