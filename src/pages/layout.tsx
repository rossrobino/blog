import { FontPreload } from "@/ui/font-preload";
import { Masthead } from "@/ui/masthead";
import { SkipLink } from "@/ui/skip-link";
import { SocialLinks } from "@/ui/social-links";
import * as script from "client:script";
import * as style from "client:style";
import { type JSX, Render, type Route } from "ovr";

/** Shared document and newspaper shell for every page. */
export const Layout = (props: {
	children?: JSX.Element;
	compact?: boolean;
	current?: string;
	date?: string;
	head: JSX.Element;
	joined?: boolean;
	route?: Route.Get<"/">;
}) => {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				{Render.html(script.tags + style.tags)}
				<FontPreload />
				{props.head}
			</head>
			<body class="font-old-style m-0 tabular-nums sm:m-3 lg:m-6">
				<drab-prefetch class="contents" trigger="a[href^='/']" prerender>
					<SkipLink />
					<div class="newspaper mx-auto max-w-[96rem]">
						<Masthead
							compact={props.compact ?? false}
							{...(props.date ? { date: props.date } : {})}
							{...(props.current ? { current: props.current } : {})}
							joined={props.joined ?? false}
							{...(props.route ? { route: props.route } : {})}
						/>
						<div>
							{props.children}
							{!props.compact && (
								<div class="mt-4 flex justify-end">
									<SocialLinks />
								</div>
							)}
						</div>
					</div>
				</drab-prefetch>
			</body>
		</html>
	);
};
