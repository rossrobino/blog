import { sveltekit } from "@sveltejs/kit/vite";
import autoprefixer from "autoprefixer";
import { type Plugin } from "postcss";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: {
			plugins: [tailwindcss() as Plugin, autoprefixer()],
		},
	},
});
