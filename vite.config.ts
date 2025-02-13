import { adapter } from "@domcojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { domco } from "domco";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		domco({
			adapter: adapter({
				isr: {
					expiration: false,
					allowQuery: ["__pathname", "filter"],
					passQuery: true,
				},
			}),
		}),
		tailwindcss(),
	],
});
