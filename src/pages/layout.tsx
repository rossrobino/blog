import * as script from "client:script";
import * as style from "client:style";
import { type JSX, Render } from "ovr";

export const Layout = (props: {
	children?: JSX.Element;
	head: JSX.Element;
}) => {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				{Render.html(script.tags + style.tags)}
				{props.head}
			</head>
			<body class="font-old-style m-6 tabular-nums">
				<drab-prefetch class="contents" trigger="a[href^='/']">
					<div>{props.children}</div>
				</drab-prefetch>
			</body>
		</html>
	);
};
