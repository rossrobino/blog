import * as info from "@/lib/info";

export const Head = ({
	title = info.title,
	description = info.description,
}: {
	title?: string;
	description?: string;
}) => {
	return (
		<>
			<title>{title}</title>
			<meta name="description" content={description} />
		</>
	);
};
