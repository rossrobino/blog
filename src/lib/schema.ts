import { formatDate } from "./format-date";
import * as v from "valibot";

export const FrontmatterSchema = v.strictObject({
	title: v.string(),
	description: v.string(),
	keywords: v.pipe(
		v.string(),
		v.transform((val) => val.split(",").map((s) => s.trim().toLowerCase())),
	),
	date: v.pipe(v.string(), v.transform(formatDate)),
	draft: v.optional(v.boolean()),
	/** Add the charts entry script if the post has a chart to render. */
	chart: v.optional(v.boolean()),
});
