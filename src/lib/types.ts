import type { FrontmatterSchema } from "@/lib/schema";
import type { Heading } from "@robino/md";
import type { Schema } from "ovr";

export type Post = Schema.Infer<typeof FrontmatterSchema> & {
	slug: string;
	html?: string;
	headings?: Heading[];
};
