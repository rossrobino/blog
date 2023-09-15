import type { frontmatterSchema } from "$lib/schemas/mod";
import type { z } from "zod";
import type { MdHeading } from "robino/util/md";

export type Post = z.infer<typeof frontmatterSchema> & {
	slug: string;
	headings: MdHeading[];
};
