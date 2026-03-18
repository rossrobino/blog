import { formatDate } from "./format-date";
import { Schema } from "ovr";

export const FrontmatterSchema = Schema.object({
	title: Schema.string(),
	description: Schema.string(),
	keywords: Schema.string().transform((val) =>
		val.split(",").map((s) => s.trim().toLowerCase()),
	),
	date: Schema.string().transform(formatDate),
	draft: Schema.boolean().optional(),
	/** Add the charts entry script if the post has a chart to render. */
	chart: Schema.boolean().optional(),
});
