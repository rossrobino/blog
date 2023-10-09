---
title: When and Where to Render
description: Evaluating rendering stages for different types of applications and content.
keywords: rendering, web development, HTML
date: 2023, 10, 08
---

I've been using SvelteKit for a variety of projects and working on building a Vite plugin---[domco](https://github.com/rossrobino/domco) (inspired by SvelteKit) to learn more about Vite. I've found it challenging to keep all of the different rendering strategies straight, here's a few things I've learned about different methods and use cases for each.

---

Web applications execute code at different points of the development lifecycle. Grasping when each step happens, and optimizing these processes, ensures your code meets each user's needs effectively. This article provides an overview of how these stages occur and how to maximize their advantages for a seamless user experience.

---

## Build-Time Rendering

Also known as "pre-rendering" in some frameworks. In SvelteKit, you can set a page to be rendered at build time in a `page.js` or `page.server.js` file.

### When

If your application has a build step, build-time rendering occurs once during this step. Typically for JavaScript projects, a build step would consist of installing the required dependencies to build the project and then running the `build` script found in `./package.json`, which could be anything---for example in SvelteKit this is `vite build`.

This can take place locally on your machine, or services like Vercel can perform this step on one of their servers when certain events take place---like whenever you commit to a repository.

Using the example above, the `load` function in a file with `prerender` set to `true` will only run once at build time, instead of on each request.

### Advantages

#### Efficient

The build step runs once, this brings advantages in comparison to rendering on the server or the client, you can perform tasks once at build time, instead of during each request.

Consider a scenario where you consistently fetch content from a CMS to display on your page. You can make a singular fetch request at build-time rather than making individual requests for every client or server request.

#### Reduced Client Side JavaScript Load

Not only does rendering at build time cut down on the time spent waiting for a response, users also never need to wait for any of the JavaScript to load to make the request in the first place. Instead the user is just sent the result. [Most of the time](#disadvantages-1), getting the result is faster than rendering on the client.

### Disadvantages

#### Dynamic Data

Rendering frequently updated data or providing user-specific content at build-time can be somewhat impractical or impossible due to the frequency of changes.

---

## Server-Side Rendering

### When

After the build stage, server-side rendering (SSR) occurs with each server request and precedes the response. This is the default behavior for SvelteKit.

### Advantages

#### Reduced Client Side JavaScript Load

Similar to build-time, the user does not have to load the additional JavaScript to initially see the content, since they receive the result of the script.

#### Dynamic Content

With SSR, each request by the user triggers a server-side render of the content, ensuring updated information displays for each request.

### Disadvantages

#### Rendering Time and HTML Size

Rendering on the server for each request can potentially increase response times. Various strategies like caching network requests can be leveraged to mitigate this, however, the HTML typically still needs to be rendered for every request.

With modern frameworks like React or Svelte, the time it takes to render HTML is usually negligible, but it's important to recognize the potential for server-side rendering to be slower in certain situations. For example, consider a script that generates 10,000 HTML elements. The script is small, but the produced code is over 10,000 lines of HTML. In this case, the user has to wait for both the rendering process on the server and then the larger payload to be transferred over the network.

In comparison, performing the script at build time does away with the rendering duration, and executing the script on the client side reduces the amount of data that is transported across the network.

#### The Cost of Hydration

It's common in many frameworks to "hydrate" the server rendered content on the client after it is rendered on the server. Often times this results in running the same JavaScript twice, once on the server and again on the client. Check out [Qwik](https://qwik.builder.io/docs/concepts/resumable/) which aims to solve this problem with "resumability".

---

## Client-Side Rendering

### When

Client-side rendering happens after receiving an HTML request. [Check out this visual](https://twitter.com/wesbos/status/1694081235729928529) from Wes Bos showing how different script tags can be executed at different times.

SvelteKit components are also rendered on the client by default, `onMount` can be used to encapsulate code that runs exclusively on the client.

### Advantages

#### Interactivity

Client-side JavaScript usage enables interactivity.

#### Dynamic Content

Similar to SSR, client-side JavaScript allows the incorporation of dynamic content rendering.

### Disadvantages

#### Slower

In a majority of cases, it's faster to send rendered HTML than the JavaScript required to load it on the page. Especially if there's an additional request involved in the script. This is why most of the time in SvelteKit, it's a good idea to fetch data on the server first in a `page.server.js` file.

#### Search Engine Optimization

Content that is rendered by JavaScript on the client isn't guaranteed to be read by website crawlers---it may load slowly, or not at all.

#### Layout Shift

Client-side JavaScript requires updates to be made after the user is already viewing the initial content. This results in layout shift or loading spinners which can be a worse user experience.

---

## Incremental Static Regeneration

Another option offered by hosting providers such as Vercel and Netlify is incremental static regeneration (ISR). ISR combines the some of the advantages of build-time and server-side rendering. ISR is similar to server-side rendering, but instead of running the rendering function on each request it is run once in a configured time frame. The result of the function is then cached as static content to be served to the user.

ISR provides a way to have dynamic content served as static assets. Instead of having to rebuild your entire application whenever your data changes, ISR allows you to just run the rendering function again instead. This creates a fast experience for users and a nice developer experience as well.

---

## Conclusion

Understanding when and where to render HTML is important for efficient content delivery and providing a good user experience. Drawing on the strengths of different rendering methods can impact your application's performance and usability. Ensuring your user's needs align with your chosen rendering strategy is an important step towards building robust and high-performing web applications.
