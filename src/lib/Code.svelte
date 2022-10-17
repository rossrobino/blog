<script>
	import Prism from "svelte-prism";
	export let language = "html";
</script>

<div
	class="
    bg-neutral-900
    text-neutral-100
    font-mono
    p-2
    my-2
    rounded-sm
    w-fit
    text-xs
	w-full
	overflow-x-scroll
"
>
	<Prism {language} >
		<slot />
	</Prism>
</div>
