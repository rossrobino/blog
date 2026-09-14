import type { FrontmatterSchema } from "@/lib/schema";
import type { Heading } from "@robino/md";
import type { Schema } from "ovr";

export type Story = Schema.Infer<typeof FrontmatterSchema> & { slug: string };

export type Post = Story & {
	headings: Heading[];
	html: string;
	source: string;
};
