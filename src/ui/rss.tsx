import { origin } from "@/lib/info";

export const RSS = () => {
	return (
		<drab-share class="contents" text={`${origin}/rss`}>
			<button
				data-trigger
				type="button"
				class="ghost icon"
				title="RSS"
				aria-label="Copy RSS link to clipboard"
			>
				<span data-content class="contents">
					<span class="icon-[ph--rss] text-xl" aria-hidden="true"></span>
				</span>
				<template data-swap>
					<span class="icon-[ph--check] text-xl" aria-hidden="true"></span>
				</template>
			</button>
		</drab-share>
	);
};
