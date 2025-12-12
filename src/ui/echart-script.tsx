import type { Post } from "@/lib/types";
import { tags } from "client:script/echart";
import { Render } from "ovr";

/**
 * @returns A script tag if the post is within the selected slugs.
 */
export const EChartScript = (props: { post: Post }) => {
	if (!props.post.chart) return;

	return Render.html(tags);
};
