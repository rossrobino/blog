import { tags } from "client:script/echart";
import { Chunk } from "ovr";

const slugs = new Set(["js-server-frameworks"]);

/**
 * @returns A script tag if the post is within the selected slugs.
 */
export const EChartScript = (props: { slug: string }) => {
	if (slugs.has(props.slug)) return Chunk.safe(tags);
};
