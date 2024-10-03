---
title: Comparing JavaScript Framework Dependencies
description: An analysis of the count and size of the starter templates of different JavaScript frameworks.
keywords: javascript, framework, dependencies
date: 2024, 10, 02
---

## Methodology

I used the recommended setup for each of these frameworks using the create commands or just installing the package. The repository for all of these setups can be [found here](https://github.com/rossrobino/dependency-comparison). There are many intricacies of what is included in each of these templates (see [caveats](#caveats)). This exercise is meant to illustrate where a beginner might end up with when starting a project with one of these frameworks, contributions are welcome if you see any errors. All of these frameworks offer great solutions for getting started and offer a wide variety of feature sets that contribute to their package sizes.

- Package manager: npm
- Added TypeScript, given the option
- Other extras left out as much as possible, like eslint, prettier, etc.

## Caveats

Each of these frameworks offer different features, this analysis is superficial and gives a quick look of the number/size of dependencies you are installing when you initialize a new application using one of these frameworks.

These important considerations are ignored.

- Features provided - for example, SvelteKit has fewer dependencies than Astro, but Astro handles markdown processing for you. Astro relies on a variety of dependencies for this that you would likely install yourself if you needed to process markdown in a SvelteKit application.
- If the dependencies are first or third party, for example Nuxt relies on the [UnJS](https://unjs.io/) ecosystem of small packages they have created for general purpose use. Setups like this can increase the number of packages while not increasing risk as much as relying on third party solutions.
- If dependencies are bundled or minified before being published.

## Metrics

### Number of Packages

> Number of packages listed when running `npm install`.

As the number of dependencies your project relies on grows, so does the number of maintainers. This can expose you to risk if there are [bad actors contributing to your dependencies](https://github.com/bluwy/ihimnm). Having more dependencies also creates friction if some of the packages are not maintained as actively as others and security issues are identified.

### Size

> The size in MB of the `node_modules` directory according to MacOS finder.

The largest benefit of having a smaller total size of dependencies is how fast they will be installed on your local machine.

A large `node_modules` directory indicates that it takes more code to develop your application. This does not correlate with how big the final application is that is shipped to users. For example, Astro has 191 MB of dependencies, but ships zero JavaScript to the client by default. Libraries may include different builds like CommonJS and ESM, or include different amounts of TypeScript definition files. This measures just what is included in the directory, not what is actually imported and used in your application.

## Results

| Framework                                         | Create/Install Command                   | Packages | `node_modules` | Notes                                            |
| ------------------------------------------------- | ---------------------------------------- | -------: | -------------: | ------------------------------------------------ |
| [Vite](https://vite.dev/)                         | `npm create vite@5.5.2`                  |       11 |        51.5 MB | `vanilla` template                               |
| [Next.js](https://nextjs.org/)                    | `npm create next-app@14.2.14`            |       28 |       260.3 MB |                                                  |
| [SvelteKit](https://kit.svelte.dev/)              | `npm create svelte@6.3.12`               |       58 |        68.3 MB | `skeleton` template                              |
| [Parcel](https://parceljs.org/)                   | `npm i parcel@2.12.0`                    |      189 |       307.2 MB |                                                  |
| [11ty](https://www.11ty.dev/)                     | `npm i @11ty/eleventy@3.0.0`             |      206 |        28.1 MB |                                                  |
| [Astro](https://astro.build/)                     | `npm create astro@4.9.0`                 |      417 |       191.1 MB |                                                  |
| [Vinxi](https://vinxi.vercel.app/)                | `npm i vinxi@0.4.3`                      |      454 |       131.6 MB |                                                  |
| [Solid Start](https://start.solidjs.com/)         | `npm create solid@0.5.13`                |      554 |       169.4 MB | `bare` template                                  |
| [Remix](https://remix.run/)                       | `npm create remix@2.12.1`                |      580 |       186.6 MB | Removed all `tailwind` and `eslint` dependencies |
| [Nuxt](https://nuxt.com/)                         | `npx nuxi@3.14.0 init`                   |      642 |       233.3 MB |                                                  |
| [Angular](https://angular.dev/)                   | `npm i -g @angular/cli@18.2.7 && ng new` |      982 |       352.5 MB | `css` and `ssr`                                  |
| [create-react-app](https://create-react-app.dev/) | `npx create-react-app@5.0.1`             |     1479 |       305.6 MB | removed `@testing-library/*` and `web-vitals`    |

## Conclusion

It's important to understand what dependencies you are installing to create your applications and weigh the cost with the features they provide. If you need to install a dependency to use in your project, check your `node_modules` directory first, you may already have it or a close alternative installed that you can use.
