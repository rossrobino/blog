import { origin } from "@/lib/info";

export const Share = (props: { path: string }) => {
	return (
		<>
			<drab-share class="contents" url={new URL(props.path, origin).toString()}>
				<button data-trigger type="button" class="secondary gap-1.5">
					<span data-content>Share</span>
					<template data-swap>Copied</template>
				</button>
			</drab-share>
		</>
	);
};
