import { BarChart } from "echarts/charts";
import {
	GridComponent,
	TitleComponent,
	TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
	BarChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	CanvasRenderer,
]);

class EChart extends HTMLElement {
	get options(): echarts.EChartsCoreOption {
		const name = this.getAttribute("chart-name");

		if (name === "server-framework-stars") {
			const frameworks: { key: string; stars: number; downloads: number }[] = [
				{ key: "@remix-run/fetch-router", stars: 31_900, downloads: 983 },
				{ key: "oak", stars: 5_400, downloads: 4_693 },
				{ key: "ovr", stars: 12, downloads: 7_983 },
				{ key: "elysia", stars: 14_400, downloads: 4_046_258 },
				{ key: "itty-router", stars: 1_980, downloads: 4_505_377 },
				{ key: "polka", stars: 5_500, downloads: 21_142_621 },
				{ key: "hono", stars: 26_800, downloads: 51_702_089 },
				{ key: "h3", stars: 5_000, downloads: 97_483_891 },
				{ key: "fastify", stars: 34_800, downloads: 124_564_221 },
				{ key: "koa", stars: 35_700, downloads: 192_846_224 },
			];

			const categories = frameworks.map((f) => f.key);
			const starData = frameworks.map((f) => f.stars);
			const downloadData = frameworks.map((f) => f.downloads);

			return {
				title: { text: "Popularity" },
				tooltip: { trigger: "axis" },
				xAxis: {
					type: "category",
					data: categories,
					axisLabel: { interval: 0, rotate: -45 },
				},
				yAxis: [
					{ type: "value", name: "GitHub Stars" },
					{ type: "value", name: "npm Downloads" },
				],
				series: [
					{ name: "GitHub Stars", type: "bar", data: starData },
					{
						name: "npm Downloads",
						type: "bar",
						yAxisIndex: 1,
						data: downloadData,
					},
				],
			};
		}

		throw new Error("Unknown `chart-name`");
	}
	connectedCallback() {
		const chart = echarts.init(this);
		chart.setOption(this.options);
		const observer = new ResizeObserver(() => {
			chart.resize();
		});
		observer.observe(this);
	}
}

customElements.define("e-chart", EChart);
