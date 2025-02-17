import { formatDate } from "@/lib/format-date";
import * as v from "valibot";

export const frontmatterSchema = v.strictObject({
	title: v.string(),
	description: v.string(),
	keywords: v.pipe(
		v.string(),
		v.transform((val) => val.split(",").map((s) => s.trim().toLowerCase())),
	),
	date: v.pipe(v.string(), v.transform(formatDate)),
	draft: v.optional(v.boolean()),
});
