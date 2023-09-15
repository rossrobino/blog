import { formatDate } from "$lib/util/formatDate";
import { z } from "zod";

export const frontmatterSchema = z
	.object({
		title: z.string(),
		description: z.string(),
		keywords: z
			.string()
			.transform((val) => val.split(",").map((s) => s.trim().toLowerCase())),
		date: z.string().transform((s) => {
			return formatDate(s);
		}),
	})
	.strict();
