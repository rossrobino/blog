# blog.robino.dev

I created this blog as a place to write about topics I am interested in. Check it out at [blog.robino.dev](https://blog.robino.dev/).

## Use as a Template

MIT License

Feel free to fork this project and use it as a template.

### Local Development

- Fork the project
- Install dependencies: `npm i`
- `npm run dev`

### About

- Edit `src/lib/info` with your information
- Content is located in `src/content`
- Edit `frontmatterSchema` in `src/lib/schema` if you would like to change the front-matter schema in your posts. This zod schema validates the front-matter of each post and throws errors if it is invalid.
- Edit color scheme in `src/client/tailwind.css`, this template uses [uico](https://uico.robino.dev).

### Deployment

The project is set up to deploy to Vercel, swap the adapter to deploy elsewhere.
