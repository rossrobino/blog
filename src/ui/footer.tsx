import { author, homepage } from "@/lib/info";
import { Repository } from "@/ui/repository";
import { RSS } from "@/ui/rss";
import { YouTube } from "@/ui/youtube";

export const Footer = () => {
	return (
		<footer class="mt-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<a class="button icon ghost" href="/#" aria-label="home">
					{/* home */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="size-5"
					>
						<path
							fill-rule="evenodd"
							d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
							clip-rule="evenodd"
						/>
					</svg>
				</a>
				<div>
					<span>{new Date().getFullYear()} - </span>
					<a href={homepage}>{author}</a>
				</div>
			</div>
			<div class="flex gap-1">
				<RSS />
				<YouTube />
				<Repository />
			</div>
		</footer>
	);
};
