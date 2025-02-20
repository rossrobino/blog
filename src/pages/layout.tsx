import type { Children } from "@robino/jsx";

export const RootLayout = (props: { children?: Children }) => {
	const { children } = props;
	return (
		<drab-prefetch class="contents" prerender trigger="a[href^='/']">
			<div>{children}</div>
		</drab-prefetch>
	);
};
