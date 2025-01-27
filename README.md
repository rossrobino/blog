# blog.robino.dev

I created this blog as a place to write about topics I am interested in. Check it out at [blog.robino.dev](https://blog.robino.dev/).

## Tooling

- [SvelteKit](https://kit.svelte.dev)
- TypeScript
- [Vite](https://github.com/vitejs/vite/tree/main/#readme)
- [`drab` - components](https://drab.robino.dev)
- [TailwindCSS](https://tailwindcss.com/)
- [`uico`](https://uico.robino.dev)
- [`@robino/md` - markdown parser](https://github.com/rossrobino/robino)

## Use as a Template

MIT License

Feel free to fork this project and use it as a template.

### Local Development

- Fork the project
- Install dependencies: `bun i`
- `bun dev`

### About

- Edit `src/lib/info` with your information
- Content is located in `src/content`
- Edit `frontmatterSchema` in `src/lib/schemas` if you would like to change the front-matter schema in your posts. This zod schema validates the front-matter of each post and throws errors if it is invalid.
- Edit color scheme in `src/tailwind.css`, this template uses [uico](https://uico.robino.dev), you can use the docs generate the css properties for the theme.

### Deployment

The project is set up to deploy to Vercel with the static adapter and Vercel analytics. If you want to change this follow these instructions.

- Update the adapter in `svelte.config.js` based on your deployment method, `bun rm @sveltejs/adapter-vercel`, [follow these instructions](https://kit.svelte.dev/docs/adapters).
