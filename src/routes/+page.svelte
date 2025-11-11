<script lang="ts">
	import SplitPane from '$lib/SplitPane.svelte';
	import type { Length } from '$lib/types.js';

	let width = $state<Length>('50%');
	let height = $state<Length>('-100px');
</script>

<div class="demo">
	<header>
		<h1>svelte-split-pane</h1>
	</header>

	<main>
		<SplitPane type="columns" min="25%" max="50%" bind:pos={width} --color="black">
			{#snippet a()}
				<SplitPane type="rows" min="100px" max="-100px" bind:pos={height}>
					{#snippet a()}
						<div class="pane" style="background: palegoldenrod">
							<p>width: {width}</p>
							<p>height: {height}</p>
						</div>
					{/snippet}

					{#snippet b()}
						<div class="pane" style="background: orange">
							<!---->
						</div>
					{/snippet}
				</SplitPane>
			{/snippet}

			{#snippet b()}
				<div class="pane" style="background: teal">
					<!---->
				</div>
			{/snippet}
		</SplitPane>
	</main>
</div>

<style>
	:root {
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		margin: 0;
	}

	.demo {
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	header {
		padding: 1rem;
	}

	h1 {
		margin: 0;
	}

	main {
		flex: 1;
		border-top: 1px solid black;
	}

	.pane {
		padding: 1rem;
		box-sizing: border-box;
	}
</style>
