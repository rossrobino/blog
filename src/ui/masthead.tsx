import { parseDate } from "@/lib/format-date";
import { keywords } from "@/lib/get-posts";
import * as info from "@/lib/info";
import { SiteSearch } from "@/ui/site-search";
import type { Route } from "ovr";

/** Shared newspaper-style site masthead and topic navigation. */
export const Masthead = ({
	compact = false,
	current,
	date,
	joined = false,
	route,
}: {
	compact?: boolean;
	current?: string;
	date?: string;
	joined?: boolean;
	route?: Route.Get<"/">;
}) => {
	const value = date ? parseDate(date) : new Date();

	return (
		<header
			class={`newspaper-double-rule-top cursor-default ${joined ? "" : "mb-6"}`}
		>
			<div
				class={`border-foreground/35 grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2 text-xs tracking-[0.16em] uppercase ${compact ? "" : "border-b"}`}
			>
				<a
					href={route?.pathname() ?? "/"}
					class="col-start-1 text-start no-underline"
				>
					{info.title}
				</a>
				<span class="col-start-2 hidden text-center italic sm:inline">
					{info.location}
				</span>
				<span class="col-start-3 text-end">
					<span class="hidden md:inline">
						{new Intl.DateTimeFormat("en-US", {
							dateStyle: "full",
							timeZone: "America/Detroit",
						}).format(value)}
					</span>
					<span class="md:hidden">
						{new Intl.DateTimeFormat("en-US", {
							dateStyle: "long",
							timeZone: "America/Detroit",
						}).format(value)}
					</span>
				</span>
			</div>

			{!compact && (
				<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-6 pb-3 text-center md:pt-7 md:pb-4">
					<div class="text-left">
						<p class="hidden text-sm italic md:block">
							Independent journal,
							<br />
							written by <a href={info.homepage}>{info.author}</a>
						</p>
					</div>
					<h1 class="text-3xl font-black sm:text-4xl lg:text-6xl">
						{info.title}
					</h1>
					<div class="flex justify-end">
						<SiteSearch />
					</div>
				</div>
			)}

			{!compact && (
				<nav class="pt-2 pb-1.5" aria-label="Filter posts by topic">
					<div class="overflow-x-auto pb-1.5">
						<div class="mx-auto flex w-max min-w-full items-center justify-center gap-2">
							<a
								href={route?.pathname() ?? "/"}
								class="button ghost shrink-0 uppercase"
								aria-current={current === "all" ? "page" : "false"}
							>
								All
							</a>
							{keywords.map((filter) => (
								<a
									href={
										route?.url({ search: { filter } }) ??
										`/?filter=${encodeURIComponent(filter)}`
									}
									class="button ghost shrink-0 uppercase"
									aria-current={filter === current ? "page" : "false"}
								>
									{filter}
								</a>
							))}
						</div>
					</div>
				</nav>
			)}
			<div
				class={
					compact
						? "border-foreground border-b"
						: "newspaper-double-rule-bottom newspaper-double-rule-inverted"
				}
				aria-hidden="true"
			></div>
		</header>
	);
};
