import { src } from "client:style";

/** Preload fonts emitted with the client bundle. */
export function* FontPreload() {
	for (const path of src.assets) {
		yield (
			<link
				rel="preload"
				href={`/${path}`}
				as="font"
				type="font/woff2"
				crossorigin
			/>
		);
	}
}
