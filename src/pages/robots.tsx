import * as info from "@/lib/info";
import { Get } from "ovr";

export const page = new Get("/robots.txt", (c) =>
	c.text(
		`
User-agent: *
Disallow:

Sitemap: ${info.origin}/rss
`.trim(),
	),
);
