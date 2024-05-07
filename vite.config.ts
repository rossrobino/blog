import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import { type Plugin } from "postcss";

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [tailwindcss() as Plugin, autoprefixer()],
		},
	},
});
