import * as info from "@/lib/info";

export const Head = (props: { title?: string; description?: string }) => {
	const { title = info.title, description = info.description } = props;
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
		</>
	);
};
