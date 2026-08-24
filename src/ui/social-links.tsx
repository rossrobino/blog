import { Repository } from "@/ui/repository";
import { RSS } from "@/ui/rss";
import { YouTube } from "@/ui/youtube";

/** Links to the journal's feeds and social profiles. */
export const SocialLinks = () => {
	return (
		<nav class="flex items-center gap-1" aria-label="Follow this journal">
			<RSS />
			<YouTube />
			<Repository />
		</nav>
	);
};
