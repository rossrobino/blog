import * as redis from "@/lib/redis";

export const Analytics = () => {
	return (
		<div class="prose max-w-sm">
			<h1>Analytics</h1>
			<p>
				<a href="/">Home</a>
			</p>
			<drab-tablesort trigger="th" content="tbody">
				<table>
					<thead class="capitalize">
						<tr class="cursor-default">
							<th>slug</th>
							<th data-type="number">views</th>
						</tr>
					</thead>
					<tbody>
						{async () => {
							const slugs = await redis.client.keys("*");
							const views = await redis.client.mget(...slugs);

							return slugs.map((slug, i) => {
								if (!slug) return null;

								return (
									<tr>
										<td>{slug.slice("posts/".length)}</td>
										<td>{views[i] as any}</td>
									</tr>
								);
							});
						}}
					</tbody>
				</table>
			</drab-tablesort>
		</div>
	);
};
