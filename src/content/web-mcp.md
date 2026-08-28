---
title: Building with WebMCP
description: Run AI features through WebMCP for higher capability, familiar models, and lower costs.
keywords: ai, mcp, webmcp
date: 2026, 08, 28
---

## What is WebMCP?

MCP (Model Context Protocol) provides an interface for tools such as ChatGPT/Codex, Claude Code/CoWork, and Grok Bot (I'll refer to these as agents going forward), to connect to allowing them to accomplish tasks with other systems. Typically MCP _servers_ live on a remote _server_, your agent connects with them for example over HTTP. They provide information about what the agent can do with tools: order dinner, book a trip, or deploy a website.

With remote MCP servers, instead of an agent having to use local tools like [Computer Use](https://developers.openai.com/api/docs/guides/tools-computer-use) to access a browser and click around like a human would, they allow agents to operate in a more streamlined way to accomplish the task it needs.

You can think about [WebMCP](https://developer.chrome.com/docs/ai/webmcp) as a similar interface for the agent, but instead of the MCP existing on a remote server, it is available on your machine directly through browser APIs. You can register tools with JavaScript:

```js
await document.modelContext.registerTool({
	name: "update-project-name",
	description: "Change the Plought project name.",
	// ...
});
```

Or through HTML attributes declaratively:

```html
<form
	toolname="update-project-name"
	tooldescription="Change the Plought project name."
></form>
```

Personally, I think the imperative Javascript API is more powerful so the agent can perform actions that may not be visible to the user in the UI (user interface).

## Case study---Plought

As people increasingly use agentic tools in their daily workflows there are a few nice use cases that WebMCP makes possible.

I built [_Plought_](https://plought.app) to help people make structured decisions, recently I added WebMCP support to enable people to use their agent to make decisions with the help of their agent.

### Speed and efficiency

While Computer and browser use tools are amazingly capable, they can be slow and inefficient. An agent has to process screen shots of your computer, decide where to click, and wait for navigations.

WebMCP allows agents to navigate and use your site in a way that is optimized to them---context and tools. Agents don't need a flashy UI, or carefully designed inputs, they just need to optimally know which tools to call to accomplish the task at hand. Cutting out the human optimized UI, creates much faster and more efficient interactions for agents.

### Collaboration

I've also found Computer and Browser Use tools to be very clunky to handoff. It's hard to work alongside an agent within the same tab if it highjacks your mouse and clicks around while you are also trying to use the site.

Remote MCPs present a different problem: they silo you from your work, making you totally reliant on the agent completing the task without much oversight or review.

An website equipped with WebMCP allows humans and agents to work collaboratively on the same site. Plought consists of a series of forms to fill out as you make evaluate alternatives to a problem you have. Instead of the agent having to navigate each screen, it can reference the entire state of the application with tools. For example, it can see what I have input on the **Start** page, gather context about what decision I'm trying to make, and then help me fill out the current page that I'm on.

To me, having the UI still available for me is nice. I can review the inputs of the agent in a human optimized view and make changes without having to prompt and wait. I can also review tailored charts and visualizations that Plought provides that would be difficult for the agent to generate.

### Offload your API bill

Before implementing WebMCP, Plought already had a variety of AI research tools built into the UI that users can take advantage of, for example to research more alternatives. These are available through the OpenAI API and have run on the cheapest GPT model (currently `luna`) for me to avoid having to front a high cost to enable these features.

WebMCP users are not limited to the model the site provides, if the user currently pays for a more capable frontier model, they can enjoy a better experience within Plought.

### Personalization

WebMCP opens up the possibilities for users and allows them to use their own AI subscriptions to help them however they see fit. Some people have a strong preference for different companies or agents if a particular one matches their beliefs or working style better. It's nice to allow people to utilize the agent they prefer.

> "Remember the houses we researched on Zillow yesterday? Let's put them into Plought as alternatives."

Their own agent also might have additional context that would be useful for the task at hand. For example in Plought, maybe the user would say _"Remember the houses we researched on Zillow yesterday? Let's put them into Plought as alternatives."_ The agent could speed up the process of getting started in the app, and carry them through the rest of the decision making process using what they know about them from previous conversations.

## Try it out

I was pleasantly surprised by how much this browser API enables. I think we will continue to see more use cases unlocked like real time collaboration or generative user interfaces as someone uses an app. As more people become familiar with agentic work outside of software development, the potential for these features grows larger. Here are [instructions on how you can try it with Plought](https://plought.app/agents) to help make a hard decision if you want an easy, free, no-login way to test it out.
