import type { JSX } from "ovr";

export const RootLayout = (props: { children?: JSX.Element }) => {
	return (
		<drab-prefetch class="contents" trigger="a[href^='/']">
			<div>{props.children}</div>
		</drab-prefetch>
	);
};
