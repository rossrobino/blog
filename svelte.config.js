import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter({
			isr: {
				expiration: false,
			},
		}),
	},
	vitePlugin: {
		inspector: true,
	},
};
