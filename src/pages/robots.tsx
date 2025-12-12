import * as info from "@/lib/info";
import * as rss from "@/pages/rss";
import { Route } from "ovr";

const robots = `
User-agent: *
Disallow:

Sitemap: ${info.origin}${rss.page.pathname()}
`.trim();

export const page = Route.get("/robots.txt", (c) => c.text(robots));
