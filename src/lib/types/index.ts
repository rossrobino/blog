import type { frontmatterSchema } from "@/lib/schema";
import type { MdHeading } from "@robino/md";
import type { z } from "zod";

export type Post = z.infer<typeof frontmatterSchema> & {
	slug: string;
	html: string;
	headings: MdHeading[];
};
