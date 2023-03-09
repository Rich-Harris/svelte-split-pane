<script>
	import SplitPane from '$lib/SplitPane.svelte';
</script>

<div class="demo">
	<header>
		<h1>svelte-split-pane</h1>
	</header>
	<main>
		<SplitPane type="horizontal" min="25%" max="50%" pos="50%" --color="black">
			<section slot="a" style="background: palegoldenrod">
				<SplitPane type="vertical" min="100px" max="-100px" pos="50%">
					<section slot="a">
						<div class="pane">
							<p>min width 25%</p>
							<p>min height 100px</p>
						</div>
					</section>
					<section slot="b" style="background: orange">
						<!---->
					</section>
				</SplitPane>
			</section>
			<section slot="b" style="background: teal">
				<!---->
			</section>
		</SplitPane>
	</main>
</div>

<style>
	:root {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
