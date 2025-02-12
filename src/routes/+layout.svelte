<script lang="ts">
	import "../tailwind.css";
	import Breakpoint from "$lib/components/Breakpoint.svelte";
	import { author, homepage, title } from "$lib/info";
	import RSS from "$lib/components/RSS.svelte";
	import YouTubeLink from "$lib/components/YouTubeLink.svelte";
	import RepoLink from "$lib/components/RepoLink.svelte";

	// https://svelte.dev/blog/view-transitions
	import { onNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	onNavigate((navigation) => {
		// not supported in all browsers
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<svelte:head>
	{#if !dev}
		<script>
			!(function (t, e) {
				var o, n, p, r;
				e.__SV ||
					((window.posthog = e),
					(e._i = []),
					(e.init = function (i, s, a) {
						function g(t, e) {
							var o = e.split(".");
							2 == o.length && ((t = t[o[0]]), (e = o[1])),
								(t[e] = function () {
									t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
								});
						}
						((p = t.createElement("script")).type = "text/javascript"),
							(p.crossOrigin = "anonymous"),
							(p.async = !0),
							(p.src =
								s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
								"/static/array.js"),
							(r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
								p,
								r,
							);
						var u = e;
						for (
							void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
								u.people = u.people || [],
								u.toString = function (t) {
									var e = "posthog";
									return (
										"posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
									);
								},
								u.people.toString = function () {
									return u.toString(1) + ".people (stub)";
								},
								o =
									"init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(
										" ",
									),
								n = 0;
							n < o.length;
							n++
						)
							g(u, o[n]);
						e._i.push([i, s, a]);
					}),
					(e.__SV = 1));
			})(document, window.posthog || []);
			posthog.init("phc_lV7DfhfO7GHWiPsWHpFu1aDqXPfvg9FMETDIVxZafk1", {
				api_host: "https://us.i.posthog.com",
			});
		</script>
	{/if}
</svelte:head>

<Breakpoint />

<div class="mx-auto max-w-[90ch] tabular-nums">
	<header class="mb-8 flex flex-wrap justify-between gap-4">
		<div class="my-0">
			<a
				href="/"
				class="text-2xl font-extrabold uppercase italic no-underline"
				aria-label="Homepage"
			>
				{title}
			</a>
		</div>
		<form action="https://google.com/search" method="get">
			<input
				type="search"
				name="q"
				placeholder="Search blog.robino.dev"
				class="min-w-52"
			/>
			<input type="hidden" name="q" value="site:blog.robino.dev" />
		</form>
	</header>

	<main>{@render children()}</main>

	<footer class="mt-8 flex items-center justify-between gap-4">
		<div>
			<span>{new Date().getFullYear()} -</span>
			<a href={homepage}>{author}</a>
		</div>
		<div class="flex gap-1">
			<RSS />
			<YouTubeLink />
			<RepoLink />
		</div>
	</footer>
</div>
