import { youTubeLink } from "@/lib/info";

export const YouTube = () => {
	return (
		<a
			href={youTubeLink}
			class="button ghost icon"
			aria-label="YouTube channel"
		>
			<span class="icon-[ph--youtube-logo] text-xl" aria-hidden="true"></span>
		</a>
	);
};
