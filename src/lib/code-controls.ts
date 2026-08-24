import type { Options } from "@robino/md";
import { Render } from "ovr";

/** Adds an accessible Drab-powered copy control to fenced code blocks. */
export const codeControls: NonNullable<Options["plugins"]>[number] = (md) => {
	const fence =
		md.renderer.rules.fence ?? md.renderer.renderToken.bind(md.renderer);

	md.renderer.rules.fence = (tokens, i, opts, env, self) => {
		const token = tokens[i];

		if (!token?.markup.startsWith("`")) {
			return fence(tokens, i, opts, env, self);
		}

		const code = fence(tokens, i, opts, env, self);
		const info = token.info.trim();
		const lang = info.split(/\s+/)[0] || "Code";

		return /* html */ `
<div class="code-block bg-base-900 selection:bg-base-50 selection:text-base-900 my-6 -mx-6 rounded-none shadow-sm sm:mx-0 sm:rounded-md">
	${
		!info.endsWith("hide")
			? `<div class="bg-base-800 flex items-center justify-between gap-2 rounded-t-md px-2 pt-px">
		<span class="text-base-200 px-2 font-mono text-sm">${Render.escape(lang)}</span>
		<drab-share class="contents" text="${Render.escape(token.content, true)}">
			<button
				data-trigger
				type="button"
				class="text-base-200 ghost icon bg-base-800"
				aria-label="Copy code to clipboard"
			>
				<span data-content class="contents">
					<span class="icon-[ph--copy]" aria-hidden="true"></span>
				</span>
				<template data-swap>
					<span class="icon-[ph--check]" aria-hidden="true"></span>
				</template>
			</button>
		</drab-share>
	</div>`
			: ""
	}
	${code}
</div>
`.trim();
	};
};
