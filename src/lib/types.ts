import type { frontmatterSchema } from "@/lib/schema";
import type { MdHeading } from "@robino/md";
import type { InferOutput } from "valibot";

export type Post = InferOutput<typeof frontmatterSchema> & {
	slug: string;
	html: string;
	headings: MdHeading[];
};
