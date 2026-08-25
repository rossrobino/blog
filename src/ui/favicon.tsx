import { logo } from "@/lib/logo";

export const FavIcon = () => (
	<>
		<link
			rel="icon"
			type="image/svg+xml"
			href={logo.black}
			media="(prefers-color-scheme: light)"
		/>
		<link
			rel="icon"
			type="image/svg+xml"
			href={logo.white}
			media="(prefers-color-scheme: dark)"
		/>
	</>
);
