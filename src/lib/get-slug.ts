export const getSlug = (path: string) => {
	const parts = path.split("/");
	const filename = parts.pop() || "";
	const slug = filename.split(".").at(0);
	if (slug) return slug;

	throw new Error(`No slug found for ${path}`);
};
