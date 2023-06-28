<script lang="ts">
	let dialog: HTMLDialogElement;
</script>

<button on:click={() => dialog.showModal()}>Show Dialog</button>

<dialog bind:this={dialog} class="rounded-sm shadow-xl">
	<p>A dialog element</p>
	<div class="flex gap-4">
		<form method="dialog">
			<button>Close with method="dialog"</button>
		</form>
		<button on:click={() => dialog.close()}>Close with .close()</button>
	</div>
</dialog>
