import { error } from "@sveltejs/kit";

export const getSlug = (path: string) => {
	const parts = path.split("/");
	const filename = parts.pop() || "";
	const slug = filename.split(".").at(0);
	if (slug) return slug;
	throw error(500, `No slug found for ${path}`);
};
