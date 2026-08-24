import { repository } from "@/lib/info";

export const Repository = () => {
	return (
		<a href={repository} aria-label="Repository" class="button ghost icon">
			<span class="icon-[ph--github-logo] text-xl" aria-hidden="true"></span>
		</a>
	);
};
