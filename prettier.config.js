export default {
	useTabs: true,
	bracketSameLine: false,
	htmlWhitespaceSensitivity: "ignore",
	printWidth: 80,
	plugins: [
		"prettier-plugin-astro",
		"prettier-plugin-svelte",
		"prettier-plugin-tailwindcss",
	],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
	],
};
