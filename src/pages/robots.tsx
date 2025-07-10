import * as info from "@/lib/info";
import * as rss from "@/pages/rss";
import { Get } from "ovr";

const robots = `
User-agent: *
Disallow:

Sitemap: ${info.origin}${rss.page.pathname()}
`.trim();

export const page = new Get("/robots.txt", (c) => c.text(robots));
