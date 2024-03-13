import { dev } from "$app/environment";

export class InArticleAd extends HTMLElement {
	connectedCallback() {
		if (!dev) {
			this.innerHTML = /* html */ `
			<ins class="adsbygoogle block text-center"
			data-ad-layout="in-article"
			data-ad-format="fluid"
			data-ad-client="ca-pub-8551617263542422"
			data-ad-slot="5905781765"></ins>
			`;

			//@ts-ignore - google supplied code
			(adsbygoogle = window.adsbygoogle || []).push({});
		}
	}
}
