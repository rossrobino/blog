import tailwindcss from "@tailwindcss/vite";
import { domco } from "domco";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [domco(), tailwindcss()],
});
