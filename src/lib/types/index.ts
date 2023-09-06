import type { frontmatterSchema } from "$lib/schemas";
import type { z } from "zod";

export interface Heading {
	id: string;
	level: number;
	name: string;
}

export type Post = z.infer<typeof frontmatterSchema> & {
	slug: string;
	headings: Heading[];
};
