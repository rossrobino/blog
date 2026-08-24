import { origin, title } from "@/lib/info";

export const SiteSearch = () => {
	return (
		<>
			<button
				commandfor="site-search"
				command="show-modal"
				type="button"
				class="ghost icon cursor-default"
				aria-label="Open search dialog"
			>
				<span
					class="icon-[ph--magnifying-glass] text-xl"
					aria-hidden="true"
				></span>
			</button>
			<dialog
				id="site-search"
				closedby="any"
				aria-label={`Search ${title}`}
				class="search-dialog backdrop:bg-background/60 m-auto backdrop:backdrop-blur-lg"
			>
				<form action="https://google.com/search" role="search">
					<label for="site-search-query" class="sr-only">
						Search {title}
					</label>
					<input
						id="site-search-query"
						type="search"
						name="q"
						placeholder={`Search ${title}`}
						class="border-foreground min-w-72"
						required
					/>
					<input type="hidden" name="q" value={`site:${origin}`} />
				</form>
			</dialog>
		</>
	);
};
