import typography from "@tailwindcss/typography";

import { uico } from "uico";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,ts,svelte}"],
	plugins: [typography, uico],
};
