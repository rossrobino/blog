import { origin } from "@/lib/info";

export const Share = (props: { slug: string }) => {
	return (
		<>
			<drab-share class="contents" url={`${origin}/posts/${props.slug}`}>
				<button data-trigger type="button" class="secondary gap-1.5">
					<span data-content>Share</span>
					<template data-swap>Copied</template>
				</button>
			</drab-share>
		</>
	);
};
