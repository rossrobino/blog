import { title, url } from "@/lib/info";

export const SiteSearch = () => {
	return (
		<drab-dialog class="contents" remove-body-scroll click-outside-close>
			<button
				data-trigger
				type="button"
				class="ghost icon"
				aria-label="Open search dialog"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<dialog
				data-content
				class="backdrop:bg-background/60 m-auto opacity-0 transition-[display,opacity] transition-discrete duration-300 backdrop:opacity-0 backdrop:backdrop-blur-lg backdrop:transition-[display,opacity] backdrop:transition-discrete backdrop:duration-300 open:opacity-100 open:backdrop:opacity-100 starting:open:opacity-0 starting:open:backdrop:opacity-0"
			>
				<form action="https://google.com/search" method="get">
					<input
						type="search"
						name="q"
						placeholder={`Search ${title}`}
						class="border-foreground min-w-72"
					/>
					<input type="hidden" name="q" value={`site:${url}`} />
				</form>
			</dialog>
		</drab-dialog>
	);
};
