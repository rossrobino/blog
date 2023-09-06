import { load as yamlLoad } from "js-yaml";
import { frontmatterSchema } from "$lib/schemas";
import type { Heading } from "$lib/types";
import { error } from "@sveltejs/kit";

export const processMd = (md: string) => {
	const splitMd = md.split("---");
	const yaml = splitMd.at(1);

	if (!yaml) {
		throw error(
			500,
			"No yaml found.\n\nPlease ensure your frontmatter is at the beginning of your file and is surrounded by fences `---`",
		);
	}

	const strFrontmatter = yamlLoad(yaml);

	const frontmatter = frontmatterSchema.safeParse(strFrontmatter);

	if (!frontmatter.success)
		throw error(500, {
			message: `Invalid frontmatter, please correct or update schema in src/schemas:\n\n${JSON.stringify(
				frontmatter.error.issues[0],
				null,
				4,
			)}`,
		});

	const article = splitMd.slice(2).join("---");

	const headings = getHeadings(article);

	return { frontmatter: frontmatter.data, article, headings };
};

const getHeadings = (md: string) => {
	const lines = md.split("\n");
	const headingRegex = /^(#{1,6})\s*(.+)/;
	const codeFenceRegex = /^```/;

	let inCodeFence = false;
	const headings: Heading[] = [];
	for (const line of lines) {
		// Check for code fence
		if (codeFenceRegex.test(line)) {
			inCodeFence = !inCodeFence;
			continue;
		}

		// Skip headings within code fences
		if (inCodeFence) continue;

		const match = headingRegex.exec(line);
		if (match) {
			const level = match[1].length;
			const name = match[2];

			const id = name
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]+/g, "");

			headings.push({ id, level, name });
		}
	}

	return headings;
};
