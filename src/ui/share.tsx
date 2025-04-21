import { origin } from "@/lib/info";

export const Share = (props: { slug: string }) => {
	return (
		<>
			<drab-share class="contents" value={`${origin}/posts/${props.slug}`}>
				<button
					data-trigger
					type="button"
					class="font-old-style secondary gap-1.5"
				>
					<span data-content>Share</span>
					<template data-swap>Copied</template>
				</button>
			</drab-share>
		</>
	);
};
