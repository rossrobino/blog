import * as info from "@/lib/info";

export const Head = ({
	title = info.title,
	description = info.description,
	canonical = "/",
	noindex = false,
	type = "website",
}: {
	title?: string;
	description?: string;
	canonical?: string;
	noindex?: boolean;
	type?: "article" | "website";
}) => {
	const url = new URL(canonical, info.origin).toString();

	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:site_name" content={info.title} />
			<meta property="og:type" content={type} />
			<meta property="og:url" content={url} />
			{noindex && <meta name="robots" content="noindex" />}
		</>
	);
};
