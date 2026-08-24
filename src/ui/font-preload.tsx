import { src } from "client:style";

/** Preload fonts emitted with the client bundle. */
export const FontPreload = () =>
	src.assets.map((path) => (
		<link
			rel="preload"
			href={`/${path}`}
			as="font"
			type="font/woff2"
			crossorigin
		/>
	));
